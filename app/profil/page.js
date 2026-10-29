import { getCurrentUser } from "@lib/auth";
import { query } from "@lib/db";
import { redirect } from "next/navigation";
import HorizonDashboardLayout from "@components/HorizonDashboardLayout";
import ProfileForm from "./ProfileForm";
import { MdCalendarToday, MdBarChart, MdVerifiedUser } from "react-icons/md";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Profil - BacaBisa",
  description: "Pengaturan akun dan perbarui profil pengguna sistem pakar skrining disleksia BacaBisa.",
};

export default async function ProfilPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    redirect("/login?from=/profil");
  }

  // Get fresh user record from database
  let dbUser = sessionUser;
  let totalScreenings = 0;

  try {
    const userRes = await query("SELECT * FROM users WHERE id = $1", [sessionUser.id]);
    if (userRes.rows.length > 0) {
      dbUser = userRes.rows[0];
    }

    const diagRes = await query("SELECT COUNT(*) as count FROM diagnoses WHERE user_id = $1", [sessionUser.id]);
    if (diagRes.rows.length > 0) {
      totalScreenings = parseInt(diagRes.rows[0].count, 10) || 0;
    }
  } catch (err) {
    console.error("Error loading user profile:", err);
  }

  const joinedDate = dbUser.created_at
    ? new Date(dbUser.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Pengguna Aktif";

  return (
    <HorizonDashboardLayout user={dbUser} brandText="Edit Profil">
      <div className="max-w-[900px] mx-auto space-y-6">
        {/* Profile Header Banner */}
        <div className="relative overflow-hidden rounded-[22px] bg-white p-6 sm:p-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Big Gradient Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#4318FF] via-[#5D2EFA] to-[#868CFF] text-white text-3xl font-black shadow-[0_12px_28px_rgba(67,24,255,0.25)]">
              {dbUser.name ? dbUser.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B2559] truncate">
                  {dbUser.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-0.5 rounded-full ${
                    dbUser.role === "admin"
                      ? "bg-[#FCE8E8] text-[#E31A1A]"
                      : "bg-[#E1FFF4] text-[#01B574]"
                  }`}
                >
                  <MdVerifiedUser className="w-3.5 h-3.5" />
                  {dbUser.role === "admin" ? "Administrator CBR" : "Pengguna Terdaftar"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#707EAE] font-medium truncate mb-3">
                {dbUser.email}
              </p>

              {/* Meta Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#707EAE]">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F4F7FE] text-[#707EAE]">
                  <MdCalendarToday className="w-3.5 h-3.5 text-[#4318FF]" />
                  <span>Bergabung: {joinedDate}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F4F7FE] text-[#707EAE]">
                  <MdBarChart className="w-3.5 h-3.5 text-[#01B574]" />
                  <span>{totalScreenings} Skrining Selesai</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form Card */}
        <ProfileForm user={dbUser} />
      </div>
    </HorizonDashboardLayout>
  );
}
