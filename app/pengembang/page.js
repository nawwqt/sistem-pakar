export const metadata = {
  title: "Tim Pengembang - BacaBisa",
  description: "Profil tim yang berada di balik sistem BacaBisa.",
};

export default function PengembangPage() {
  const members = [
    {
      name: "Ridwan Nazar",
      role: "FRONTEND DEVELOPER",
    },
    {
      name: "Elita Inggriani",
      role: "BACKEND DEVELOPER",
    },
    {
      name: "Kaysa Ramadhani",
      role: "SYSTEM ANALYST",
    },
    {
      name: "Yumarlin MZ",
      role: "DOSEN PEMBIMBING",
    },
  ];

  return (
    <div className="min-h-[85vh] bg-[#F0F7FD] py-14 md:py-20">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Tim Pengembang
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
            Profil tim yang berada di balik sistem BacaBisa.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7 max-w-5xl mx-auto">
          {members.map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-[26px] pt-8 pb-10 px-6 shadow-[0_10px_30px_rgba(19,84,122,0.07)] border border-slate-100 flex flex-col items-center justify-center hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300"
            >
              {/* Default Avatar Placeholder without white border */}
              <div className="w-[88px] h-[88px] rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-slate-100 text-slate-400 mb-5">
                <svg
                  className="w-12 h-12 text-slate-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>

              {/* Member Name */}
              <h3 className="text-lg md:text-[19px] font-bold text-dark text-center tracking-tight leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
                {m.name}
              </h3>

              {/* Role */}
              <p className="text-[11px] font-bold text-[#3B9B8D] tracking-wider uppercase text-center mt-2">
                {m.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
