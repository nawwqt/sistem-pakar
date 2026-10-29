import fs from "fs";
import path from "path";
import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const adminEmail = process.env.ADMIN_EMAIL || "admin@bacabisa.ac.id";
const adminPassword = process.env.ADMIN_PASSWORD || "adminsecret123";

const DATA_FILE = path.join(process.cwd(), "db", "data.json");
const SCHEMA_FILE = path.join(process.cwd(), "db", "schema.sql");

// Symptoms seed data
const initialSymptoms = [
  { code: "G01", name: "Sulit mengenali huruf", weight: 3 },
  { code: "G02", name: "Tertukar huruf (b–d, p–q)", weight: 2 },
  { code: "G03", name: "Lambat membaca", weight: 2 },
  { code: "G04", name: "Salah eja", weight: 2 },
  { code: "G05", name: "Sulit memahami bacaan", weight: 3 },
  { code: "G06", name: "Sulit menulis kata sederhana", weight: 3 },
  { code: "G07", name: "Menghindari kegiatan membaca", weight: 1 },
];

// Cases seed data
const initialCases = [
  // Ringan (Placeholder C01-C07)
  { code: "C01", symptoms: ["G02"], level: "Ringan", is_placeholder: true },
  { code: "C02", symptoms: ["G04"], level: "Ringan", is_placeholder: true },
  { code: "C03", symptoms: ["G03"], level: "Ringan", is_placeholder: true },
  { code: "C04", symptoms: ["G02", "G04"], level: "Ringan", is_placeholder: true },
  { code: "C05", symptoms: ["G02", "G03"], level: "Ringan", is_placeholder: true },
  { code: "C06", symptoms: ["G04", "G05"], level: "Ringan", is_placeholder: true },
  { code: "C07", symptoms: ["G06"], level: "Ringan", is_placeholder: true },

  // Sedang (C08-C14)
  { code: "C08", symptoms: ["G02", "G03", "G04"], level: "Sedang", is_placeholder: false },
  { code: "C09", symptoms: ["G03", "G04", "G05"], level: "Sedang", is_placeholder: false },
  { code: "C10", symptoms: ["G02", "G04", "G06"], level: "Sedang", is_placeholder: false },
  { code: "C11", symptoms: ["G02", "G03", "G04", "G05"], level: "Sedang", is_placeholder: false },
  { code: "C12", symptoms: ["G03", "G04", "G06", "G07"], level: "Sedang", is_placeholder: false },
  { code: "C13", symptoms: ["G01", "G02", "G04"], level: "Sedang", is_placeholder: false },
  { code: "C14", symptoms: ["G03", "G05", "G06", "G07"], level: "Sedang", is_placeholder: false },

  // Berat (C15-C20)
  { code: "C15", symptoms: ["G01", "G02", "G03", "G04", "G06"], level: "Berat", is_placeholder: false },
  { code: "C16", symptoms: ["G01", "G02", "G03", "G04", "G05", "G06"], level: "Berat", is_placeholder: false },
  { code: "C17", symptoms: ["G01", "G03", "G04", "G05", "G06", "G07"], level: "Berat", is_placeholder: false },
  { code: "C18", symptoms: ["G01", "G02", "G03", "G05", "G06", "G07"], level: "Berat", is_placeholder: false },
  { code: "C19", symptoms: ["G01", "G02", "G03", "G04", "G05", "G06", "G07"], level: "Berat", is_placeholder: false },
  { code: "C20", symptoms: ["G01", "G02", "G04", "G05", "G06", "G07"], level: "Berat", is_placeholder: false },
];

// Initial advice recommendations
const initialRecommendations = [
  {
    level: "Ringan",
    advice: "Lakukan latihan membaca dan menulis rutin setiap hari di rumah secara santai tanpa tekanan (15-20 menit). Berikan pujian atas setiap kemajuan kecil, gunakan media bergambar atau buku cerita menarik, dan komunikasikan perkembangan dengan guru kelas untuk pemantauan bersama di sekolah.",
  },
  {
    level: "Sedang",
    advice: "Konsultasikan perkembangan anak dengan guru pendidikan khusus (GPK) atau psikolog anak di sekolah. Terapkan metode belajar multisensori (VAKT: Visual, Auditori, Kinestetik, dan Taktil), berikan waktu tambahan saat mengerjakan tugas membaca/menulis, dan hindari meminta anak membaca keras di depan kelas tanpa persiapan.",
  },
  {
    level: "Berat",
    advice: "Segera lakukan asesmen komprehensif bersama psikolog anak, psikiater anak, atau terapis wicara/rehabilitasi medik. Susun Program Pembelajaran Individual (PPI) yang disesuaikan secara khusus, dampingi secara intensif oleh shadow teacher atau terapis ahli, serta berikan dukungan emosional berkelanjutan agar kepercayaan diri anak tetap terjaga.",
  },
];

