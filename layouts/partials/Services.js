"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function ServiceCarousel({ images }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full max-w-[540px] mx-auto">
      {/* Image frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] shadow-xl border border-slate-100 bg-slate-50">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={img}
              alt="Ilustrasi Layanan Sistem Pakar"
              fill
              sizes="(max-width: 768px) 100vw, 540px"
              className={img.includes("cbr") ? "object-contain p-2.5 bg-white" : "object-cover"}
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrent(idx)}
              aria-label={`Lihat gambar ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-8 bg-primary shadow-sm"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const Services = ({ services }) => {
  if (!services || services.length === 0) return null;

  return services.map((service, index) => {
    const isOdd = index % 2 > 0;
    return (
      <section
        key={`service-${index}`}
        className={`section py-16 md:py-20 ${isOdd ? "bg-theme-light" : "bg-white"}`}
      >
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 lg:gap-14">
            {/* Carousel / Image Side */}
            <div
              className={`w-full min-w-0 ${
                !isOdd ? "md:order-2" : "md:order-1"
              }`}
            >
              <ServiceCarousel images={service.images} />
            </div>

            {/* Content Side */}
            <div
              className={`w-full min-w-0 ${
                !isOdd ? "md:order-1" : "md:order-2"
              }`}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 leading-[1.3] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {service?.title}
              </h2>
              <div
                className="mt-5 text-slate-600 text-[15px] sm:text-base leading-[1.8] text-justify font-['Plus_Jakarta_Sans',sans-serif]"
                dangerouslySetInnerHTML={{ __html: service?.content }}
              />
              {service?.button?.enable && (
                <div className="mt-7">
                  <Link
                    href={service?.button?.link || "#"}
                    className="inline-flex items-center gap-2 font-bold text-primary hover:text-sky-700 transition group font-['Plus_Jakarta_Sans',sans-serif] text-sm sm:text-base"
                  >
                    <span>{service?.button?.label}</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  });
};

export default Services;
