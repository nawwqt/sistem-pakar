import { getCurrentUser } from "@lib/auth";
import { query } from "@lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import HorizonDashboardLayout from "@components/HorizonDashboardLayout";
import {
  MdBarChart,
  MdCheckCircle,
  MdTrendingUp,
  MdDashboard,
  MdPlayArrow,
  MdHistory,
  MdMenuBook,
  MdScience,
  MdGroup,
  MdAdminPanelSettings,
  MdArrowForward,
} from "react-icons/md";
import { IoSparkles } from "react-icons/io5";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard Pengguna - BacaBisa",
  description: "Dashboard pengguna sistem pakar skrining disleksia anak sekolah dasar berbasis Case-Based Reasoning (CBR).",
};

export default async function DashboardPenggunaPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const isAdmin = user.role === "admin";

  // Query user's personal diagnoses
  const diagRes = await query(
    "SELECT * FROM diagnoses WHERE user_id = $1 ORDER BY created_at DESC",
    [user.id]
  );
  const userDiags = diagRes.rows || [];
  const totalUserDiags = userDiags.length;
  const latestDiag = userDiags[0] || null;

  let maxSimilarity = 0;
  userDiags.forEach((d) => {
    const s = Number(d.similarity || 0);
    if (s > maxSimilarity) maxSimilarity = s;
  });

  const latestLevel = latestDiag ? latestDiag.revised_level || latestDiag.level : null;

  const userCards = [
    {
      title: "Mulai Diagnosis",
      desc: "Lakukan skrining cepat indikasi disleksia pada anak usia SD dengan memilih 7 gejala yang teramati. Dapatkan estimasi tingkat keparahan dan rekomendasi.",
      href: "/diagnosis",
      icon: <MdPlayArrow className="w-8 h-8" />,
      iconBg: "bg-gradient-to-br from-[#4318FF] to-[#868CFF] text-white",
      buttonText: "Mulai Skrining",
      highlight: true,
      badge: "Layanan Utama",
    },
    {
      title: "Riwayat Diagnosis",
      desc: "Lihat arsip hasil pemeriksaan anak, riwayat tanggal, tingkat keparahan, serta detail rekomendasi edukatif yang dapat diunduh.",
      href: "/riwayat",
      icon: <MdHistory className="w-7 h-7" />,
      iconBg: "bg-[#EBEFFF] text-[#3965FF]",
      buttonText: "Buka Riwayat",
      badge: `${totalUserDiags} Catatan`,
    },
    ...(isAdmin
      ? [
          {
            title: "Panel Administrator",
            desc: "Kelola siklus CBR: statistik diagnosis, revisi tingkat (Revise), retain kasus (Retain), serta matriks bobot gejala.",
            href: "/admin",
            icon: <MdAdminPanelSettings className="w-7 h-7" />,
            iconBg: "bg-[#EFEBFF] text-[#7551FF]",
            buttonText: "Buka Dashboard Admin",
            adminOnly: true,
            badge: "Pakar CBR",
          },
        ]
      : [
          {
            title: "Petunjuk & Panduan",
            desc: "Pelajari 6 langkah mudah penggunaan sistem, observasi 7 gejala klinis pada anak, dan alur metodologi CBR.",
            href: "/petunjuk",
            icon: <MdMenuBook className="w-7 h-7" />,
            iconBg: "bg-[#E1FFF4] text-[#01B574]",
            buttonText: "Buka Panduan",
            badge: "Panduan",
          },
        ]),
  ];

  return (
    <HorizonDashboardLayout user={user} brandText="Dashboard Pengguna">
      <div className="max-w-[1300px] mx-auto space-y-6">
        {/* Admin Quick Switch Alert */}
        {isAdmin && (
          <div className="p-4 rounded-[20px] bg-white border-l-4 border-[#7551FF] shadow-[0px_18px_40px_rgba(112,144,176,0.08)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#EFEBFF] text-[#7551FF]">
                <MdAdminPanelSettings className="w-5 h-5" />
              </span>
              <div>
                <div className="text-xs font-bold text-[#1B2559]">
                  Anda memiliki hak akses Administrator Sistem Pakar
                </div>
                <div className="text-[11px] text-[#707EAE]">
                  Kelola siklus 4R (Revise & Retain), basis kasus matriks, dan bobot gejala pada panel khusus admin.
                </div>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-4 py-1.5 bg-[#4318FF] hover:bg-[#3311DB] text-white font-bold text-xs rounded-full transition whitespace-nowrap"
            >
              Buka Dashboard Admin →
            </Link>
          </div>
        )}

        {/* Horizon Featured Gradient Banner Card */}
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#4318FF] via-[#5A32FA] to-[#868CFF] p-6 sm:p-8 md:p-10 text-white shadow-[0px_18px_40px_rgba(67,24,255,0.22)]">
          {/* Decorative glowing circles */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 right-1/4 h-56 w-56 rounded-full bg-white/10 blur-xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md mb-3 border border-white/20">
              <IoSparkles className="text-amber-300" />
              <span>Sistem Pakar CBR Disleksia SD</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 leading-tight">
              Selamat Datang, {user.name}! 👋
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-6 max-w-2xl">
              Deteksi dini tingkat keparahan disleksia (Ringan, Sedang, Berat) pada anak usia sekolah dasar dengan mencocokkan gejala teramati menggunakan algoritma <em>Case-Based Reasoning (CBR)</em> berbasis 20 kasus rujukan terstandar.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/diagnosis"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#4318FF] shadow-lg transition-all hover:bg-slate-50 hover:scale-105"
              >
                <span>Mulai Skrining Baru</span>
                <MdArrowForward className="text-base" />
              </Link>
              <Link
                href="/riwayat"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 px-5 py-3 text-sm font-bold text-white transition-all backdrop-blur-sm"
              >
                <span>Lihat Riwayat Saya ({totalUserDiags})</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Horizon Metric Widgets Row (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Widget 1: Total Skrining Saya */}
          <div className="flex items-center gap-3.5 rounded-[22px] bg-white p-5 sm:p-5 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-slate-100 transition-all hover:shadow-[0px_20px_45px_rgba(112,144,176,0.14)]">
            <div className="w-12 h-12 rounded-2xl bg-[#E9E3FF] flex items-center justify-center shrink-0">
              <MdBarChart className="h-6 w-6 text-[#4318FF]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider truncate">
                Total Skrining
              </span>
              <span className="block text-2xl font-extrabold text-[#1B2559] leading-tight my-0.5">
                {totalUserDiags}
              </span>
              <span className="block text-[11px] text-[#707EAE] truncate">
                Kasus diperiksa
              </span>
            </div>
          </div>

          {/* Widget 2: Hasil Terakhir */}
          <div className="flex items-center gap-3.5 rounded-[22px] bg-white p-5 sm:p-5 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-slate-100 transition-all hover:shadow-[0px_20px_45px_rgba(112,144,176,0.14)]">
            <div className="w-12 h-12 rounded-2xl bg-[#E1FFF4] flex items-center justify-center shrink-0">
              <MdCheckCircle className="h-6 w-6 text-[#01B574]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider truncate">
                Hasil Terakhir
              </span>
              <span
                className={`block text-xl font-extrabold leading-tight my-0.5 truncate ${
                  latestLevel === "Berat"
                    ? "text-[#E31A1A]"
                    : latestLevel === "Sedang"
                    ? "text-[#FFB547]"
                    : latestLevel === "Ringan"
                    ? "text-[#01B574]"
                    : "text-[#1B2559]"
                }`}
              >
                {latestLevel || "Belum Ada"}
              </span>
              <span className="block text-[11px] text-[#707EAE] truncate">
                {latestDiag
                  ? new Date(latestDiag.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Siap skrining"}
              </span>
            </div>
          </div>

          {/* Widget 3: Skor Kemiripan Tertinggi */}
          <div className="flex items-center gap-3.5 rounded-[22px] bg-white p-5 sm:p-5 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-slate-100 transition-all hover:shadow-[0px_20px_45px_rgba(112,144,176,0.14)]">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF7EB] flex items-center justify-center shrink-0">
              <MdTrendingUp className="h-6 w-6 text-[#FFB547]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider truncate">
                Match Tertinggi
              </span>
              <span className="block text-2xl font-extrabold text-[#1B2559] leading-tight my-0.5">
                {maxSimilarity > 0 ? `${maxSimilarity.toFixed(1)}%` : "-"}
              </span>
              <span className="block text-[11px] text-[#707EAE] truncate">
                Kemiripan basis kasus
              </span>
            </div>
          </div>

          {/* Widget 4: Rujukan Kasus Tersedia */}
          <div className="flex items-center gap-3.5 rounded-[22px] bg-white p-5 sm:p-5 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-slate-100 transition-all hover:shadow-[0px_20px_45px_rgba(112,144,176,0.14)]">
            <div className="w-12 h-12 rounded-2xl bg-[#EBEFFF] flex items-center justify-center shrink-0">
              <MdDashboard className="h-6 w-6 text-[#3965FF]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider truncate">
                Basis Kasus CBR
              </span>
              <span className="block text-2xl font-extrabold text-[#1B2559] leading-tight my-0.5">
                20 Kasus
              </span>
              <span className="block text-[11px] text-[#707EAE] truncate">
                Rujukan pakar terstandar
              </span>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="pt-2">
          <h3 className="text-lg font-bold text-[#1B2559]">
            Menu & Fitur Sistem
          </h3>
          <p className="text-xs text-[#707EAE]">
            Akses modul skrining, panduan klinis, dan informasi penelitian disleksia.
          </p>
        </div>

        {/* Menu Cards Grid (Horizon Card style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCards.map((card, idx) => (
            <div
              key={idx}
              className={`rounded-[20px] p-6 bg-white shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_20px_45px_rgba(112,144,176,0.16)] flex flex-col justify-between ${
                card.highlight
                  ? "border-[#4318FF]/40 ring-2 ring-[#4318FF]/15"
                  : card.adminOnly
                  ? "border-red-200 bg-gradient-to-b from-white to-red-50/20"
                  : "border-gray-100/70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-[16px] flex items-center justify-center text-2xl shadow-sm ${card.iconBg}`}
                  >
                    {card.icon}
                  </div>
                  {card.badge && (
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        card.highlight
                          ? "bg-[#4318FF] text-white"
                          : card.adminOnly
                          ? "bg-[#E31A1A] text-white"
                          : "bg-[#F4F7FE] text-[#4318FF]"
                      }`}
                    >
                      {card.badge}
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-bold text-[#1B2559] mb-2">
                  {card.title}
                </h4>
                <p className="text-[#707EAE] text-xs leading-relaxed mb-6">
                  {card.desc}
                </p>
              </div>

              <div>
                <Link
                  href={card.href}
                  className={`w-full text-center py-2.5 px-4 text-xs font-bold rounded-full block transition-all shadow-sm ${
                    card.highlight
                      ? "bg-[#4318FF] hover:bg-[#3311DB] text-white shadow-[0px_6px_16px_rgba(67,24,255,0.25)] hover:scale-[1.02]"
                      : card.adminOnly
                      ? "bg-[#E31A1A] hover:bg-[#B71515] text-white shadow-[0px_6px_16px_rgba(227,26,26,0.25)] hover:scale-[1.02]"
                      : "bg-[#F4F7FE] text-[#1B2559] hover:bg-[#4318FF] hover:text-white"
                  }`}
                >
                  {card.buttonText} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Lower Section: Past Diagnoses OR Quick Start Guide */}
        {totalUserDiags > 0 ? (
          <div className="rounded-[20px] bg-white p-6 md:p-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-bold text-[#1B2559]">
                  Aktivitas Skrining Terbaru Anda
                </h3>
                <p className="text-xs text-[#707EAE]">
                  3 pemeriksaan terakhir yang Anda lakukan di sistem BacaBisa
                </p>
              </div>
              <Link
                href="/riwayat"
                className="text-xs font-bold text-[#4318FF] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua Riwayat ({totalUserDiags})</span>
                <MdArrowForward />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F4F7FE]/80 border-b border-gray-100 text-[#A3AED0] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 rounded-l-xl">Waktu</th>
                    <th className="py-3 px-4">Nama Anak</th>
                    <th className="py-3 px-4">Gejala Terpilih</th>
                    <th className="py-3 px-4 text-center">Similarity</th>
                    <th className="py-3 px-4">Tingkat</th>
                    <th className="py-3 px-4 text-center rounded-r-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/60 font-dm">
                  {userDiags.slice(0, 3).map((diag, idx) => {
                    const currentLevel = diag.revised_level || diag.level;
                    const dateStr = new Date(diag.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                    return (
                      <tr key={diag.id || idx} className="hover:bg-[#F4F7FE]/50 transition-colors">
                        <td className="py-3.5 px-4 text-[#707EAE] font-medium whitespace-nowrap">
                          {dateStr}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#1B2559]">
                          {diag.child_label || "Anak"}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {diag.symptoms?.map((s, sIdx) => (
                              <span
                                key={sIdx}
                                className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px] font-bold border border-slate-200/80"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="bg-[#E9E3FF] text-[#4318FF] px-2.5 py-1 rounded-full font-bold text-xs">
                            {Number(diag.similarity).toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-3 py-1 rounded-full font-bold text-xs inline-flex items-center gap-1 ${
                              currentLevel === "Ringan"
                                ? "bg-[#E1FFF4] text-[#01B574]"
                                : currentLevel === "Sedang"
                                ? "bg-[#FFF7EB] text-[#FFB547]"
                                : "bg-[#FCE8E8] text-[#E31A1A]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                currentLevel === "Ringan"
                                  ? "bg-[#01B574]"
                                  : currentLevel === "Sedang"
                                  ? "bg-[#FFB547]"
                                  : "bg-[#E31A1A]"
                              }`}
                            />
                            {currentLevel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Link
                            href={`/diagnosis/hasil/${diag.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#4318FF] bg-[#F4F7FE] hover:bg-[#4318FF] hover:text-white font-bold rounded-full transition-all duration-200 shadow-2xs group"
                          >
                            <span>Buka Hasil</span>
                            <MdArrowForward className="text-xs group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-[20px] bg-white p-6 md:p-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1B2559]">
                  Panduan Mulai Cepat (3 Langkah Sederhana)
                </h3>
                <p className="text-xs text-[#707EAE]">
                  Ikuti langkah berikut untuk memulai pemeriksaan indikasi disleksia pada anak:
                </p>
              </div>
              <Link
                href="/diagnosis"
                className="px-4 py-2 bg-[#4318FF] text-white font-bold text-xs rounded-full shadow-sm hover:bg-[#3311DB] transition flex items-center gap-1.5 w-fit"
              >
                <span>Mulai Skrining Pertama</span>
                <MdArrowForward />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-[#F4F7FE]/70 border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                <div className="w-9 h-9 rounded-full bg-[#4318FF] text-white flex items-center justify-center font-bold text-sm mb-3 shadow-sm">
                  1
                </div>
                <h5 className="text-sm font-bold text-[#1B2559] mb-1.5">
                  1. Amati Perilaku Anak
                </h5>
                <p className="text-xs text-[#707EAE] leading-relaxed">
                  Perhatikan apakah anak kesulitan membedakan b–d/p–q, mengeja kata sederhana, atau lambat saat membaca teks di kelas/rumah.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4F7FE]/70 border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                <div className="w-9 h-9 rounded-full bg-[#3965FF] text-white flex items-center justify-center font-bold text-sm mb-3 shadow-sm">
                  2
                </div>
                <h5 className="text-sm font-bold text-[#1B2559] mb-1.5">
                  2. Pilih 7 Indikator Gejala
                </h5>
                <p className="text-xs text-[#707EAE] leading-relaxed">
                  Centang gejala yang relevan pada form skrining mandiri. Sistem CBR akan menghitung kemiripan terhadap 20 kasus rujukan berbobot.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4F7FE]/70 border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                <div className="w-9 h-9 rounded-full bg-[#01B574] text-white flex items-center justify-center font-bold text-sm mb-3 shadow-sm">
                  3
                </div>
                <h5 className="text-sm font-bold text-[#1B2559] mb-1.5">
                  3. Dapatkan Saran Intervensi
                </h5>
                <p className="text-xs text-[#707EAE] leading-relaxed">
                  Terima hasil klasifikasi (Ringan, Sedang, atau Berat) beserta rekomendasi intervensi edukatif yang dapat diunduh dalam format PDF.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </HorizonDashboardLayout>
  );
}