async function setup() {
  console.log("=== Menjalankan Setup Database BacaBisa ===");

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  let pool = null;
  let usePg = false;

  if (connectionString) {
    try {
      const isNeonOrSsl = connectionString.includes("neon.tech") || connectionString.includes("sslmode=require") || process.env.NODE_ENV === "production";
      pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 15000,
        ssl: isNeonOrSsl ? { rejectUnauthorized: false } : false,
      });
      // Test connection
      await pool.query("SELECT 1");
      usePg = true;
      console.log("✓ Terhubung ke PostgreSQL pada:", connectionString);
    } catch (err) {
      console.warn("! Tidak dapat terhubung ke server PostgreSQL (" + err.message + ").");
      console.log("→ Menggunakan database lokal persisten (db/data.json).");
      usePg = false;
    }
  } else {
    console.log("→ DATABASE_URL tidak diatur. Menggunakan database lokal persisten (db/data.json).");
  }

  if (usePg && pool) {
    try {
      // 1. Eksekusi Schema DDL
      const schemaSql = fs.readFileSync(SCHEMA_FILE, "utf-8");
      await pool.query(schemaSql);
      console.log("✓ Skema tabel berhasil dibuat / diverifikasi.");

      // 2. Seed Admin
      await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, 'admin')
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin'`,
        ["Administrator BacaBisa", adminEmail, adminPasswordHash]
      );
      console.log(`✓ Akun admin siap: ${adminEmail}`);

      // 3. Seed Symptoms
      for (const s of initialSymptoms) {
        await pool.query(
          `INSERT INTO symptoms (code, name, weight)
           VALUES ($1, $2, $3)
           ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name`,
          [s.code, s.name, s.weight]
        );
      }
      console.log(`✓ 7 Gejala berhasil di-seed (idempotent).`);

      // 4. Seed Cases
      for (const c of initialCases) {
        await pool.query(
          `INSERT INTO cases (code, symptoms, level, is_placeholder)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (code) DO NOTHING`,
          [c.code, c.symptoms, c.level, c.is_placeholder]
        );
      }
      console.log(`✓ 20 Kasus awal (C01-C20) berhasil di-seed.`);

      // 5. Seed Recommendations
      for (const r of initialRecommendations) {
        await pool.query(
          `INSERT INTO recommendations (level, advice)
           VALUES ($1, $2)
           ON CONFLICT (level) DO UPDATE SET advice = EXCLUDED.advice`,
          [r.level, r.advice]
        );
      }
      console.log(`✓ Saran penanganan awal berhasil di-seed.`);

      await pool.end();
      console.log("\nSetup database PostgreSQL selesai dengan sukses!");
      return;
    } catch (err) {
      console.error("Error saat seeding PostgreSQL:", err);
      process.exit(1);
    }
  }

  // Setup local fallback JSON store
  const dbDir = path.join(process.cwd(), "db");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  let localData = {
    users: [],
    symptoms: [],
    cases: [],
    recommendations: [],
    diagnoses: [],
  };

  if (fs.existsSync(DATA_FILE)) {
    try {
      localData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    } catch (e) {
      // fresh
    }
  }

  // Admin user
  const existingAdminIdx = localData.users.findIndex(
    (u) => u.email.toLowerCase() === adminEmail.toLowerCase()
  );
  if (existingAdminIdx >= 0) {
    localData.users[existingAdminIdx].password_hash = adminPasswordHash;
    localData.users[existingAdminIdx].role = "admin";
  } else {
    localData.users.push({
      id: 1,
      name: "Administrator BacaBisa",
      email: adminEmail,
      password_hash: adminPasswordHash,
      role: "admin",
      created_at: new Date().toISOString(),
    });
  }

  // Symptoms
  for (const s of initialSymptoms) {
    const idx = localData.symptoms.findIndex((item) => item.code === s.code);
    if (idx >= 0) {
      localData.symptoms[idx].name = s.name;
      // keep existing weight if modified
      if (localData.symptoms[idx].weight === undefined) {
        localData.symptoms[idx].weight = s.weight;
      }
    } else {
      localData.symptoms.push({ ...s });
    }
  }

  // Cases
  for (const c of initialCases) {
    const idx = localData.cases.findIndex((item) => item.code === c.code);
    if (idx < 0) {
      localData.cases.push({
        ...c,
        created_at: new Date().toISOString(),
      });
    }
  }

  // Recommendations
  for (const r of initialRecommendations) {
    const idx = localData.recommendations.findIndex((item) => item.level === r.level);
    if (idx >= 0) {
      localData.recommendations[idx].advice = r.advice;
    } else {
      localData.recommendations.push({ ...r });
    }
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(localData, null, 2), "utf-8");
  console.log("✓ Database lokal persisten (db/data.json) berhasil di-setup dan di-seed.");
  console.log(`✓ Akun admin: ${adminEmail}`);
  console.log("✓ 7 Gejala, 20 Kasus, dan Rekomendasi siap.");
  console.log("\nSetup database lokal selesai dengan sukses!");
}

setup().catch((err) => {
  console.error("Setup database gagal:", err);
  process.exit(1);
});
