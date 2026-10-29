"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  MdDashboard,
  MdPlayArrow,
  MdHistory,
  MdMenuBook,
  MdScience,
  MdGroup,
  MdAdminPanelSettings,
  MdFolder,
  MdScale,
  MdLogout,
  MdMenu,
  MdClose,
  MdSearch,
  MdNotificationsNone,
  MdArrowBack,
  MdPerson,
} from "react-icons/md";
import { IoSparkles } from "react-icons/io5";

export default function HorizonDashboardLayout({
  user,
  brandText = "Dashboard",
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {}
    window.location.href = "/login";
  };

  const navLinks = isAdmin
    ? [
        {
          name: "Dashboard Admin",
          href: "/admin",
          icon: <MdDashboard className="w-5 h-5" />,
          exact: true,
        },
        {
          name: "Basis Kasus (Matriks)",
          href: "/admin/kasus",
          icon: <MdFolder className="w-5 h-5" />,
        },
        {
          name: "Edit Bobot Gejala",
          href: "/admin/gejala",
          icon: <MdScale className="w-5 h-5" />,
        },
        {
          name: "Uji Diagnosis Baru",
          href: "/diagnosis",
          icon: <MdPlayArrow className="w-5 h-5" />,
        },
        {
          name: "Riwayat Semua Kasus",
          href: "/riwayat",
          icon: <MdHistory className="w-5 h-5" />,
        },
        {
          name: "Edit Profil",
          href: "/profil",
          icon: <MdPerson className="w-5 h-5" />,
        },
      ]
    : user
    ? [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: <MdDashboard className="w-5 h-5" />,
          exact: true,
        },
        {
          name: "Mulai Skrining Baru",
          href: "/diagnosis",
          icon: <MdPlayArrow className="w-5 h-5" />,
        },
        {
          name: "Riwayat Skrining Saya",
          href: "/riwayat",
          icon: <MdHistory className="w-5 h-5" />,
        },
        {
          name: "Edit Profil",
          href: "/profil",
          icon: <MdPerson className="w-5 h-5" />,
        },
      ]
    : [
        {
          name: "Mulai Skrining",
          href: "/diagnosis",
          icon: <MdPlayArrow className="w-5 h-5" />,
        },
        {
          name: "Masuk / Daftar Akun",
          href: "/login",
          icon: <MdPerson className="w-5 h-5" />,
        },
      ];

  const isLinkActive = (item) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="flex h-full min-h-screen w-full bg-[#F4F7FE] font-dm text-[#1B2559]">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* HORIZON SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[285px] flex-col justify-between bg-white px-5 py-6 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-5 border-b border-gray-100">
            <Link href="/" className="inline-flex items-center group py-0.5">
              <Image
                src="/images/logo.png"
                alt="BacaBisa"
                width={383}
                height={243}
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <MdClose className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Snippet */}
          <Link
            href="/profil"
            title="Kelola & Edit Profil"
            className="my-5 flex items-center gap-3 rounded-2xl bg-[#F4F7FE] p-3 hover:bg-[#E9E3FF]/50 transition-all group cursor-pointer"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4318FF] to-[#868CFF] text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-bold text-[#1B2559] group-hover:text-[#4318FF] transition-colors">
                {user?.name || "Tamu / Pengunjung"}
              </p>
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isAdmin
                    ? "bg-[#FCE8E8] text-[#E31A1A]"
                    : user
                    ? "bg-[#E1FFF4] text-[#01B574]"
                    : "bg-[#FFF8E6] text-[#FFB547]"
                }`}
              >
                {isAdmin ? "Administrator" : user ? "Pengguna Terdaftar" : "Belum Masuk"}
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="mt-2 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#A3AED0]">
              Menu Utama
            </div>
            {navLinks.map((item) => {
              const active = isLinkActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-bold transition-all ${
                    active
                      ? "bg-[#F4F7FE] text-[#4318FF] shadow-xs"
                      : "text-[#707EAE] hover:bg-slate-50 hover:text-[#1B2559]"
                  }`}
                >
                  <span
                    className={`${
                      active ? "text-[#4318FF]" : "text-[#A3AED0] group-hover:text-[#1B2559]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.name}</span>
                  {active && (
                    <div className="absolute right-0 top-1/2 h-7 w-1.5 -translate-y-1/2 rounded-l-full bg-[#4318FF]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-slate-100 space-y-1.5">
          {/* Auth Button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full py-2.5 px-3.5 text-xs font-bold rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all group"
            >
              <MdLogout className="text-base text-red-400 group-hover:text-red-600 transition-colors" />
              <span>Keluar Akun</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-3 w-full py-2.5 px-3.5 text-xs font-bold rounded-xl text-[#4318FF] hover:bg-[#F4F7FE] transition-all group"
            >
              <MdPerson className="text-base text-[#4318FF]" />
              <span>Masuk ke Akun</span>
            </Link>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 min-h-screen flex flex-col justify-between transition-all duration-300 lg:ml-[285px]">
        <div className="flex-1">
          {/* HORIZON FLOATING TOP NAVBAR */}
          <header className="sticky top-3 z-30 mx-3 sm:mx-6 md:mx-8 mb-5 mt-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/85 px-4 py-3 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] backdrop-blur-md border border-gray-100">
              {/* Left side: Hamburger & Title */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                  aria-label="Toggle Sidebar"
                >
                  <MdMenu className="h-6 w-6" />
                </button>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#707EAE]">
                    <span>Pages</span>
                    <span>/</span>
                    <span className="font-semibold text-[#1B2559] capitalize">
                      {brandText}
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-2xl font-extrabold capitalize text-[#1B2559] leading-tight">
                    {brandText}
                  </h1>
                </div>
              </div>

              {/* Right side: Search & User Controls Pill */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Horizon Search Box */}
                <div className="hidden sm:flex items-center gap-2.5 rounded-full bg-[#F4F7FE] px-3.5 py-1.5 text-xs font-medium text-[#1B2559] border border-gray-200/70 focus-within:ring-2 focus-within:ring-[#4318FF]/20 focus-within:border-[#4318FF]/50 transition-all">
                  <MdSearch className="h-4 w-4 text-[#A3AED0] shrink-0" />
                  <input
                    type="text"
                    placeholder="Cari fitur atau rujukan..."
                    className="bg-transparent border-none p-0 text-xs text-[#1B2559] placeholder:text-[#A3AED0] focus:ring-0 focus:outline-none w-36 lg:w-44 shadow-none leading-none"
                  />
                </div>

                {/* User Avatar Pill */}
                {user ? (
                  <Link
                    href="/profil"
                    title="Pengaturan & Edit Profil"
                    className="flex items-center gap-2.5 sm:gap-3 bg-[#F4F7FE] hover:bg-[#E9E3FF]/50 py-1.5 px-2.5 sm:px-3 rounded-full border border-gray-200/70 shadow-2xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4318FF] to-[#868CFF] text-white text-xs font-extrabold shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="text-left hidden sm:block pr-1">
                        <div className="text-xs font-bold text-[#1B2559] group-hover:text-[#4318FF] transition-colors max-w-[140px] truncate">
                          {user.name}
                        </div>
                        {isAdmin && (
                          <div className="text-[10px] font-semibold text-[#4318FF]">
                            Admin CBR
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-[#4318FF] hover:bg-[#3311DB] text-white text-xs font-bold rounded-full transition shadow-sm"
                  >
                    Masuk Akun
                  </Link>
                )}
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="px-3 sm:px-6 md:px-8 pb-10">
            {children}
          </main>
        </div>

        {/* MINIMAL HORIZON FOOTER (WATERMARK AT BOTTOM) */}
        <footer className="px-4 sm:px-8 py-4 text-center text-xs text-[#A3AED0] border-t border-gray-100 mt-auto">
          <p>
            © {new Date().getFullYear()} <strong>BacaBisa</strong>
          </p>
        </footer>
      </div>
    </div>
  );
}
