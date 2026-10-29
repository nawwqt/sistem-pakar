import Link from "next/link";

export const metadata = {
  title: "Petunjuk Penggunaan - BacaBisa",
  description: "Langkah-langkah penggunaan sistem pakar skrining disleksia BacaBisa berbasis Case-Based Reasoning.",
};

export default function PetunjukPage() {
  const steps = [
    {
      num: "01",
      title: "Masuk atau Daftar Akun",
      desc: "Masuk ke akun Anda atau daftarkan akun baru jika belum memiliki akun. Anda juga dapat langsung masuk menggunakan akun Google.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Buka Form Skrining Baru",
      desc: "Pilih menu 'Mulai Skrining Baru'. Masukkan nama atau inisial buah hati yang akan diobservasi.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Centang Gejala Teramati",
      desc: "Centang tanda-tanda kesulitan membaca dan menulis (dari 7 gejala klinis terstandar) yang tampak secara nyata pada aktivitas harian anak.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      num: "04",
      title: "Proses Analisis Kasus (CBR)",
      desc: "Klik tombol 'Analisis Kasus'. Algoritma CBR akan mencocokkan gejala dengan basis kasus terdahulu dan menghitung nilai kemiripannya.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      num: "05",
      title: "Lihat Hasil & Rekomendasi",
      desc: "Sistem menampilkan estimasi tingkat keparahan (Ringan, Sedang, atau Berat), persentase kemiripan, dan rekomendasi stimulasi belajar awal.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      num: "06",
      title: "Pantau Riwayat Evaluasi",
      desc: "Hasil skrining otomatis tersimpan di menu 'Riwayat'. Anda dapat memantau kembali rekam perkembangan belajar anak kapan saja.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="section bg-slate-50/70 py-12 sm:py-16 min-h-[85vh]">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Langkah Penggunaan Sistem
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Ikuti 6 langkah mudah berikut untuk melakukan skrining indikasi disleksia pada anak menggunakan metode Case-Based Reasoning.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-14">
          {steps.map((st, i) => (
            <div
              key={i}
              className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group"
            >
              {/* Giant Background Number */}
              <div className="text-5xl font-black text-slate-100 absolute top-2 right-4 select-none pointer-events-none group-hover:text-primary/10 transition-colors">
                {st.num}
              </div>

              <div>
                {/* Step Icon Badge */}
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {st.icon}
                </div>

                <div className="text-xs font-bold text-primary tracking-wider uppercase mb-1">
                  Langkah {st.num}
                </div>
                <h3 className="text-lg font-bold text-dark mb-2.5 font-['Plus_Jakarta_Sans',sans-serif]">
                  {st.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Single Focused CTA */}
        <div className="text-center pt-4">
          <Link
            href="/diagnosis"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-['Plus_Jakarta_Sans',sans-serif]"
          >
            <span>Mulai Skrining Sekarang</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
