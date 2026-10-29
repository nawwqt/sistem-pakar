"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateProfileAction } from "../actions";
import { useState } from "react";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdSave,
  MdCheckCircle,
  MdWarning,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#4318FF] to-[#868CFF] hover:from-[#3612CC] hover:to-[#7076EE] text-white font-bold text-sm shadow-[0_10px_25px_rgba(67,24,255,0.25)] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <span className="inline-block animate-spin mr-1">⏳</span>
          Menyimpan Perubahan...
        </>
      ) : (
        <>
          <MdSave className="w-5 h-5" />
          <span>Simpan Perubahan Profil</span>
        </>
      )}
    </button>
  );
}

export default function ProfileForm({ user }) {
  const [state, formAction] = useFormState(updateProfileAction, null);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  return (
    <form action={formAction} className="space-y-6">
      {/* Alert Status */}
      {state?.error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl flex items-start gap-2.5 shadow-sm">
          <MdWarning className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <span className="font-medium">{state.error}</span>
        </div>
      )}

      {state?.success && (
        <div className="p-4 bg-[#E1FFF4] border border-[#01B574]/40 text-[#01B574] text-xs sm:text-sm rounded-2xl flex items-start gap-2.5 shadow-sm">
          <MdCheckCircle className="h-5 w-5 text-[#01B574] shrink-0 mt-0.5" />
          <span className="font-bold">{state.success}</span>
        </div>
      )}

      {/* 1. Informasi Dasar Akun */}
      <div className="rounded-[20px] bg-white p-6 md:p-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-2xl bg-[#E9E3FF] text-[#4318FF] flex items-center justify-center shrink-0">
            <MdPerson className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1B2559]">
              Informasi Akun
            </h2>
            <p className="text-xs text-[#707EAE]">
              Perbarui identitas profil Anda yang digunakan dalam sistem BacaBisa.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Nama Lengkap */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold text-[#1B2559] uppercase tracking-wider mb-2"
            >
              Nama Lengkap / Panggilan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name || ""}
                required
                placeholder="Masukkan nama lengkap"
                className="w-full rounded-xl border border-gray-200 bg-[#F4F7FE]/60 px-4 py-3 text-xs sm:text-sm text-[#1B2559] placeholder:text-[#A3AED0] focus:border-[#4318FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 transition-all shadow-none"
              />
            </div>
            <p className="text-[11px] text-[#A3AED0] mt-1.5">
              Nama ini akan tampil di sudut dashboard dan header laporan skrining.
            </p>
          </div>

          {/* Email (Read Only) */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-[#1B2559] uppercase tracking-wider mb-2"
            >
              Alamat Email (Akun Terdaftar)
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                defaultValue={user.email || ""}
                disabled
                className="w-full rounded-xl border border-gray-200 bg-gray-100/80 px-4 py-3 text-xs sm:text-sm text-[#707EAE] cursor-not-allowed shadow-none"
              />
            </div>
            <p className="text-[11px] text-[#A3AED0] mt-1.5">
              Email digunakan sebagai identifikasi login utama dan tidak dapat diubah sembarangan.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Keamanan & Ganti Kata Sandi */}
      <div className="rounded-[20px] bg-white p-6 md:p-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF7EB] text-[#FFB547] flex items-center justify-center shrink-0">
            <MdLock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1B2559]">
              Ganti Kata Sandi (Opsional)
            </h2>
            <p className="text-xs text-[#707EAE]">
              Biarkan kolom kata sandi kosong jika Anda tidak ingin mengubah kata sandi akun.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {/* Kata Sandi Lama */}
          <div>
            <label
              htmlFor="current_password"
              className="block text-xs font-bold text-[#1B2559] uppercase tracking-wider mb-2"
            >
              Kata Sandi Saat Ini
            </label>
            <div className="relative max-w-md">
              <input
                id="current_password"
                name="current_password"
                type={showCurrentPw ? "text" : "password"}
                placeholder="Masukkan kata sandi lama Anda"
                className="w-full rounded-xl border border-gray-200 bg-[#F4F7FE]/60 px-4 py-3 pr-11 text-xs sm:text-sm text-[#1B2559] placeholder:text-[#A3AED0] focus:border-[#4318FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 transition-all shadow-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPw ? (
                  <MdVisibilityOff className="w-4 h-4" />
                ) : (
                  <MdVisibility className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
            {/* Kata Sandi Baru */}
            <div>
              <label
                htmlFor="new_password"
                className="block text-xs font-bold text-[#1B2559] uppercase tracking-wider mb-2"
              >
                Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  id="new_password"
                  name="new_password"
                  type={showNewPw ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  className="w-full rounded-xl border border-gray-200 bg-[#F4F7FE]/60 px-4 py-3 pr-11 text-xs sm:text-sm text-[#1B2559] placeholder:text-[#A3AED0] focus:border-[#4318FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 transition-all shadow-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPw ? (
                    <MdVisibilityOff className="w-4 h-4" />
                  ) : (
                    <MdVisibility className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Konfirmasi Kata Sandi Baru */}
            <div>
              <label
                htmlFor="confirm_password"
                className="block text-xs font-bold text-[#1B2559] uppercase tracking-wider mb-2"
              >
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Ulangi kata sandi baru"
                className="w-full rounded-xl border border-gray-200 bg-[#F4F7FE]/60 px-4 py-3 text-xs sm:text-sm text-[#1B2559] placeholder:text-[#A3AED0] focus:border-[#4318FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 transition-all shadow-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-[#A3AED0]">
          Pastikan semua data yang dimasukkan sudah benar sebelum menekan tombol simpan.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
