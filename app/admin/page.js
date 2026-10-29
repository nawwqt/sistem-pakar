import { query } from "@lib/db";
import { getCurrentUser } from "@lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminDiagnosisRow from "./AdminDiagnosisRow";
import HorizonDashboardLayout from "@components/HorizonDashboardLayout";
import {
  MdBarChart,
  MdDashboard,
  MdPerson,
  MdCheckCircle,
  MdFolder,
  MdScale,
  MdAdd,
  MdRefresh,
  MdOutlineScience,
  MdTrendingUp,
} from "react-icons/md";
import { IoDocuments, IoSparkles } from "react-icons/io5";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panel Admin CBR - BacaBisa",
  description: "Manajemen siklus Case-Based Reasoning, statistik diagnosis, revisi pakar, dan retensi kasus baru.",
};

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch statistics
  const [diagRes, casesRes, usersRes] = await Promise.all([
    query(
      "SELECT d.*, u.name as user_name FROM diagnoses d LEFT JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC"
    ),
    query("SELECT * FROM cases"),
    query("SELECT COUNT(*) as total FROM users"),
  ]);

  const diagnoses = diagRes.rows || [];
  const cases = casesRes.rows || [];
  const totalUsers = usersRes.rows?.[0]?.total || 0;

  // Breakdown by level
  const counts = {
    Ringan: 0,
    Sedang: 0,
    Berat: 0,
  };
  let retainedCount = 0;
  let totalSim = 0;

  diagnoses.forEach((d) => {
    const l = d.revised_level || d.level;
    if (counts[l] !== undefined) counts[l]++;
    if (d.retained) retainedCount++;
    totalSim += Number(d.similarity || 0);
  });

  const totalDiag = diagnoses.length;
  const avgSimilarity = totalDiag > 0 ? (totalSim / totalDiag).toFixed(1) : 0;

  const pctRingan = totalDiag > 0 ? Math.round((counts.Ringan / totalDiag) * 100) : 0;
  const pctSedang = totalDiag > 0 ? Math.round((counts.Sedang / totalDiag) * 100) : 0;
  const pctBerat = totalDiag > 0 ? Math.round((counts.Berat / totalDiag) * 100) : 0;

  return (
    <HorizonDashboardLayout user={user} brandText="Dashboard Admin">
      <div className="max-w-[1300px] mx-auto space-y-6">
        {/* Quick Submenu Buttons (Horizon Pill Bar) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-[#1B2559]">
              Panel Kontrol Pakar CBR Disleksia
            </h2>
            <p className="text-xs text-[#707EAE]">
              Kelola siklus 4R (Retrieve, Reuse, Revise, Retain) dan basis pengetahuan kasus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/kasus"
              className="px-4 py-2 bg-white hover:bg-slate-50 text-[#1B2559] hover:text-[#4318FF] font-bold text-xs rounded-full shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/80 transition-all flex items-center gap-2"
            >
              <MdFolder className="text-[#4318FF] text-base" />
              <span>Basis Kasus ({cases.length})</span>
            </Link>
            <Link
              href="/admin/gejala"
              className="px-4 py-2 bg-white hover:bg-slate-50 text-[#1B2559] hover:text-[#4318FF] font-bold text-xs rounded-full shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/80 transition-all flex items-center gap-2"
            >
              <MdScale className="text-[#FFB547] text-base" />
              <span>Bobot Gejala (7)</span>
            </Link>
            <Link
              href="/diagnosis"
              className="px-5 py-2 bg-[#4318FF] hover:bg-[#3311DB] text-white font-bold text-xs rounded-full shadow-[0px_10px_20px_rgba(67,24,255,0.24)] transition-all flex items-center gap-1.5 hover:scale-105"
            >
              <MdAdd className="text-base" />
              <span>+ Uji Diagnosis</span>
            </Link>
          </div>
        </div>

        {/* Horizon Metric Widgets Row (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Widget 1: Total Diagnosis */}
          <div className="flex items-center rounded-[20px] bg-white p-4 lg:p-5 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/60 transition-all hover:shadow-[0px_20px_45px_rgba(112,144,176,0.14)]">
            <div className="w-14 h-14 rounded-full bg-[#E9E3FF] flex items-center justify-center shrink-0">
              <MdBarChart className="h-7 w-7 text-[#4318FF]" />
            </div>
            <div className="ml-4 flex flex-col justify-center">
              <span className="text-xs font-semibold text-[#A3AED0] uppercase tracking-wider">
                Total Diagnosis
              </span>
              <span className="text-2xl lg:text-3xl font-extrabold text-[#1B2559]">
                {totalDiag}
              </span>
              <span className="text-[11px] text-[#707EAE] mt-0.5">
                Rata-rata Sim: {avgSimilarity}%
              </span>
            </div>
          </div>

          {/* Widget 2: Basis Kasus Aktif */}
          <div className="flex items-center rounded-[20px] bg-white p-4 lg:p-5 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/60 transition-all hover:shadow-[0px_20px_45px_rgba(112,144,176,0.14)]">
            <div className="w-14 h-14 rounded-full bg-[#E1FFF4] flex items-center justify-center shrink-0">
              <MdDashboard className="h-7 w-7 text-[#01B574]" />
            </div>
            <div className="ml-4 flex flex-col justify-center">
              <span className="text-xs font-semibold text-[#A3AED0] uppercase tracking-wider">
                Basis Kasus Aktif
              </span>
              <span className="text-2xl lg:text-3xl font-extrabold text-[#1B2559]">
                {cases.length}
              </span>
              <span className="text-[11px] text-[#707EAE] mt-0.5">
                Rujukan standar pakar
              </span>
            </div>
          </div>

          {/* Widget 3: Pengguna Terdaftar */}
          <div className="flex items-center rounded-[20px] bg-white p-4 lg:p-5 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/60 transition-all hover:shadow-[0px_20px_45px_rgba(112,144,176,0.14)]">
            <div className="w-14 h-14 rounded-full bg-[#EBEFFF] flex items-center justify-center shrink-0">
              <MdPerson className="h-7 w-7 text-[#3965FF]" />
            </div>
            <div className="ml-4 flex flex-col justify-center">
              <span className="text-xs font-semibold text-[#A3AED0] uppercase tracking-wider">
                Pengguna Terdaftar
              </span>
              <span className="text-2xl lg:text-3xl font-extrabold text-[#1B2559]">
                {totalUsers}
              </span>
              <span className="text-[11px] text-[#707EAE] mt-0.5">
                Guru, orang tua & pakar
              </span>
            </div>
          </div>

          {/* Widget 4: Kasus Baru Diretain */}
          <div className="flex items-center rounded-[20px] bg-white p-4 lg:p-5 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/60 transition-all hover:shadow-[0px_20px_45px_rgba(112,144,176,0.14)]">
            <div className="w-14 h-14 rounded-full bg-[#FFF7EB] flex items-center justify-center shrink-0">
              <MdCheckCircle className="h-7 w-7 text-[#FFB547]" />
            </div>
            <div className="ml-4 flex flex-col justify-center">
              <span className="text-xs font-semibold text-[#A3AED0] uppercase tracking-wider">
                Kasus Diretain (4R)
              </span>
              <span className="text-2xl lg:text-3xl font-extrabold text-[#1B2559]">
                {retainedCount}
              </span>
              <span className="text-[11px] text-[#707EAE] mt-0.5">
                Ditambahkan ke basis rujukan
              </span>
            </div>
          </div>
        </div>

        {/* Horizon 2-Column Analytics & 4R Cycle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Distribution Card */}
          <div className="lg:col-span-7 rounded-[20px] bg-white p-6 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1B2559]">
                    Distribusi Tingkat Keparahan Disleksia
                  </h3>
                  <p className="text-xs text-[#707EAE] mt-0.5">
                    Proporsi kasus terdiagnosis berdasarkan klasifikasi medis/edukatif
                  </p>
                </div>
                <span className="px-3 py-1 bg-[#F4F7FE] text-[#4318FF] text-xs font-bold rounded-full">
                  {totalDiag} Hasil
                </span>
              </div>

              {/* Progress Bars (Horizon style) */}
              <div className="space-y-4 my-6">
                {/* Ringan */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                    <span className="flex items-center gap-2 text-[#1B2559]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#01B574]" />
                      <span>Tingkat Ringan</span>
                    </span>
                    <span className="text-[#01B574] font-extrabold">
                      {counts.Ringan} Kasus ({pctRingan}%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-[#F4F7FE] rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#01B574] to-[#01F99E] rounded-full transition-all duration-500"
                      style={{ width: `${pctRingan}%` }}
                    />
                  </div>
                </div>

                {/* Sedang */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                    <span className="flex items-center gap-2 text-[#1B2559]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFB547]" />
                      <span>Tingkat Sedang</span>
                    </span>
                    <span className="text-[#FFB547] font-extrabold">
                      {counts.Sedang} Kasus ({pctSedang}%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-[#F4F7FE] rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#FFB547] to-[#FFD28F] rounded-full transition-all duration-500"
                      style={{ width: `${pctSedang}%` }}
                    />
                  </div>
                </div>

                {/* Berat */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                    <span className="flex items-center gap-2 text-[#1B2559]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EE5D50]" />
                      <span>Tingkat Berat</span>
                    </span>
                    <span className="text-[#EE5D50] font-extrabold">
                      {counts.Berat} Kasus ({pctBerat}%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-[#F4F7FE] rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#EE5D50] to-[#F4A4A4] rounded-full transition-all duration-500"
                      style={{ width: `${pctBerat}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Horizon Summary Pill (PieChartCard style) */}
            <div className="flex items-center justify-around bg-[#F4F7FE] rounded-2xl py-3 px-4 border border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#707EAE]">
                  <span className="w-2 h-2 rounded-full bg-[#01B574]" />
                  <span>Ringan</span>
                </div>
                <div className="text-base font-extrabold text-[#1B2559] mt-0.5">
                  {pctRingan}%
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#707EAE]">
                  <span className="w-2 h-2 rounded-full bg-[#FFB547]" />
                  <span>Sedang</span>
                </div>
                <div className="text-base font-extrabold text-[#1B2559] mt-0.5">
                  {pctSedang}%
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#707EAE]">
                  <span className="w-2 h-2 rounded-full bg-[#EE5D50]" />
                  <span>Berat</span>
                </div>
                <div className="text-base font-extrabold text-[#1B2559] mt-0.5">
                  {pctBerat}%
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): 4R CBR Cycle Status */}
          <div className="lg:col-span-5 rounded-[20px] bg-white p-6 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1B2559]">
                  Siklus 4R Case-Based Reasoning
                </h3>
                <span className="p-2 rounded-full bg-[#E9E3FF] text-[#4318FF]">
                  <IoSparkles className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-[#707EAE] mb-5">
                Tahapan operasional sistem cerdas BacaBisa dalam menyelesaikan masalah:
              </p>

              <div className="space-y-3.5">
                {/* 1. Retrieve */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F7FE]/70 border border-gray-100/60">
                  <div className="w-7 h-7 rounded-lg bg-[#4318FF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1B2559]">
                      Retrieve (Temukan Kembali)
                    </div>
                    <div className="text-[11px] text-[#707EAE] mt-0.5">
                      Pencocokan gejala teramati anak terhadap 20 kasus rujukan berbobot.
                    </div>
                  </div>
                </div>

                {/* 2. Reuse */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F7FE]/70 border border-gray-100/60">
                  <div className="w-7 h-7 rounded-lg bg-[#3965FF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1B2559]">
                      Reuse (Gunakan Kembali)
                    </div>
                    <div className="text-[11px] text-[#707EAE] mt-0.5">
                      Mengadopsi tingkat keparahan & rekomendasi dari kasus terdekat.
                    </div>
                  </div>
                </div>

                {/* 3. Revise */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F7FE]/70 border border-gray-100/60">
                  <div className="w-7 h-7 rounded-lg bg-[#FFB547] text-slate-900 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1B2559]">
                      Revise (Perbaiki & Validasi)
                    </div>
                    <div className="text-[11px] text-[#707EAE] mt-0.5">
                      Pakar mengevaluasi hasil klasifikasi sistem dan melakukan revisi.
                    </div>
                  </div>
                </div>

                {/* 4. Retain */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F7FE]/70 border border-gray-100/60">
                  <div className="w-7 h-7 rounded-lg bg-[#01B574] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1B2559]">
                      Retain (Simpan Kasus Baru)
                    </div>
                    <div className="text-[11px] text-[#707EAE] mt-0.5">
                      Menyimpan kasus diagnosis yang telah divalidasi ke basis pengetahuan.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <span className="text-[11px] text-[#707EAE]">
                Status Model: <strong>Sorensen Weighted Similarity</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Horizon ComplexTable: Diagnosis List with Revise & Retain */}
        <div className="rounded-[20px] bg-white p-6 md:p-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h2 className="text-xl font-bold text-[#1B2559]">
                  Daftar Diagnosis Terbaru & Siklus Revise / Retain
                </h2>
                <span className="px-3 py-0.5 bg-[#E9E3FF] text-[#4318FF] font-bold text-xs rounded-full">
                  {diagnoses.length} Kasus
                </span>
              </div>
              <p className="text-xs text-[#707EAE]">
                Gunakan <strong>Revise</strong> untuk menyesuaikan tingkat keparahan diagnosis dan <strong>Retain</strong> untuk menyimpan kasus ke basis pengetahuan rujukan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/riwayat"
                className="px-4 py-2 bg-[#F4F7FE] hover:bg-[#E9E3FF] text-[#4318FF] font-bold text-xs rounded-full transition flex items-center gap-1"
              >
                <span>Lihat Arsip Lengkap</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {diagnoses.length === 0 ? (
            <div className="text-center py-16 bg-[#F4F7FE]/50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#E9E3FF] text-[#4318FF] flex items-center justify-center text-2xl mb-3">
                <IoDocuments />
              </div>
              <h4 className="text-base font-bold text-[#1B2559] mb-1">
                Belum Ada Catatan Diagnosis
              </h4>
              <p className="text-xs text-[#707EAE] max-w-sm mx-auto mb-4">
                Sistem belum memiliki riwayat skrining yang masuk. Uji diagnosis baru untuk memulai siklus penalaran kasus.
              </p>
              <Link
                href="/diagnosis"
                className="px-5 py-2.5 bg-[#4318FF] text-white font-bold text-xs rounded-full shadow-md inline-block hover:bg-[#3311DB]"
              >
                + Jalankan Uji Diagnosis Pertama
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F4F7FE]/80 border-b border-gray-100 text-[#A3AED0] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 rounded-l-xl">#</th>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Nama Anak</th>
                    <th className="py-3 px-4">Penguji</th>
                    <th className="py-3 px-4">Gejala Terpilih</th>
                    <th className="py-3 px-4 text-center">Similarity</th>
                    <th className="py-3 px-4">Tingkat (Revise)</th>
                    <th className="py-3 px-4 text-center">Retain ke Basis</th>
                    <th className="py-3 px-4 text-center rounded-r-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/60">
                  {diagnoses.map((diag, idx) => (
                    <AdminDiagnosisRow
                      key={diag.id}
                      diagnosis={diag}
                      idx={idx}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </HorizonDashboardLayout>
  );
}
