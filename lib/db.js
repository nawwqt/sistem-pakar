import pg from "pg";
import fs from "fs";
import path from "path";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const DATA_FILE = path.join(process.cwd(), "db", "data.json");

// Ensure db directory exists
const dbDir = path.join(process.cwd(), "db");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let realPool = null;
let useFallback = false;

if (connectionString) {
  try {
    realPool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 2000,
    });

    realPool.on("error", (err) => {
      console.warn("PostgreSQL pool connection error, falling back to local storage:", err.message);
      useFallback = true;
    });
  } catch (err) {
    console.warn("Failed to initialize PostgreSQL pool:", err.message);
    useFallback = true;
  }
} else {
  useFallback = true;
}

// Fallback JSON data manager
function readFallbackData() {
  if (!fs.existsSync(DATA_FILE)) {
    return {
      users: [],
      symptoms: [],
      cases: [],
      recommendations: [],
      diagnoses: [],
    };
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return {
      users: [],
      symptoms: [],
      cases: [],
      recommendations: [],
      diagnoses: [],
    };
  }
}

function writeFallbackData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Execute query against real PostgreSQL, falling back to file-based store if connection fails
 */
export async function query(text, params = []) {
  if (!useFallback && realPool) {
    try {
      const res = await realPool.query(text, params);
      return res;
    } catch (err) {
      if (
        err.code === "ECONNREFUSED" ||
        err.code === "ENOTFOUND" ||
        err.code === "ETIMEDOUT" ||
        err.message.includes("Connection terminated")
      ) {
        console.warn("Live PostgreSQL connection failed. Using persistent local storage fallback.");
        useFallback = true;
      } else {
        throw err;
      }
    }
  }

  // Fallback query executor for standard schema queries
  return executeFallbackQuery(text, params);
}

