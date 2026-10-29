"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const TOPICS = [
  "Skrining 7 Gejala Klinis",
  "Tingkat Keparahan Ringan",
  "Tingkat Keparahan Sedang",
  "Analisis Similarity CBR",
  "Tingkat Keparahan Berat",
  "Rekomendasi Multisensori",
  "Siklus Retain Kasus Baru",
];

const ITEM_HEIGHT = 48; // Height in px for each line row
const CENTER_ROW = 3;   // The stationary arrow sits at index 3 (middle row)
const TARGET_Y = CENTER_ROW * ITEM_HEIGHT; // 144px

const HomeBanner = () => {
  const [activeIndex, setActiveIndex] = useState(3); // Start with 'Analisis Similarity CBR'
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll the text vertically through the stationary arrow
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TOPICS.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      id="home-hero"
      className="relative overflow-hidden bg-[#eef6fc] -mt-[85px] pt-[100px] pb-12 lg:pt-[108px] lg:pb-16 min-h-[520px] lg:min-h-[580px] flex items-center"
    >
      {/* Background: Illustration / Photograph */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center z-0"
        style={{
          backgroundImage: "url('/images/magnific-hero-bg.png')",
        }}
      />

      {/* Main Content Container */}
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Proportional Headline & Description */}
          <div className="lg:col-span-6 xl:col-span-6 text-left max-w-[540px]">
            {/* Announcement Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-4 shadow-sm font-['Plus_Jakarta_Sans',sans-serif] tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Sistem Pakar</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[42px] font-extrabold tracking-tight text-slate-900 leading-[1.25] mb-5 font-['Plus_Jakarta_Sans',sans-serif]">
              Skrining Awal Tingkat Keparahan{" "}
              <span className="text-primary">Disleksia</span> pada Anak Usia Sekolah Dasar
            </h1>

            {/* Subtitle */}
            <p className="text-[15px] sm:text-base text-slate-600 font-normal leading-[1.8] mb-8 font-['Plus_Jakarta_Sans',sans-serif]">
              Aplikasi Sistem Pakar berbasis{" "}
              <strong className="text-slate-900 font-semibold">
                Case-Based Reasoning (CBR)
              </strong>{" "}
              untuk membantu orang tua, guru, dan terapis mendeteksi disleksia
              lebih dini guna penanganan yang tepat dan ramah anak.
            </p>

            {/* CTA Buttons - Side by Side (Sejejer) */}
            <div className="flex items-center gap-3 sm:gap-3.5">
              <Link
                href="/diagnosis"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm sm:text-base font-bold text-white shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex-shrink-0 font-['Plus_Jakarta_Sans',sans-serif]"
              >
                <span>Mulai</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="/petunjuk"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/95 px-5 sm:px-6 py-3 text-sm sm:text-base font-bold text-dark shadow-sm hover:bg-white hover:border-slate-400 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex-shrink-0 font-['Plus_Jakarta_Sans',sans-serif]"
              >
                <span>Pelajari Alur</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Clear zone reserved for illustration so children remain unobstructed */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-6 pointer-events-none min-h-[380px]" />

        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
