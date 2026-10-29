import { query } from "@lib/db";
import { getCurrentUser } from "@lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SymptomWeightRow from "./SymptomWeightForm";
import HorizonDashboardLayout from "@components/HorizonDashboardLayout";
import { MdScale, MdArrowBack } from "react-icons/md";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Bobot Gejala - Admin BacaBisa",
  description: "Pengaturan bobot kepentingan (w) 7 gejala disleksia untuk formula similarity CBR.",
};

export default async function AdminGejalaPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const res = await query("SELECT * FROM symptoms ORDER BY code ASC");
  const symptoms = res.rows;

  const totalWeight = symptoms.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);

  return (
    <HorizonDashboardLayout user={user} brandText="Bobot Gejala">
      <div className="max-w-[1100px] mx-auto space-y-6">

        {/* Info Note */}
        <div className="p-5 rounded-[20px] bg-white border-l-4 border-[#4318FF] shadow-[0px_18px_40px_rgba(112,144,176,0.08)] mb-8 flex items-start gap-3.5">
          <span className="text-2xl">💡</span>
          <div className="text-xs text-[#1B2559] leading-relaxed">
            <strong className="text-[#4318FF] font-bold">Catatan Pengaruh Pembobotan Pakar:</strong>
            <p className="mt-1 text-[#707EAE]">
              Nilai bobot menentukan seberapa krusial suatu gejala dalam menentukan kesamaan kasus. Gejala dengan bobot lebih tinggi (misal bobot 3) memiliki pengaruh lebih besar terhadap persentase kecocokan kasus dibandingkan gejala berbobot 1.
            </p>
          </div>
        </div>

        {/* Symptoms Table */}
        <div className="rounded-[20px] bg-white p-6 md:p-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F7FE]/80 border-b border-gray-100 text-[#A3AED0] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 rounded-l-xl">No</th>
                  <th className="py-3 px-4">Kode</th>
                  <th className="py-3 px-4">Nama Gejala</th>
                  <th className="py-3 px-4 w-48">Bobot (w) & Aksi</th>
                  <th className="py-3 px-4 rounded-r-xl">Fokus Indikator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/70 font-dm">
                {symptoms.map((s, idx) => (
                  <SymptomWeightRow key={s.code} symptom={s} idx={idx} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HorizonDashboardLayout>
  );
}