function executeFallbackQuery(text, params) {
  const data = readFallbackData();
  const cleanSql = text.trim().replace(/\s+/g, " ");

  // 1a. SELECT * FROM symptoms WHERE code = $1
  if (/^SELECT \* FROM symptoms WHERE code = \$1/i.test(cleanSql)) {
    const [code] = params;
    const rows = data.symptoms.filter((s) => s.code.toLowerCase() === (code || "").toLowerCase());
    return { rows, rowCount: rows.length };
  }

  // 1b. SELECT * FROM symptoms
  if (/^SELECT \* FROM symptoms/i.test(cleanSql)) {
    const rows = [...data.symptoms].sort((a, b) => a.code.localeCompare(b.code));
    return { rows, rowCount: rows.length };
  }

  // 2. UPDATE symptoms SET weight = $1 WHERE code = $2
  if (/^UPDATE symptoms SET weight = \$1 WHERE code = \$2/i.test(cleanSql)) {
    const [weight, code] = params;
    const item = data.symptoms.find((s) => s.code === code);
    if (item) {
      item.weight = Number(weight);
      writeFallbackData(data);
      return { rows: [item], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 3a. SELECT * FROM cases WHERE code = $1
  if (/^SELECT \* FROM cases WHERE code = \$1/i.test(cleanSql)) {
    const [code] = params;
    const rows = data.cases.filter((c) => c.code.toLowerCase() === (code || "").toLowerCase());
    return { rows, rowCount: rows.length };
  }

  // 3b. SELECT * FROM cases
  if (/^SELECT \* FROM cases/i.test(cleanSql)) {
    const rows = [...data.cases].sort((a, b) =>
      a.code.localeCompare(b.code, undefined, { numeric: true })
    );
    return { rows, rowCount: rows.length };
  }

  // 4. INSERT INTO cases
  if (/^INSERT INTO cases/i.test(cleanSql)) {
    const [code, symptoms, level, is_placeholder] = params;
    const existingIdx = data.cases.findIndex((c) => c.code === code);
    const newCase = {
      code,
      symptoms: Array.isArray(symptoms) ? symptoms : JSON.parse(symptoms || "[]"),
      level,
      is_placeholder: Boolean(is_placeholder),
      created_at: new Date().toISOString(),
    };
    if (existingIdx >= 0) {
      data.cases[existingIdx] = newCase;
    } else {
      data.cases.push(newCase);
    }
    writeFallbackData(data);
    return { rows: [newCase], rowCount: 1 };
  }

  // 5. DELETE FROM cases WHERE code = $1
  if (/^DELETE FROM cases WHERE code = \$1/i.test(cleanSql)) {
    const [code] = params;
    const initialLen = data.cases.length;
    data.cases = data.cases.filter((c) => c.code !== code);
    writeFallbackData(data);
    return { rows: [], rowCount: initialLen - data.cases.length };
  }

  // 6. SELECT * FROM recommendations WHERE level = $1
  if (/^SELECT \* FROM recommendations WHERE level = \$1/i.test(cleanSql)) {
    const [level] = params;
    const rows = data.recommendations.filter((r) => r.level.toLowerCase() === (level || "").toLowerCase());
    return { rows, rowCount: rows.length };
  }

  // 7. SELECT * FROM recommendations
  if (/^SELECT \* FROM recommendations/i.test(cleanSql)) {
    return { rows: data.recommendations, rowCount: data.recommendations.length };
  }

  // 8. SELECT * FROM users WHERE email = $1
  if (/^SELECT \* FROM users WHERE email = \$1/i.test(cleanSql)) {
    const [email] = params;
    const rows = data.users.filter((u) => u.email.toLowerCase() === (email || "").toLowerCase());
    return { rows, rowCount: rows.length };
  }

  // 9. SELECT * FROM users WHERE id = $1
  if (/^SELECT \* FROM users WHERE id = \$1/i.test(cleanSql)) {
    const [id] = params;
    const rows = data.users.filter((u) => String(u.id) === String(id));
    return { rows, rowCount: rows.length };
  }

  // 10. INSERT INTO users (name, email, password_hash, role) ... RETURNING *
  if (/^INSERT INTO users/i.test(cleanSql)) {
    const [name, email, password_hash, role = "user"] = params;
    const existing = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (cleanSql.includes("ON CONFLICT")) {
        return { rows: [existing], rowCount: 1 };
      }
      const err = new Error("Key (email)=(" + email + ") already exists.");
      err.code = "23505";
      throw err;
    }
    const nextId = (data.users.reduce((max, u) => Math.max(max, u.id || 0), 0) || 0) + 1;
    const newUser = {
      id: nextId,
      name,
      email,
      password_hash,
      role,
      created_at: new Date().toISOString(),
    };
    data.users.push(newUser);
    writeFallbackData(data);
    return { rows: [newUser], rowCount: 1 };
  }

  // 10b. UPDATE users SET name = $1 WHERE id = $2
  if (/^UPDATE users SET name = \$1 WHERE id = \$2/i.test(cleanSql)) {
    const [name, id] = params;
    const user = data.users.find((u) => String(u.id) === String(id));
    if (user) {
      user.name = name;
      writeFallbackData(data);
      return { rows: [user], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 10c. UPDATE users SET name = $1, password_hash = $2 WHERE id = $3
  if (/^UPDATE users SET name = \$1, password_hash = \$2 WHERE id = \$3/i.test(cleanSql)) {
    const [name, passwordHash, id] = params;
    const user = data.users.find((u) => String(u.id) === String(id));
    if (user) {
      user.name = name;
      user.password_hash = passwordHash;
      writeFallbackData(data);
      return { rows: [user], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 11. INSERT INTO diagnoses ... RETURNING *
  if (/^INSERT INTO diagnoses/i.test(cleanSql)) {
    const [userId, childLabel, symptoms, bestCase, similarity, level, topMatches] = params;
    const nextId = (data.diagnoses.reduce((max, d) => Math.max(max, d.id || 0), 0) || 0) + 1;
    const newDiag = {
      id: nextId,
      user_id: userId,
      child_label: childLabel,
      symptoms: Array.isArray(symptoms) ? symptoms : JSON.parse(symptoms || "[]"),
      best_case: bestCase,
      similarity: Number(similarity),
      level,
      top_matches: typeof topMatches === "string" ? JSON.parse(topMatches) : topMatches,
      revised_level: null,
      retained: false,
      created_at: new Date().toISOString(),
    };
    data.diagnoses.push(newDiag);
    writeFallbackData(data);
    return { rows: [newDiag], rowCount: 1 };
  }

  // 12. SELECT * FROM diagnoses WHERE id = $1
  if (/^SELECT \* FROM diagnoses WHERE id = \$1/i.test(cleanSql)) {
    const [id] = params;
    const rows = data.diagnoses.filter((d) => String(d.id) === String(id));
    return { rows, rowCount: rows.length };
  }

  // 13. SELECT d.*, u.name as user_name FROM diagnoses d LEFT JOIN users u ... WHERE d.user_id = $1
  if (/FROM diagnoses\b.*?\bWHERE\b.*?user_id\s*=\s*\$1/i.test(cleanSql)) {
    const [userId] = params;
    const rows = data.diagnoses
      .filter((d) => String(d.user_id) === String(userId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows, rowCount: rows.length };
  }

  // 14. SELECT d.*, u.name as user_name FROM diagnoses d LEFT JOIN users u ORDER BY d.created_at DESC
  if (/FROM diagnoses/i.test(cleanSql)) {
    const rows = data.diagnoses
      .map((d) => {
        const user = data.users.find((u) => u.id === d.user_id);
        return { ...d, user_name: user ? user.name : "Pengguna" };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows, rowCount: rows.length };
  }

  // 15. UPDATE diagnoses SET revised_level = $1 WHERE id = $2
  if (/^UPDATE diagnoses SET revised_level = \$1 WHERE id = \$2/i.test(cleanSql)) {
    const [revisedLevel, id] = params;
    const diag = data.diagnoses.find((d) => String(d.id) === String(id));
    if (diag) {
      diag.revised_level = revisedLevel;
      writeFallbackData(data);
      return { rows: [diag], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 16. UPDATE diagnoses SET retained = \$1 WHERE id = \$2
  if (/^UPDATE diagnoses SET retained = \$1 WHERE id = \$2/i.test(cleanSql)) {
    const [retained, id] = params;
    const diag = data.diagnoses.find((d) => String(d.id) === String(id));
    if (diag) {
      diag.retained = Boolean(retained);
      writeFallbackData(data);
      return { rows: [diag], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // Generic fallback: return empty
  return { rows: [], rowCount: 0 };
}

export default { query };
