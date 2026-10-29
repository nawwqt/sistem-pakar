"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitDiagnosisAction } from "../actions";
import { useState } from "react";
import {
  MdCheckCircle,
  MdWarning,
  MdArrowForward,
  MdDoneAll,
  MdRestartAlt,
} from "react-icons/md";

function SubmitButton({ selectedCount }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || selectedCount === 0;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all ${
        isDisabled
          ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          : "bg-gradient-to-r from-[#4318FF] to-[#868CFF] hover:from-[#3612CC] hover:to-[#7076EE] text-white shadow-[0_10px_25px_rgba(67,24,255,0.25)] active:scale-[0.98]"
      }`}
    >
      {pending ? (
        <>
          <span className="inline-block animate-spin mr-1">⏳</span>
          Memproses CBR...
        </>
      ) : (
        <>
          <span>Mulai Analisis Kasus ({selectedCount} Gejala Dipilih)</span>
          <MdArrowForward className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

export default function DiagnosisForm({ symptoms }) {
  const [state, formAction] = useFormState(submitDiagnosisAction, null);
  const [selected, setSelected] = useState([]);

  const toggleSymptom = (code) => {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const selectAll = () => {
    setSelected(symptoms.map((s) => s.code));
  };

  const clearAll = () => {
    setSelected([]);
  };

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl flex items-start gap-2.5 shadow-sm">
          <MdWarning className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <span className="font-medium">{state.error}</span>
        </div>
      )}

      {/* 1. Data Anak (Subjek Pengamatan) */}
      <div className="rounded-[20px] bg-white p-6 md:p-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-7 h-7 rounded-full bg-[#E9E3FF] text-[#4318FF] font-extrabold text-xs flex items-center justify-center shrink-0">
            1
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#1B2559]">
            Data Anak (Subjek Pengamatan)
          </h2>
        </div>
        <p className="text-xs text-[#707EAE] mb-5 ml-10">
          Data ini bersifat opsional untuk keperluan penamaan laporan hasil skrining. Privasi anak tetap terjaga.
        </p>

        <div className="ml-0 sm:ml-10">
          <label
            className="block text-xs font-bold text-[#1B2559] uppercase tracking-wider mb-2"
            htmlFor="child_label"
          >
            Nama Panggilan atau Inisial Anak
          </label>
          <input
            id="child_label"
            name="child_label"
            type="text"
            placeholder="Contoh: Ananda D / Siswa A (Kelas 2 SD)"
            className="w-full sm:max-w-md rounded-xl border border-gray-200 bg-[#F4F7FE]/60 px-4 py-3 text-xs sm:text-sm text-[#1B2559] placeholder:text-[#A3AED0] focus:border-[#4318FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 transition-all shadow-none"
          />
        </div>
      </div>

      {/* 2. Observasi Gejala Kesulitan */}
      <div className="rounded-[20px] bg-white p-6 md:p-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#E9E3FF] text-[#4318FF] font-extrabold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1B2559]">
                Observasi Gejala Kesulitan
              </h2>
            </div>
            <p className="text-xs text-[#707EAE] mt-1.5 ml-10">
              Centang gejala yang terlihat secara berulang pada anak saat belajar membaca atau menulis. (Pilih minimal 1).
            </p>
          </div>

          {/* Action buttons: Pilih Semua & Bersihkan */}
          <div className="flex items-center gap-2 self-start sm:self-center ml-10 sm:ml-0">
            <button
              type="button"
              onClick={selectAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#E9E3FF] text-[#4318FF] hover:bg-[#4318FF] hover:text-white transition-all shadow-2xs active:scale-95"
            >
              <MdDoneAll className="h-4 w-4" />
              <span>Pilih Semua</span>
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-[#707EAE] hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
            >
              <MdRestartAlt className="h-4 w-4" />
              <span>Bersihkan</span>
            </button>
          </div>
        </div>

        {/* Symptoms List */}
        <div className="space-y-3">
          {symptoms.map((s) => {
            const isChecked = selected.includes(s.code);
            return (
              <label
                key={s.code}
                htmlFor={`symptom-${s.code}`}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all select-none ${
                  isChecked
                    ? "bg-[#F8F9FE] border-[#4318FF] ring-2 ring-[#4318FF]/20 shadow-xs"
                    : "bg-white border-gray-200/90 hover:border-gray-300 hover:bg-[#FAFCFE]"
                }`}
              >
                <input
                  type="checkbox"
                  id={`symptom-${s.code}`}
                  name="symptoms"
                  value={s.code}
                  checked={isChecked}
                  onChange={() => toggleSymptom(s.code)}
                  className="mt-1 h-5 w-5 rounded-md border-gray-300 text-[#4318FF] focus:ring-[#4318FF] cursor-pointer accent-[#4318FF]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg transition-colors ${
                        isChecked
                          ? "bg-[#4318FF] text-white"
                          : "bg-[#F4F7FE] text-[#707EAE]"
                      }`}
                    >
                      {s.code}
                    </span>
                    <span className="font-bold text-sm text-[#1B2559]">
                      {s.name}
                    </span>
                  </div>
                  <p className="text-xs text-[#707EAE] mt-1 leading-relaxed">
                    {s.code === "G01" && "Sering bingung membedakan lambang huruf abjad dasar."}
                    {s.code === "G02" && "Tertukar huruf berorientasi cermin (misal 'buku' dibaca 'duku' atau 'p' jadi 'q')."}
                    {s.code === "G03" && "Kecepatan membaca terbata-bata dan jauh lebih lambat dibanding anak sekelas."}
                    {s.code === "G04" && "Sering salah mengeja, huruf terbolak-balik atau ada suku kata yang terlewat."}
                    {s.code === "G05" && "Mampu membunyikan kata tetapi tidak memahami inti atau alur cerita bacaan."}
                    {s.code === "G06" && "Kesulitan memindahkan ide ke tulisan atau menuliskan kata-kata sederhana."}
                    {s.code === "G07" && "Menunjukkan rasa cemas, enggan, atau mencari alasan saat disuruh membaca."}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Bottom Submission Toolbar */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex-1">
            {selected.length === 0 ? (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-medium">
                <MdWarning className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Silakan centang minimal 1 gejala untuk mengaktifkan tombol analisis.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#E1FFF4] border border-[#01B574]/30 text-[#01B574] text-xs font-bold">
                <MdCheckCircle className="h-4 w-4 text-[#01B574] shrink-0" />
                <span>
                  {selected.length} dari {symptoms.length} gejala teramati siap dianalisis CBR.
                </span>
              </div>
            )}
          </div>
          <SubmitButton selectedCount={selected.length} />
        </div>
      </div>
    </form>
  );
}
