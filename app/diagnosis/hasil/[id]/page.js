import { query } from "@lib/db";
import { getCurrentUser } from "@lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import HorizonDashboardLayout from "@components/HorizonDashboardLayout";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hasil Skrining Disleksia - BacaBisa",
  description: "Hasil analisis tingkat keparahan disleksia menggunakan Case-Based Reasoning.",
};

export default async function HasilDiagnosisPage({ params }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { id } = params;

  // Fetch diagnosis
  const diagRes = await query("SELECT * FROM diagnoses WHERE id = $1", [id]);
  if (diagRes.rows.length === 0) {
    notFound();
  }

  const diagnosis = diagRes.rows[0];

  // Access check: owner or admin
  const isOwner = String(diagnosis.user_id) === String(user.id);
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) {
    redirect("/dashboard");
  }

  // Active level: revised if exists, else original
  const displayLevel = diagnosis.revised_level || diagnosis.level;

  // Recommendation advice
  const recRes = await query("SELECT advice FROM recommendations WHERE level = $1", [displayLevel]);
  const advice = recRes.rows.length > 0
    ? recRes.rows[0].advice
    : "Lakukan pemantauan dan konsultasikan dengan guru maupun tenaga profesional terkait.";

  // Symptoms catalog
  const symptomsRes = await query("SELECT * FROM symptoms ORDER BY code ASC");
  const symptomsMap = new Map(symptomsRes.rows.map((s) => [s.code, s.name]));

  // Level badge and styling
  const levelStyles = {
    Ringan: {
      badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
      barBg: "bg-emerald-500",
      cardBg: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-300",
      textColor: "text-emerald-700",
      icon: "🟢",
    },
    Sedang: {
      badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
      barBg: "bg-amber-500",
      cardBg: "from-amber-500/10 to-orange-500/5",
      border: "border-amber-300",
      textColor: "text-amber-700",
      icon: "🟠",
    },
    Berat: {
      badgeBg: "bg-red-100 text-red-800 border-red-300",
      barBg: "bg-red-500",
      cardBg: "from-red-500/10 to-rose-500/5",
      border: "border-red-300",
      textColor: "text-red-700",
      icon: "🔴",
    },
  };

  const style = levelStyles[displayLevel] || levelStyles.Sedang;

  const topMatches = Array.isArray(diagnosis.top_matches)
    ? diagnosis.top_matches
    : typeof diagnosis.top_matches === "string"
    ? JSON.parse(diagnosis.top_matches || "[]")
    : [];

  const formattedDate = new Date(diagnosis.created_at).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <HorizonDashboardLayout user={user} brandText="Hasil Skrining (CBR)">
      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* Navigation & Print Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/riwayat"
            className="text-sm font-bold text-primary hover:underline flex items-center gap-1.5"
          >
            ← Kembali ke Riwayat
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="px-3.5 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition"
              >
                ⚙️ Kelola di Panel Admin
              </Link>
            )}
            <Link
              href="/diagnosis"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#4318FF] to-[#868CFF] hover:from-[#3612CC] hover:to-[#7076EE] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-[0_4px_12px_rgba(67,24,255,0.2)] transition-all active:scale-95"
            >
              + Skrining Baru
            </Link>
          </div>
        </div>

        {/* Disclaimer Banner (Wajib) */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs leading-relaxed mb-6 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <strong>DISCLAIMER MEDIS:</strong> Hasil ini merupakan hasil skrining awal berbasis kecerdasan buatan (Case-Based Reasoning) dan <strong>bukan merupakan diagnosis medis/psikologis resmi</strong>. Gunakan hasil ini sebagai rujukan awal sebelum berkonsultasi lebih lanjut dengan psikolog anak atau tenaga profesional ahli.
          </div>
        </div>

        {/* Main Result Card */}
        <div className={`card bg-gradient-to-br ${style.cardBg} bg-white p-8 rounded-2xl border-2 ${style.border} shadow-md mb-8`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6 mb-6">
            <div>
              <span className="text-xs text-text font-medium block">
                Hasil Skrining Kasus Disleksia #{diagnosis.id}
              </span>
              <h1 className="h3 font-bold text-dark mt-1">
                {diagnosis.child_label || "Anak"}
              </h1>
              <span className="text-xs text-text mt-1 block">
                Waktu pemeriksaan: {formattedDate}
              </span>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-text block mb-1">
                Tingkat Keparahan
              </span>
              <div className="inline-flex items-center gap-2">
                <span className={`px-4 py-1.5 rounded-full text-base font-bold border ${style.badgeBg} shadow-sm`}>
                  {style.icon} {displayLevel}
                </span>
                {diagnosis.revised_level && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold border border-purple-300">
                    Direvisi Pakar
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Similarity Metric & Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-dark">
                Tingkat Kemiripan dengan Kasus Rujukan ({diagnosis.best_case})
              </span>
              <span className={`font-mono font-bold text-lg ${style.textColor}`}>
                {Number(diagnosis.similarity).toFixed(1)}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${style.barBg}`}
                style={{ width: `${Math.min(100, Math.max(5, diagnosis.similarity))}%` }}
              />
            </div>
            <p className="text-xs text-text mt-2">
              Sistem mencocokkan input dengan basis kasus dan menemukan kesamaan tertinggi pada kasus <strong>{diagnosis.best_case}</strong> dengan kecocokan <strong>{Number(diagnosis.similarity).toFixed(1)}%</strong>.
            </p>
          </div>

          {/* Selected Symptoms */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-dark uppercase tracking-wider mb-3">
              Gejala yang Teramati pada Anak ({diagnosis.symptoms?.length || 0} Gejala):
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {diagnosis.symptoms?.map((code) => (
                <div
                  key={code}
                  className="p-3 bg-white/90 rounded-xl border border-border flex items-center gap-2.5 text-xs text-dark font-medium shadow-xs"
                >
                  <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {code}
                  </span>
                  <span>{symptomsMap.get(code) || code}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations / Advice */}
          <div className="p-6 bg-white rounded-xl border border-border shadow-sm">
            <h2 className="text-sm font-bold text-dark uppercase tracking-wider flex items-center gap-2 mb-2">
              <span>💡</span> Saran Penanganan & Intervensi Awal ({displayLevel}):
            </h2>
            <p className="text-sm text-text leading-relaxed">
              {advice}
            </p>
          </div>
        </div>

        {/* Top 3 Matches Table */}
        <div className="card bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm mb-8">
          <h2 className="h5 font-bold text-dark mb-1">
            Tabel 3 Kasus Paling Mirip (Top Matches CBR)
          </h2>
          <p className="text-xs text-text mb-6">
            Hasil retrieval membandingkan kasus baru dengan seluruh basis pengetahuan berdasarkan kesamaan pola gejala berbobot.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border text-dark font-bold text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Peringkat</th>
                  <th className="py-3 px-4">Kode Kasus</th>
                  <th className="py-3 px-4">Tingkat Kasus</th>
                  <th className="py-3 px-4 text-center">Kemiripan (%)</th>
                  <th className="py-3 px-4">Gejala pada Kasus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text text-xs">
                {topMatches.map((m, rank) => {
                  const mLevelStyle = levelStyles[m.level] || levelStyles.Sedang;
                  return (
                    <tr
                      key={m.caseCode}
                      className={rank === 0 ? "bg-teal-50/40 font-semibold" : "hover:bg-slate-50"}
                    >
                      <td className="py-3 px-4">
                        <span className="inline-block w-6 h-6 rounded-full bg-slate-100 text-dark font-bold text-center leading-6">
                          #{rank + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {m.caseCode}
                        {m.isPlaceholder && (
                          <span className="ml-1 text-[10px] text-amber-600 font-normal">
                            (contoh)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${mLevelStyle.badgeBg}`}>
                          {m.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-dark">
                        {Number(m.similarityPercentage || 0).toFixed(1)}%
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {m.symptoms?.map((c) => (
                            <span
                              key={c}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                diagnosis.symptoms?.includes(c)
                                  ? "bg-emerald-100 text-emerald-800 font-bold"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/diagnosis" className="btn btn-primary px-8 py-3">
            Lakukan Skrining Kasus Lain →
          </Link>
          <Link href="/riwayat" className="btn btn-outline-primary px-8 py-3">
            Lihat Semua Riwayat Skrining
          </Link>
        </div>
      </div>
    </HorizonDashboardLayout>
  );
}
