import { query } from "@lib/db";
import { getCurrentUser } from "@lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import HorizonDashboardLayout from "@components/HorizonDashboardLayout";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Riwayat Skrining - BacaBisa",
  description: "Daftar riwayat pemeriksaan skrining disleksia anak yang pernah dilakukan.",
};

export default async function RiwayatPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?from=/riwayat");
  }

  let diagnoses = [];
  try {
    const res = await query(
      "SELECT * FROM diagnoses WHERE user_id = $1 ORDER BY created_at DESC",
      [user.id]
    );
    diagnoses = res.rows;
  } catch (err) {
    console.error("Error loading history:", err);
  }

  const levelBadges = {
    Ringan: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Sedang: "bg-amber-100 text-amber-800 border-amber-300",
    Berat: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <HorizonDashboardLayout user={user} brandText="Riwayat Skrining Saya">
      <div className="max-w-[1100px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="px-3.5 py-1 bg-[#E9E3FF] text-[#4318FF] text-xs font-bold rounded-full uppercase tracking-wider inline-block mb-2">
              Arsip Pemeriksaan
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2559]">Riwayat Skrining Anda</h1>
            <p className="text-[#707EAE] text-xs sm:text-sm mt-1">
              Rekam catatan pemeriksaan anak untuk evaluasi perkembangan berkala.
            </p>
          </div>
          <div>
            <Link
              href="/diagnosis"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4318FF] to-[#868CFF] hover:from-[#3612CC] hover:to-[#7076EE] text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-[0_10px_20px_rgba(67,24,255,0.2)] transition-all active:scale-95"
            >
              + Skrining Baru
            </Link>
          </div>
        </div>

        {/* Table or Empty State */}
        {diagnoses.length === 0 ? (
          <div className="rounded-[20px] bg-white p-12 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100 text-center max-w-lg mx-auto">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-bold text-[#1B2559] mb-2">Belum Ada Riwayat</h3>
            <p className="text-[#707EAE] text-xs sm:text-sm mb-6">
              Anda belum pernah melakukan skrining disleksia pada sistem. Mulai skrining pertama sekarang untuk mendeteksi indikasi kesulitan membaca pada anak.
            </p>
            <Link
              href="/diagnosis"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4318FF] to-[#868CFF] hover:from-[#3612CC] hover:to-[#7076EE] text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-[0_10px_20px_rgba(67,24,255,0.2)] transition-all active:scale-95"
            >
              Mulai Diagnosis Sekarang →
            </Link>
          </div>
        ) : (
          <div className="rounded-[20px] bg-white p-6 md:p-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-border text-dark font-bold text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Tanggal & Waktu</th>
                    <th className="py-3 px-4">Subjek / Anak</th>
                    <th className="py-3 px-4">Gejala</th>
                    <th className="py-3 px-4 text-center">Kemiripan</th>
                    <th className="py-3 px-4">Tingkat Keparahan</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-text text-xs">
                  {diagnoses.map((d, idx) => {
                    const activeLevel = d.revised_level || d.level;
                    const badge = levelBadges[activeLevel] || levelBadges.Sedang;
                    const dateStr = new Date(d.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr key={d.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                          #{idx + 1}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-dark font-medium">
                          {dateStr}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-dark">
                          {d.child_label || "Anak"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-dark font-semibold">
                            {d.symptoms?.length || 0} Gejala
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-primary">
                          {Number(d.similarity).toFixed(1)}%
                          <span className="block text-[10px] text-text font-normal font-sans">
                            (vs {d.best_case})
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${badge}`}>
                            {activeLevel}
                          </span>
                          {d.revised_level && (
                            <span className="block text-[10px] text-purple-600 font-semibold mt-0.5">
                              (Direvisi)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <Link
                            href={`/diagnosis/hasil/${d.id}`}
                            className="inline-block px-3 py-1.5 rounded-lg bg-teal-50 text-primary font-bold text-xs hover:bg-primary hover:text-white transition"
                          >
                            Lihat Detail →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </HorizonDashboardLayout>
  );
}
