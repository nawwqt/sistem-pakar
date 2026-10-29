"use client";

import Logo from "@components/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const effectivePath = pathname || (typeof window !== "undefined" ? window.location.pathname : "");
  const isHome = effectivePath === "/";
  const isAuthPage = effectivePath === "/login" || effectivePath === "/daftar";
  const isDashboardPage =
    effectivePath.startsWith("/dashboard") ||
    effectivePath.startsWith("/admin") ||
    effectivePath.startsWith("/diagnosis") ||
    effectivePath.startsWith("/riwayat") ||
    effectivePath.startsWith("/profil") ||
    effectivePath === "/menu";

  useEffect(() => {
    if (isAuthPage || isDashboardPage) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAuthPage, isDashboardPage]);

  useEffect(() => {
    if (isAuthPage || isDashboardPage) return;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, [pathname, isAuthPage, isDashboardPage]);

  if (isAuthPage || isDashboardPage) return null;

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {}
    setUser(null);
    window.location.href = "/login";
  };

  const navItems = [
    { name: "Beranda", url: "/" },
    ...(user && user.role !== "admin" ? [{ name: "Dashboard", url: "/dashboard" }] : []),
    ...(user && user.role === "admin" ? [{ name: "Dashboard Admin", url: "/admin" }] : []),
    ...(user ? [{ name: "Riwayat", url: "/riwayat" }] : []),
    { name: "Petunjuk", url: "/petunjuk" },
    { name: "Objek Penelitian", url: "/objek-penelitian" },
    { name: "Pengembang", url: "/pengembang" },
  ];

  return (
    <header
      className={`header sticky top-0 z-50 py-3 md:py-3.5 transition-all duration-300 ease-in-out text-dark ${
        isHome && !scrolled
          ? "bg-transparent border-b border-transparent"
          : "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-md"
      }`}
    >
      <nav className="navbar container">
        {/* logo */}
        <div className="order-0">
          <Logo isWhite={false} />
        </div>

        {/* navbar toggler */}
        <button
          id="show-button"
          aria-label="Toggle Navigation"
          className="order-2 flex cursor-pointer items-center md:order-1 md:hidden transition-colors duration-300 ease-in-out text-dark fill-dark"
          onClick={() => setNavOpen(!navOpen)}
        >
          {navOpen ? (
            <svg className="h-6 fill-current" viewBox="0 0 20 20">
              <title>Menu Open</title>
              <polygon
                points="11 9 22 9 22 11 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2"
                transform="rotate(45 10 10)"
              />
            </svg>
          ) : (
            <svg className="h-6 fill-current" viewBox="0 0 20 20">
              <title>Menu Close</title>
              <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z" />
            </svg>
          )}
        </button>

        {/* Menu */}
        <div
          id="nav-menu"
          className={`order-3 md:order-1 ${
            navOpen ? "max-h-[1000px]" : "max-h-0"
          }`}
        >
          <ul className="navbar-nav block w-full md:flex md:w-auto lg:space-x-2">
            {navItems.map((item, i) => {
              const isActive = pathname === item.url;
              return (
                <li className="nav-item" key={`menu-${i}`}>
                  <Link
                    href={item.url}
                    onClick={() => setNavOpen(false)}
                    className={`block py-2 px-3 font-primary text-base font-bold rounded-md transition-colors duration-300 ease-in-out ${
                      isActive
                        ? "text-primary font-extrabold"
                        : "text-dark hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
            <li className="md:hidden mt-3">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="btn btn-primary z-0 py-[14px] w-full text-center"
                >
                  Keluar
                </button>
              ) : (
                <Link
                  className="btn btn-primary z-0 py-[14px] block text-center"
                  href="/login"
                  onClick={() => setNavOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </li>
          </ul>
        </div>

        {/* Desktop Single CTA Button (Original BigSpring layout) */}
        <div className="d-flex order-1 ml-auto hidden min-w-[180px] items-center justify-end md:order-2 md:ml-0 md:flex">
          {user ? (
            <button
              onClick={handleLogout}
              className="btn btn-primary z-0 py-[12px] px-7"
            >
              Keluar
            </button>
          ) : (
            <Link
              className="btn btn-primary z-0 py-[12px] px-7 shadow-lg"
              href="/login"
            >
              Get Started
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
