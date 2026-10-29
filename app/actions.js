"use server";

import { query } from "@lib/db";
import { hashPassword, verifyPassword, signAuthToken, setAuthCookie, clearAuthCookie, getCurrentUser } from "@lib/auth";
import { retrieveTopCases, generateNextCaseCode } from "@lib/cbr";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * 1. Login Action
 */
export async function loginAction(prevState, formData) {
  const email = (formData.get("email") || "").trim().toLowerCase();
  const password = (formData.get("password") || "").trim();

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  let userRole = "user";

  try {
    const res = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (res.rows.length === 0) {
      return { error: "Email atau kata sandi tidak sesuai." };
    }

    const user = res.rows[0];
    const passwordMatch = await verifyPassword(password, user.password_hash);
    if (!passwordMatch) {
      return { error: "Email atau kata sandi tidak sesuai." };
    }

    userRole = user.role || "user";

    // Sign JWT token
    const token = await signAuthToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Terjadi kesalahan saat memproses login. Coba lagi nanti." };
  }

  // Redirect automatically based on database role
  if (userRole === "admin") {
    redirect("/admin");
  } else {
    redirect("/dashboard");
  }
}

/**
 * 2. Register Action
 */
export async function registerAction(prevState, formData) {
  const name = (formData.get("name") || "").trim();
  const email = (formData.get("email") || "").trim().toLowerCase();
  const password = (formData.get("password") || "").trim();

  if (!name) {
    return { error: "Nama lengkap wajib diisi." };
  }
  if (!email || !email.includes("@")) {
    return { error: "Format email tidak valid." };
  }
  if (!password || password.length < 6) {
    return { error: "Kata sandi minimal 6 karakter." };
  }

  try {
    const checkEmail = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (checkEmail.rows.length > 0) {
      return { error: "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk." };
    }

    const passwordHash = await hashPassword(password);
    const insertRes = await query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'user') RETURNING id, name, email, role",
      [name, email, passwordHash]
    );

    const newUser = insertRes.rows[0];

    const token = await signAuthToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    await setAuthCookie(token);
  } catch (err) {
    console.error("Register error:", err);
    return { error: "Gagal mendaftarkan akun. Silakan coba kembali." };
  }

  redirect("/dashboard");
}

/**
 * 3. Logout Action
 */
export async function logoutAction() {
  await clearAuthCookie();
  redirect("/login");
}

/**
 * 4. Submit Diagnosis Action
 */
