"use client";

import Social from "@components/Social";
import config from "@config/config.json";
import menu from "@config/menu.json";
import social from "@config/social.json";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import Logo from "@components/Logo";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const effectivePath = pathname || (typeof window !== "undefined" ? window.location.pathname : "");
  const isAuthPage = effectivePath === "/login" || effectivePath === "/daftar";
  const isDashboardPage =
    effectivePath.startsWith("/dashboard") ||
    effectivePath.startsWith("/admin") ||
    effectivePath.startsWith("/diagnosis") ||
    effectivePath.startsWith("/riwayat") ||
    effectivePath.startsWith("/profil") ||
    effectivePath === "/menu";

  if (isAuthPage || isDashboardPage) return null;

  const { copyright, footer_content } = config.params;
  const { footer } = menu;
  return (
    <footer className="bg-black text-white pt-16 sm:pt-20 pb-0 font-primary">
      <div className="container">
        {/* footer menu */}
        <div className="row">
          {footer.map((col) => {
            return (
              <div className="mb-12 sm:col-6 lg:col-3" key={col.name}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5 font-primary">
                  {col.name}
                </h3>
                <ul className="space-y-3.5">
                  {col?.menu.map((item) => (
                    <li key={item.text}>
                      <Link
                        href={item.url}
                        className="text-[15px] font-bold text-white hover:underline hover:text-sky-300 transition-all inline-block leading-snug"
                      >
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {/* Brand info */}
          <div className="mb-12 sm:col-6 lg:col-3">
            <Logo isWhite={true} className="h-12 sm:h-14" />
            <p className="mt-4 text-sm text-slate-300 leading-relaxed font-primary">
              {footer_content}
            </p>
          </div>
        </div>
        {/* copyright */}
        <div className="border-t border-white/10 py-6">
          <p className="text-xs text-center text-slate-400 font-primary">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
