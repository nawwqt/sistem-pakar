import Link from "next/link";
import {
  MdChildCare,
  MdPeople,
  MdPsychology,
  MdCheckCircle,
  MdWarning,
  MdError,
  MdAutoAwesome,
  MdFactCheck,
  MdListAlt,
  MdAssessment,
  MdLightbulb,
  MdArrowForward,
} from "react-icons/md";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Objek Penelitian - BacaBisa",
  description:
    "Deskripsi objek penelitian sistem pakar deteksi disleksia pada anak usia sekolah dasar menggunakan Case-Based Reasoning (CBR).",
};

export default function ObjekPenelitianPage() {
  const gejalaList = [
    { code: "G01", text: "Sulit mengenali huruf abjad dasar" },
    { code: "G02", text: "Tertukar huruf mirip/cermin (b–d, p–q)" },
    { code: "G03", text: "Kecepatan membaca lambat & terbata-bata" },
    { code: "G04", text: "Sering salah mengeja kata" },
    { code: "G05", text: "Sulit memahami isi dan cerita bacaan" },
    { code: "G06", text: "Sulit menuliskan kata-kata sederhana" },
    { code: "G07", text: "Cenderung menghindari kegiatan membaca" },
  ];

  return (
    <div className="section bg-gradient-to-b from-[#f8fafc] via-[#f4f7fe] to-[#ffffff] py-12 sm:py-16">
      <div className="container max-w-[1050px] px-4">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B2559] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Deskripsi Objek Penelitian
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
            Pengembangan Sistem Pakar Deteksi Tingkat Keparahan Disleksia pada Anak Usia Sekolah Dasar Menggunakan Metode{" "}
            <span className="font-semibold text-[#1B2559]">Case-Based Reasoning (CBR)</span>
          </p>
        </div>

        {/* 1. Objek Penelitian & Pengguna Sistem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Card: Objek Penelitian */}
          <div className="bg-white p-6 sm:p-7 rounded-[22px] border border-gray-100 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] flex items-start gap-4 transition-all hover:shadow-[0px_20px_45px_rgba(112,144,176,0.12)]">
            <div className="w-12 h-12 rounded-2xl bg-[#E9E3FF] text-[#4318FF] flex items-center justify-center shrink-0">
              <MdChildCare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider block">
                Subjek Pengamatan
              </span>
              <h2 className="text-lg font-bold text-[#1B2559] mt-0.5 mb-1.5">
                Objek Penelitian
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Anak usia <strong>Sekolah Dasar (SD)</strong> yang menunjukkan tanda-tanda kesulitan spesifik dalam kemampuan <strong>membaca, menulis, dan mengeja</strong>.
              </p>
            </div>
          </div>

          {/* Card: Pengguna Sistem */}
          <div className="bg-white p-6 sm:p-7 rounded-[22px] border border-gray-100 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] flex items-start gap-4 transition-all hover:shadow-[0px_20px_45px_rgba(112,144,176,0.12)]">
            <div className="w-12 h-12 rounded-2xl bg-[#E1FFF4] text-[#01B574] flex items-center justify-center shrink-0">
              <MdPeople className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider block">
                Target Pengguna
              </span>
              <h2 className="text-lg font-bold text-[#1B2559] mt-0.5 mb-1.5">
                Pengguna Sistem
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                <strong>Orang tua, guru sekolah, atau terapis pendamping</strong> yang melakukan observasi langsung terhadap gejala-gejala yang tampak pada anak saat proses belajar.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Pemahaman Disleksia & 7 Tanda Klinis Teramati */}
        <div className="bg-white p-7 sm:p-9 rounded-[24px] border border-gray-100 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF7EB] text-[#FFB547] flex items-center justify-center shrink-0">
              <MdPsychology className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1B2559]">
                Karakteristik Disleksia pada Anak SD
              </h2>
              <p className="text-xs text-[#707EAE]">
                Memahami hakikat kesulitan belajar membaca anak dengan tepat
              </p>
            </div>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed mb-6">
            <strong>Disleksia</strong> adalah gangguan belajar spesifik yang ditandai dengan hambatan dalam kemampuan membaca, menulis, dan mengeja, meskipun anak memiliki <strong>tingkat kecerdasan (IQ) normal</strong>. Anak disleksia bukanlah anak yang malas atau kurang cerdas, melainkan memiliki perbedaan cara kerja otak dalam memproses simbol bahasa dan fonologi.
          </p>

          <div className="pt-5 border-t border-gray-100">
            <span className="text-xs font-bold text-[#1B2559] uppercase tracking-wider block mb-3">
              7 Indikator Gejala Teramati pada Anak Usia SD:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {gejalaList.map((g) => (
                <div
                  key={g.code}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F4F7FE]/70 border border-gray-200/60 text-xs font-medium text-[#1B2559]"
                >
                  <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded-lg bg-[#4318FF] text-white shrink-0">
                    {g.code}
                  </span>
                  <span className="leading-snug">{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Tiga Tingkat Keparahan Disleksia */}
        <div className="mb-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-2xl font-extrabold text-[#1B2559]">
              3 Tingkat Keparahan Disleksia
            </h2>
            <p className="text-xs sm:text-sm text-[#707EAE] mt-1">
              Dasar klasifikasi hasil evaluasi penentuan kondisi belajar anak
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Ringan */}
            <div className="bg-white p-6 sm:p-7 rounded-[22px] border-2 border-[#01B574]/30 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E1FFF4] text-[#01B574] inline-flex items-center gap-1.5">
                    <MdCheckCircle className="w-4 h-4" />
                    Tingkat Ringan
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#707EAE]">
                    7 Kasus (C01–C07)
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1B2559] mb-2">
                  Bantuan Sederhana
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Gejala yang muncul sedikit dan umumnya belum mengganggu seluruh aktivitas belajar. Anak masih dapat mengikuti pelajaran di kelas dengan bantuan stimulasi sederhana.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 text-[11px] font-semibold text-[#01B574]">
                ✓ Masih dapat beradaptasi mandiri
              </div>
            </div>

            {/* 2. Sedang */}
            <div className="bg-white p-6 sm:p-7 rounded-[22px] border-2 border-[#FFB547]/40 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF7EB] text-[#FFB547] inline-flex items-center gap-1.5">
                    <MdWarning className="w-4 h-4" />
                    Tingkat Sedang
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#707EAE]">
                    7 Kasus (C08–C14)
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1B2559] mb-2">
                  Pendampingan Terarah
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Gejala muncul lebih banyak, kesulitan membaca dan menulis mulai terlihat jelas pada kegiatan belajar sehari-hari sehingga membutuhkan pendampingan yang lebih terarah.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 text-[11px] font-semibold text-[#FFB547]">
                ⚠️ Perlu bimbingan guru & orang tua
              </div>
            </div>

            {/* 3. Berat */}
            <div className="bg-white p-6 sm:p-7 rounded-[22px] border-2 border-[#E31A1A]/30 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FCE8E8] text-[#E31A1A] inline-flex items-center gap-1.5">
                    <MdError className="w-4 h-4" />
                    Tingkat Berat
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#707EAE]">
                    6 Kasus (C15–C20)
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1B2559] mb-2">
                  Intervensi Khusus
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Hampir seluruh gejala muncul bersamaan dan sangat mengganggu proses belajar anak, sehingga membutuhkan penanganan khusus, terapis ahli, dan intervensi intensif.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 text-[11px] font-semibold text-[#E31A1A]">
                🚨 Butuh penanganan ahli & intensif
              </div>
            </div>
          </div>
        </div>

        {/* 4. Metode CBR & Struktur 20 Basis Kasus */}
        <div className="bg-white p-7 sm:p-9 rounded-[24px] border border-gray-100 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#E9E3FF] text-[#4318FF] flex items-center justify-center shrink-0">
              <MdAutoAwesome className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1B2559]">
                Metode Case-Based Reasoning (CBR) & Basis Kasus
              </h2>
              <p className="text-xs text-[#707EAE]">
                Penalaran berbasis kasus dengan 20 rujukan terstandar pakar
              </p>
            </div>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed mb-6">
            Sistem ini dikembangkan menggunakan metode <strong>Case-Based Reasoning (CBR)</strong>, di mana sistem menentukan tingkat keparahan disleksia berdasarkan kasus-kasus yang telah divalidasi oleh pakar sebelumnya. Dengan metode ini, sistem menyesuaikan hasilnya berdasarkan <strong>derajat kemiripan gejala</strong> antara kasus observasi baru dengan <strong>20 kasus rujukan</strong> yang tersimpan dalam basis kasus:
          </p>

          {/* 3 Komponen Kasus Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="p-4 rounded-2xl bg-[#F4F7FE] border border-gray-200/60">
              <div className="w-8 h-8 rounded-xl bg-white text-[#4318FF] flex items-center justify-center shadow-xs mb-2.5">
                <MdListAlt className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1B2559] mb-1">
                1. Gejala Teramati
              </h3>
              <p className="text-xs text-[#707EAE] leading-relaxed">
                Tujuh indikator gejala disleksia yang diamati dan dinilai ada atau tidaknya pada anak.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F7FE] border border-gray-200/60">
              <div className="w-8 h-8 rounded-xl bg-white text-[#01B574] flex items-center justify-center shadow-xs mb-2.5">
                <MdAssessment className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1B2559] mb-1">
                2. Tingkat Keparahan
              </h3>
              <p className="text-xs text-[#707EAE] leading-relaxed">
                Hasil penilaian kondisi klinis kasus tersebut (kategori Ringan, Sedang, atau Berat).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F7FE] border border-gray-200/60">
              <div className="w-8 h-8 rounded-xl bg-white text-[#FFB547] flex items-center justify-center shadow-xs mb-2.5">
                <MdLightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1B2559] mb-1">
                3. Rekomendasi Awal
              </h3>
              <p className="text-xs text-[#707EAE] leading-relaxed">
                Saran panduan langkah awal dan stimulasi belajar yang sesuai dengan tingkat keparahannya.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Validasi Pakar (Card Penutup) */}
        <div className="p-6 sm:p-8 rounded-[22px] bg-gradient-to-br from-[#E9E3FF]/60 via-white to-[#F4F7FE] border border-[#4318FF]/20 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#4318FF] text-white flex items-center justify-center shadow-md shrink-0">
            <MdFactCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#1B2559] mb-1">
              Data & Kriteria Tervalidasi Pakar
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Seluruh data dan kriteria yang digunakan dalam penelitian ini telah melalui <strong>proses validasi pakar</strong> untuk memastikan kesesuaian dengan kaidah keilmuan. Dengan demikian, sistem yang dikembangkan mampu memberikan hasil analisis yang <strong>akurat, aman, serta bermanfaat</strong> bagi deteksi dini disleksia pada anak usia sekolah dasar.
            </p>
          </div>
        </div>

        {/* 6. Call To Action Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#4318FF] via-[#5A28FF] to-[#868CFF] text-white text-center shadow-[0_15px_35px_rgba(67,24,255,0.25)]">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2.5">
            Siap Melakukan Skrining untuk Buah Hati Anda?
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed">
            Identifikasi tanda-tanda kesulitan membaca anak secara mandiri dan cepat. Dapatkan hasil estimasi keparahan dan panduan penanganan awal dalam 2 menit.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/diagnosis"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#4318FF] font-bold text-sm shadow-md hover:bg-slate-50 hover:shadow-lg active:scale-95 transition-all"
            >
              <span>Mulai Skrining Mandiri</span>
              <MdArrowForward className="w-4 h-4" />
            </Link>
            <Link
              href="/petunjuk"
              className="px-7 py-3.5 rounded-full bg-white/15 border border-white/30 text-white font-bold text-sm hover:bg-white/25 active:scale-95 transition-all"
            >
              Pelajari Alur Penggunaan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
