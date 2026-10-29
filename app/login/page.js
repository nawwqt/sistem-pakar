"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "../actions";
import Link from "next/link";
import { useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary w-full text-center py-3 text-sm sm:text-base font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
    >
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Memverifikasi Akun...</span>
        </>
      ) : (
        <span>Masuk ke Sistem</span>
      )}
    </button>
  );
}

function LoginFormContent() {
  const [state, formAction] = useFormState(loginAction, null);
  const searchParams = useSearchParams();
  const urlError = searchParams?.get("error");
  const [showPassword, setShowPassword] = useState(false);

  const displayError = state?.error || urlError;

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Top Brand & Back to Home Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="inline-flex items-center group">
          <Image
            src="/images/logo.png"
            alt="BacaBisa"
            width={383}
            height={243}
            className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            priority
          />
        </Link>
        <Link
          href="/"
          className="text-xs sm:text-sm font-semibold text-text hover:text-primary transition flex items-center gap-1.5"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Beranda</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/70 p-7 sm:p-9">
        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-dark tracking-tight font-primary">
            Masuk ke Akun Anda
          </h1>
          <p className="text-text text-xs sm:text-sm mt-1.5">
            Sistem Pakar Skrining Disleksia (CBR)
          </p>
        </div>

        {/* Error Alert */}
        {displayError && (
          <div className="mb-5 p-3.5 bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-start gap-2.5">
            <svg className="w-5 h-5 flex-shrink-0 text-red-500 fill-current mt-0.5" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="leading-snug">{displayError}</span>
          </div>
        )}

        {/* Google Login Button */}
        <a
          href="/api/auth/google?mode=login"
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-dark text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98] active:bg-slate-100 shadow-sm transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Lanjutkan dengan Google</span>
        </a>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-3 text-xs text-text/70 uppercase tracking-wider font-medium">
            atau masuk dengan email
          </span>
        </div>

        {/* Single Unified Form (Auto-detected role from database) */}
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-dark mb-1.5" htmlFor="email">
              Alamat Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm text-dark placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-dark mb-1.5" htmlFor="password">
              Kata Sandi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Masukkan kata sandi Anda"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-11 py-2.5 text-sm text-dark placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs sm:text-sm text-text pt-5 border-t border-slate-100">
          Belum memiliki akun?{" "}
          <Link href="/daftar" className="font-bold text-primary hover:underline">
            Daftar di sini
          </Link>
        </div>
      </div>

      {/* Page bottom subtle copyright */}
      <div className="mt-8 text-center text-xs text-text/60">
        © 2026 BacaBisa
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center px-4 py-10 sm:py-16">
      <Suspense fallback={<div className="text-center text-sm text-slate-500">Memuat halaman...</div>}>
        <LoginFormContent />
      </Suspense>
    </main>
  );
}
