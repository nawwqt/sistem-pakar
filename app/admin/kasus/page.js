import { query } from "@lib/db";
import { getCurrentUser } from "@lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { generateNextCaseCode } from "@lib/cbr";
import { AddCaseForm, DeleteCaseForm } from "./CaseComponents";
import HorizonDashboardLayout from "@components/HorizonDashboardLayout";
import { MdFolder, MdArrowBack } from "react-icons/md";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Basis Kasus & Matriks Gejala - Admin BacaBisa",
  description: "Manajemen basis kasus CBR, matriks biner 0/1 gejala disleksia, penambahan dan penghapusan kasus.",
};

export default async function AdminKasusPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const [symptomsRes, casesRes] = await Promise.all([
    query("SELECT * FROM symptoms ORDER BY code ASC"),
    query("SELECT * FROM cases ORDER BY code ASC"),
  ]);

  const symptoms = symptomsRes.rows;
  const cases = casesRes.rows;
  const nextCode = generateNextCaseCode(cases.map((c) => c.code));

  return (
    <HorizonDashboardLayout user={user} brandText="Basis Kasus (Matriks)">
      <div className="max-w-[1250px] mx-auto space-y-6">

        {/* Warning Banner for Placeholder Cases (C01-C07) */}
        <div className="p-5 rounded-[20px] bg-white border-l-4 border-[#FFB547] shadow-[0px_18px_40px_rgba(112,144,176,0.08)] mb-8 flex items-start gap-3.5">
          <span className="text-2xl">⚠️</span>
          <div className="text-xs text-[#1B2559] leading-relaxed">
            <strong className="text-amber-800 font-bold">Catatan Peringatan Pakar (Kasus Ringan C01–C07):</strong>
            <p className="mt-1 text-[#707EAE]">
              Kasus <strong>C01 sampai C07</strong> dikategorikan sebagai <em>data contoh / placeholder</em> dengan badge "contoh" karena dokumen acuan primer belum memuat data kasus Ringan secara spesifik. Data ini dibuat sebagai rujukan awal 1–2 gejala dan <strong>wajib divalidasi lebih lanjut bersama pakar atau terapis disleksia</strong> sebelum digunakan sebagai referensi diagnosis formal.
            </p>
          </div>
        </div>

        {/* Form: Tambah Kasus Baru */}
        <div className="rounded-[20px] bg-white p-6 md:p-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/60 mb-8">
          <h2 className="text-lg font-bold text-[#1B2559] mb-1">+ Tambah Kasus Baru ke Basis Pengetahuan</h2>
          <p className="text-xs text-[#707EAE] mb-6">
            Tambahkan kasus baru beserta kombinasi gejalanya untuk memperluas cakupan deteksi sistem pakar.
          </p>
          <AddCaseForm symptoms={symptoms} nextCode={nextCode} />
        </div>

        {/* Binary Matrix Table */}
        <div className="rounded-[20px] bg-white p-6 md:p-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#1B2559]">Matriks Gejala Basis Kasus (0 / 1)</h2>
              <p className="text-xs text-[#707EAE] mt-0.5">
                Nilai <strong>1</strong> (hijau) menandakan gejala aktif pada kasus tersebut, sedangkan nilai <strong>0</strong> menandakan gejala tidak ada.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-[#707EAE]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#01B574] inline-block"></span>
                <span>1 (Aktif)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gray-200 inline-block"></span>
                <span>0 (Tidak)</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F7FE]/80 border-b border-gray-100 text-[#A3AED0] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 text-left rounded-l-xl">Kode</th>
                  <th className="py-3 px-3 text-left">Tingkat</th>
                  {symptoms.map((s) => (
                    <th key={s.code} className="py-3 px-2 font-mono" title={s.name}>
                      {s.code}
                    </th>
                  ))}
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center rounded-r-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/70 font-dm">
                {cases.map((c) => {
                  const caseSymptoms = new Set(c.symptoms || []);

                  return (
                    <tr key={c.code} className="hover:bg-[#F4F7FE]/50 transition-colors">
                      <td className="py-3.5 px-3 text-left font-mono font-bold text-[#4318FF]">
                        {c.code}
                      </td>
                      <td className="py-3.5 px-3 text-left">
                        <span
                          className={`px-3 py-1 rounded-full font-bold text-xs inline-flex items-center gap-1 ${
                            c.level === "Ringan"
                              ? "bg-[#E1FFF4] text-[#01B574]"
                              : c.level === "Sedang"
                              ? "bg-[#FFF7EB] text-[#FFB547]"
                              : "bg-[#FCE8E8] text-[#E31A1A]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.level === "Ringan"
                                ? "bg-[#01B574]"
                                : c.level === "Sedang"
                                ? "bg-[#FFB547]"
                                : "bg-[#E31A1A]"
                            }`}
                          />
                          {c.level}
                        </span>
                      </td>
                      {symptoms.map((s) => {
                        const hasSymptom = caseSymptoms.has(s.code);
                        return (
                          <td key={s.code} className="py-3.5 px-2 font-mono">
                            {hasSymptom ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#E1FFF4] text-[#01B574] font-bold text-xs">
                                1
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-gray-400 font-normal text-xs">
                                0
                              </span>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {c.is_placeholder ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FFF7EB] text-[#FFB547] font-bold text-[10px]">
                            contoh
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EBEFFF] text-[#3965FF] font-bold text-[10px]">
                            dokumen
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <DeleteCaseForm code={c.code} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HorizonDashboardLayout>
  );
}