export async function submitDiagnosisAction(prevState, formData) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: "Sesi Anda telah berakhir. Silakan masuk terlebih dahulu." };
  }

  const childLabel = (formData.get("child_label") || "").trim() || "Anak";
  const selectedSymptoms = formData.getAll("symptoms");

  if (!selectedSymptoms || selectedSymptoms.length === 0) {
    return { error: "Pilih minimal 1 gejala yang teramati pada anak." };
  }

  let diagnosisId = null;

  try {
    // 1. Fetch symptoms to validate and get weights
    const symptomsRes = await query("SELECT * FROM symptoms ORDER BY code ASC");
    const validSymptoms = symptomsRes.rows;
    const validCodes = new Set(validSymptoms.map((s) => s.code));

    for (const code of selectedSymptoms) {
      if (!validCodes.has(code)) {
        return { error: `Kode gejala ${code} tidak valid dalam sistem.` };
      }
    }

    // 2. Fetch all cases
    const casesRes = await query("SELECT * FROM cases ORDER BY code ASC");
    const cases = casesRes.rows;

    if (cases.length === 0) {
      return { error: "Basis kasus kosong. Hubungi administrator." };
    }

    // 3. Run CBR Retrieval
    const topMatches = retrieveTopCases(selectedSymptoms, cases, validSymptoms, 3);
    const bestMatch = topMatches[0];

    // 4. Save to diagnoses table
    const insertRes = await query(
      `INSERT INTO diagnoses 
       (user_id, child_label, symptoms, best_case, similarity, level, top_matches)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        currentUser.id,
        childLabel,
        selectedSymptoms,
        bestMatch.caseCode,
        bestMatch.similarityPercentage,
        bestMatch.level,
        JSON.stringify(topMatches),
      ]
    );

    diagnosisId = insertRes.rows[0].id;
    revalidatePath("/riwayat");
    revalidatePath("/admin");
  } catch (err) {
    console.error("Diagnosis submission error:", err);
    return { error: "Gagal memproses diagnosis CBR. Silakan coba lagi." };
  }

  redirect(`/diagnosis/hasil/${diagnosisId}`);
}

/**
 * 5. Revise Diagnosis Action (Admin only)
 */
export async function reviseDiagnosisAction(prevState, formData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return { error: "Akses ditolak: Hanya administrator yang dapat merevisi kasus." };
  }

  const id = formData.get("id");
  const revisedLevel = (formData.get("revised_level") || "").trim();

  if (!["Ringan", "Sedang", "Berat"].includes(revisedLevel)) {
    return { error: "Tingkat keparahan revisi harus salah satu dari: Ringan, Sedang, atau Berat." };
  }

  try {
    await query("UPDATE diagnoses SET revised_level = $1 WHERE id = $2", [revisedLevel, id]);
    revalidatePath("/admin");
    revalidatePath(`/diagnosis/hasil/${id}`);
    revalidatePath("/riwayat");
    return { success: `Tingkat keparahan berhasil direvisi menjadi: ${revisedLevel}.` };
  } catch (err) {
    console.error("Revise error:", err);
    return { error: "Gagal menyimpan revisi diagnosis." };
  }
}

/**
 * 6. Retain Case Action (Admin only)
 * Saves diagnosis with revised_level as a new case (C21, C22, ...)
 */
export async function retainCaseAction(prevState, formData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return { error: "Akses ditolak: Hanya administrator yang dapat menyimpan ke basis kasus." };
  }

  const id = formData.get("id");

  try {
    const diagRes = await query("SELECT * FROM diagnoses WHERE id = $1", [id]);
    if (diagRes.rows.length === 0) {
      return { error: "Data diagnosis tidak ditemukan." };
    }

    const diag = diagRes.rows[0];
    if (diag.retained) {
      return { error: "Diagnosis ini sudah pernah disimpan (retained) ke basis kasus sebelumnya." };
    }

    const finalLevel = diag.revised_level || diag.level;
    const allCasesRes = await query("SELECT code FROM cases");
    const existingCodes = allCasesRes.rows.map((c) => c.code);
    const newCode = generateNextCaseCode(existingCodes);

    // Insert into cases
    await query(
      "INSERT INTO cases (code, symptoms, level, is_placeholder) VALUES ($1, $2, $3, false)",
      [newCode, diag.symptoms, finalLevel]
    );

    // Mark diagnosis as retained
    await query("UPDATE diagnoses SET retained = true WHERE id = $1", [id]);

    revalidatePath("/admin");
    revalidatePath("/admin/kasus");
    revalidatePath(`/diagnosis/hasil/${id}`);
    return { success: `Berhasil mempertahankan kasus ke basis kasus baru dengan kode ${newCode} (${finalLevel})!` };
  } catch (err) {
    console.error("Retain error:", err);
    return { error: "Gagal menyimpan kasus baru." };
  }
}

/**
 * 7. Add Case Action (Admin only)
 */
export async function addCaseAction(prevState, formData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return { error: "Akses ditolak: Hanya administrator." };
  }

  const code = (formData.get("code") || "").trim().toUpperCase();
  const level = (formData.get("level") || "").trim();
  const selectedSymptoms = formData.getAll("symptoms");
  const isPlaceholder = formData.get("is_placeholder") === "on";

  if (!code.match(/^C\d+$/i)) {
    return { error: "Format kode kasus harus diawali huruf 'C' diikuti angka (contoh: C21)." };
  }
  if (!["Ringan", "Sedang", "Berat"].includes(level)) {
    return { error: "Tingkat keparahan tidak valid." };
  }
  if (!selectedSymptoms || selectedSymptoms.length === 0) {
    return { error: "Pilih minimal 1 gejala untuk kasus baru." };
  }

  try {
    const checkCase = await query("SELECT code FROM cases WHERE code = $1", [code]);
    if (checkCase.rows.length > 0) {
      return { error: `Kode kasus ${code} sudah ada dalam basis kasus.` };
    }

    await query(
      "INSERT INTO cases (code, symptoms, level, is_placeholder) VALUES ($1, $2, $3, $4)",
      [code, selectedSymptoms, level, isPlaceholder]
    );

    revalidatePath("/admin/kasus");
    revalidatePath("/admin");
    return { success: `Kasus ${code} (${level}) berhasil ditambahkan ke basis kasus!` };
  } catch (err) {
    console.error("Add case error:", err);
    return { error: "Gagal menambahkan kasus baru." };
  }
}

/**
 * 8. Delete Case Action (Admin only)
 */
export async function deleteCaseAction(prevState, formData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return { error: "Akses ditolak: Hanya administrator." };
  }

  const code = (formData.get("code") || "").trim();

  try {
    await query("DELETE FROM cases WHERE code = $1", [code]);
    revalidatePath("/admin/kasus");
    revalidatePath("/admin");
    return { success: `Kasus ${code} berhasil dihapus dari basis kasus.` };
  } catch (err) {
    console.error("Delete case error:", err);
    return { error: "Gagal menghapus kasus." };
  }
}

/**
 * 9. Update Symptom Weight Action (Admin only)
 */
export async function updateSymptomWeightAction(prevState, formData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return { error: "Akses ditolak: Hanya administrator." };
  }

  const code = (formData.get("code") || "").trim();
  const weight = parseFloat(formData.get("weight"));

  if (isNaN(weight) || weight <= 0) {
    return { error: "Bobot gejala harus berupa angka lebih besar dari 0." };
  }

  try {
    await query("UPDATE symptoms SET weight = $1 WHERE code = $2", [weight, code]);
    revalidatePath("/admin/gejala");
    return { success: `Bobot gejala ${code} berhasil diubah menjadi ${weight}.` };
  } catch (err) {
    console.error("Update weight error:", err);
    return { error: "Gagal mengubah bobot gejala." };
  }
}

/**
 * 10. Update Profile Action (User or Admin)
 */
export async function updateProfileAction(prevState, formData) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: "Silakan masuk terlebih dahulu untuk mengubah profil." };
  }

  const name = (formData.get("name") || "").trim();
  const currentPassword = (formData.get("current_password") || "").trim();
  const newPassword = (formData.get("new_password") || "").trim();
  const confirmPassword = (formData.get("confirm_password") || "").trim();

  if (!name) {
    return { error: "Nama lengkap tidak boleh kosong." };
  }

  try {
    const userRes = await query("SELECT * FROM users WHERE id = $1", [currentUser.id]);
    if (userRes.rows.length === 0) {
      return { error: "Akun pengguna tidak ditemukan." };
    }
    const dbUser = userRes.rows[0];

    // If changing password
    if (newPassword || currentPassword || confirmPassword) {
      if (!currentPassword) {
        return { error: "Kata sandi saat ini wajib diisi jika ingin mengubah kata sandi." };
      }
      const match = await verifyPassword(currentPassword, dbUser.password_hash);
      if (!match) {
        return { error: "Kata sandi saat ini tidak cocok." };
      }
      if (newPassword.length < 6) {
        return { error: "Kata sandi baru minimal 6 karakter." };
      }
      if (newPassword !== confirmPassword) {
        return { error: "Konfirmasi kata sandi baru tidak cocok." };
      }

      const newHash = await hashPassword(newPassword);
      await query(
        "UPDATE users SET name = $1, password_hash = $2 WHERE id = $3",
        [name, newHash, currentUser.id]
      );
    } else {
      // Update name only
      await query("UPDATE users SET name = $1 WHERE id = $2", [name, currentUser.id]);
    }

    // Refresh auth token with new name
    const updatedToken = await signAuthToken({
      id: dbUser.id,
      name: name,
      email: dbUser.email,
      role: dbUser.role || currentUser.role || "user",
    });
    await setAuthCookie(updatedToken);

    revalidatePath("/profil");
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    return { success: "Profil Anda berhasil diperbarui!" };
  } catch (err) {
    console.error("Update profile error:", err);
    return { error: "Terjadi kesalahan saat memperbarui profil." };
  }
}

