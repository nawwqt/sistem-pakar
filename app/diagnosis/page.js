import { query } from "@lib/db";
import { getCurrentUser } from "@lib/auth";
import { redirect } from "next/navigation";
import DiagnosisForm from "./DiagnosisForm";
import HorizonDashboardLayout from "@components/HorizonDashboardLayout";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mulai Skrining Diagnosis - BacaBisa",
  description: "Form observasi gejala kesulitan membaca dan menulis untuk analisis tingkat keparahan disleksia menggunakan CBR.",
};

export default async function DiagnosisPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?from=/diagnosis");
  }

  let symptoms = [];
  try {
    const res = await query("SELECT * FROM symptoms ORDER BY code ASC");
    symptoms = res.rows;
  } catch (err) {
    console.error("Error loading symptoms for diagnosis:", err);
  }

  return (
    <HorizonDashboardLayout user={user} brandText="Mulai Skrining Baru">
      <div className="max-w-[900px] mx-auto space-y-6">
        {/* Header Horizon Style */}
        <div className="rounded-[20px] bg-white p-6 md:p-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100 text-center">
          <span className="px-3.5 py-1 bg-[#F4F7FE] text-[#4318FF] text-xs font-bold rounded-full uppercase tracking-wider inline-block mb-3">
            Instrumen Skrining CBR
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2559]">
            Analisis Tingkat Keparahan Disleksia
          </h1>
          <p className="text-[#707EAE] text-xs sm:text-sm mt-2 max-w-lg mx-auto">
            Isi identitas buah hati dan centang tanda-tanda yang dialami oleh anak. Sistem pakar akan mencocokkannya dengan basis kasus menggunakan rumus kemiripan Sorensen.
          </p>
        </div>

        {/* Diagnosis Form Sections */}
        <DiagnosisForm symptoms={symptoms} />
      </div>
    </HorizonDashboardLayout>
  );
}
