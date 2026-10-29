import assert from "node:assert/strict";
import { query } from "../lib/db.js";
import { hashPassword, verifyPassword, signAuthToken, verifyAuthToken } from "../lib/auth.js";
import { retrieveTopCases, generateNextCaseCode } from "../lib/cbr.js";

async function runFullE2ETest() {
  console.log("=== MEMULAI TEST INTEGRASI PENUH BACABISA ===");

  // 1. Verify Symptoms in Database
  const symptomsRes = await query("SELECT * FROM symptoms ORDER BY code ASC");
  assert.equal(symptomsRes.rows.length, 7, "Harus ada tepat 7 gejala");
  console.log("✓ DB: 7 Gejala ditemukan:", symptomsRes.rows.map(s => `${s.code}(w=${s.weight})`).join(", "));

  // 2. Verify Initial Cases in Database (C01-C20)
  const casesRes = await query("SELECT * FROM cases ORDER BY code ASC");
  assert.equal(casesRes.rows.length >= 20, true, "Harus ada minimal 20 kasus awal");
  console.log(`✓ DB: ${casesRes.rows.length} Kasus ditemukan di basis kasus.`);

  // 3. Verify Admin Account in Database
  const adminRes = await query("SELECT * FROM users WHERE email = $1", ["admin@bacabisa.ac.id"]);
  assert.equal(adminRes.rows.length, 1, "Akun admin harus terdaftar");
  assert.equal(adminRes.rows[0].role, "admin", "Role harus admin");
  const adminPassMatch = await verifyPassword("adminsecret123", adminRes.rows[0].password_hash);
  assert.equal(adminPassMatch, true, "Password admin harus cocok");
  console.log("✓ Auth: Akun admin valid (admin@bacabisa.ac.id)");

  // 4. Test User Registration Simulation
  const testEmail = `user_${Date.now()}@test.com`;
  const userPassHash = await hashPassword("usersecret123");
  const userInsertRes = await query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'user') RETURNING *",
    ["Siti Aminah, S.Pd", testEmail, userPassHash]
  );
  const testUser = userInsertRes.rows[0];
  assert.equal(testUser.email, testEmail);
  console.log(`✓ User Registration: Berhasil mendaftarkan ${testUser.name} (${testUser.email})`);

  // 5. Test JWT Token Creation & Verification
  const userToken = await signAuthToken({
    id: testUser.id,
    name: testUser.name,
    email: testUser.email,
    role: testUser.role,
  });
  const verifiedPayload = await verifyAuthToken(userToken);
  assert.equal(verifiedPayload.id, testUser.id);
  assert.equal(verifiedPayload.role, "user");
  console.log("✓ JWT Auth: Token berhasil di-sign dan di-verify dengan jose.");

  // 6. Test Case 1: {G02, G03, G04} -> C08 Sedang 100%
  console.log("\n--- Pengujian Kasus 1: Input {G02, G03, G04} ---");
  const top1 = retrieveTopCases(["G02", "G03", "G04"], casesRes.rows, symptomsRes.rows, 3);
  assert.equal(top1[0].caseCode, "C08", "Kasus teratas harus C08");
  assert.equal(top1[0].level, "Sedang", "Tingkat harus Sedang");
  assert.equal(top1[0].similarityPercentage, 100, "Similarity harus 100%");
  console.log(`✓ Kasus 1 Lolos: ${top1[0].caseCode} | ${top1[0].level} | Similarity: ${top1[0].similarityPercentage}%`);

  // Insert diagnosis record for test user
  const diagInsert1 = await query(
    `INSERT INTO diagnoses (user_id, child_label, symptoms, best_case, similarity, level, top_matches)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      testUser.id,
      "Ananda Farhan",
      ["G02", "G03", "G04"],
      top1[0].caseCode,
      top1[0].similarityPercentage,
      top1[0].level,
      JSON.stringify(top1),
    ]
  );
  const diag1 = diagInsert1.rows[0];
  console.log(`✓ Diagnosis tersimpan di DB: ID #${diag1.id} untuk ${diag1.child_label}`);

  // 7. Test Case 2: all G01-G07 -> C19 Berat 100%
  console.log("\n--- Pengujian Kasus 2: Input Semua {G01-G07} ---");
  const allCodes = symptomsRes.rows.map(s => s.code);
  const top2 = retrieveTopCases(allCodes, casesRes.rows, symptomsRes.rows, 3);
  assert.equal(top2[0].caseCode, "C19", "Kasus teratas harus C19");
  assert.equal(top2[0].level, "Berat", "Tingkat harus Berat");
  assert.equal(top2[0].similarityPercentage, 100, "Similarity harus 100%");
  console.log(`✓ Kasus 2 Lolos: ${top2[0].caseCode} | ${top2[0].level} | Similarity: ${top2[0].similarityPercentage}%`);

  // 8. Test Case 3: {G02} -> C01 Ringan 100%
  console.log("\n--- Pengujian Kasus 3: Input {G02} ---");
  const top3 = retrieveTopCases(["G02"], casesRes.rows, symptomsRes.rows, 3);
  assert.equal(top3[0].caseCode, "C01", "Kasus teratas harus C01");
  assert.equal(top3[0].level, "Ringan", "Tingkat harus Ringan");
  assert.equal(top3[0].similarityPercentage, 100, "Similarity harus 100%");
  console.log(`✓ Kasus 3 Lolos: ${top3[0].caseCode} | ${top3[0].level} | Similarity: ${top3[0].similarityPercentage}%`);

  // 9. Test Revise by Admin
  console.log("\n--- Pengujian Siklus Revise oleh Pakar/Admin ---");
  await query("UPDATE diagnoses SET revised_level = $1 WHERE id = $2", ["Berat", diag1.id]);
  const revisedCheck = await query("SELECT * FROM diagnoses WHERE id = $1", [diag1.id]);
  assert.equal(revisedCheck.rows[0].revised_level, "Berat");
  console.log(`✓ Revise Lolos: Diagnosis #${diag1.id} direvisi dari Sedang -> ${revisedCheck.rows[0].revised_level}`);

  // 10. Test Retain by Admin (Save as new case C21, C22, ...)
  console.log("\n--- Pengujian Siklus Retain (Simpan Kasus Baru) ---");
  const casesBefore = await query("SELECT code FROM cases");
  const nextCaseCode = generateNextCaseCode(casesBefore.rows.map(c => c.code));
  console.log(`→ Kode kasus berikutnya yang di-generate: ${nextCaseCode}`);

  await query(
    "INSERT INTO cases (code, symptoms, level, is_placeholder) VALUES ($1, $2, $3, false)",
    [nextCaseCode, diag1.symptoms, revisedCheck.rows[0].revised_level]
  );
  await query("UPDATE diagnoses SET retained = true WHERE id = $1", [diag1.id]);

  const newCaseCheck = await query("SELECT * FROM cases WHERE code = $1", [nextCaseCode]);
  assert.equal(newCaseCheck.rows.length, 1, `Kasus ${nextCaseCode} harus ada di basis kasus`);
  assert.equal(newCaseCheck.rows[0].level, "Berat");
  console.log(`✓ Retain Lolos: Kasus baru ${nextCaseCode} (${newCaseCheck.rows[0].level}) tersimpan ke basis kasus!`);

  // 11. Test Symptom Weight Modification by Admin
  console.log("\n--- Pengujian Perubahan Bobot Gejala (w) ---");
  const initialWeight = symptomsRes.rows.find(s => s.code === "G07").weight;
  const newWeight = 2.5;
  await query("UPDATE symptoms SET weight = $1 WHERE code = $2", [newWeight, "G07"]);
  const updatedSymptomRes = await query("SELECT * FROM symptoms WHERE code = $1", ["G07"]);
  assert.equal(Number(updatedSymptomRes.rows[0].weight), newWeight);
  console.log(`✓ Update Bobot Lolos: G07 bobot diubah dari ${initialWeight} -> ${newWeight}`);

  // Reset back to original weight 1
  await query("UPDATE symptoms SET weight = $1 WHERE code = $2", [initialWeight, "G07"]);
  console.log(`✓ Bobot G07 dinormalkan kembali ke ${initialWeight}.`);

  console.log("\n==============================================");
  console.log("SEMUA PENGUJIAN INTEGRASI & FITUR CBR SUKSES 100%!");
  console.log("==============================================");
}

runFullE2ETest().catch((err) => {
  console.error("Test gagal:", err);
  process.exit(1);
});
