"use client";

import { useFormState, useFormStatus } from "react-dom";
import { reviseDiagnosisAction, retainCaseAction } from "../actions";
import { useState } from "react";
import Link from "next/link";
import { MdCheckCircle, MdEdit, MdSave, MdArrowForward } from "react-icons/md";

function ReviseButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-1.5 bg-[#FFB547] hover:bg-[#E29A26] text-slate-900 font-bold text-xs rounded-full transition shadow-xs flex items-center gap-1"
    >
      <MdSave className="text-sm" />
      <span>{pending ? "..." : "Simpan"}</span>
    </button>
  );
}

function RetainButton({ disabled }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`px-3.5 py-1.5 font-bold text-xs rounded-full transition flex items-center gap-1.5 ${
        disabled
          ? "bg-gray-100 text-[#A3AED0] cursor-not-allowed"
          : "bg-[#4318FF] hover:bg-[#3311DB] text-white shadow-[0px_4px_14px_rgba(67,24,255,0.24)] hover:scale-[1.02]"
      }`}
    >
      {pending ? (
        <span>Menyimpan...</span>
      ) : disabled ? (
        <>
          <MdCheckCircle className="text-emerald-500 text-sm" />
          <span>Tersimpan di Basis Kasus</span>
        </>
      ) : (
        <>
          <MdSave className="text-sm" />
          <span>Retain Kasus Baru</span>
        </>
      )}
    </button>
  );
}

export default function AdminDiagnosisRow({ diagnosis, idx }) {
  const [reviseState, reviseFormAction] = useFormState(reviseDiagnosisAction, null);
  const [retainState, retainFormAction] = useFormState(retainCaseAction, null);

  const [isEditing, setIsEditing] = useState(false);
  const currentLevel = diagnosis.revised_level || diagnosis.level;

  const dateStr = new Date(diagnosis.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <tr className="border-b border-gray-100/80 hover:bg-[#F4F7FE]/60 transition-colors text-xs font-dm">
      <td className="py-4 px-4 font-mono font-bold text-[#A3AED0]">
        #{idx + 1}
      </td>
      <td className="py-4 px-4 whitespace-nowrap text-[#707EAE] font-medium">
        {dateStr}
      </td>
      <td className="py-4 px-4 font-bold text-[#1B2559]">
        {diagnosis.child_label || "Anak"}
      </td>
      <td className="py-4 px-4 text-[#707EAE]">
        {diagnosis.user_name || "Pengguna"}
      </td>
      <td className="py-4 px-4">
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {diagnosis.symptoms && diagnosis.symptoms.length > 0 ? (
            diagnosis.symptoms.map((code, sIdx) => (
              <span
                key={sIdx}
                className="bg-[#F4F7FE] text-[#1B2559] px-2 py-0.5 rounded-md text-[10px] font-bold border border-gray-200/60"
              >
                {code}
              </span>
            ))
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      </td>
      <td className="py-4 px-4 text-center font-bold">
        <span className="inline-block bg-[#E9E3FF] text-[#4318FF] px-2.5 py-1 rounded-full font-bold text-xs">
          {Number(diagnosis.similarity).toFixed(1)}%
        </span>
      </td>
      <td className="py-4 px-4">
        {isEditing ? (
          <form action={reviseFormAction} className="flex flex-wrap items-center gap-1.5">
            <input type="hidden" name="id" value={diagnosis.id} />
            <select
              name="revised_level"
              defaultValue={currentLevel}
              className="text-xs py-1 px-2 rounded-lg border border-gray-300 focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF] bg-white font-medium text-[#1B2559]"
            >
              <option value="Ringan">Ringan</option>
              <option value="Sedang">Sedang</option>
              <option value="Berat">Berat</option>
            </select>
            <ReviseButton />
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-[#707EAE] hover:text-[#1B2559] px-1 font-medium"
            >
              Batal
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full font-bold text-xs inline-flex items-center gap-1 ${
                currentLevel === "Ringan"
                  ? "bg-[#E1FFF4] text-[#01B574]"
                  : currentLevel === "Sedang"
                  ? "bg-[#FFF7EB] text-[#FFB547]"
                  : "bg-[#FCE8E8] text-[#E31A1A]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  currentLevel === "Ringan"
                    ? "bg-[#01B574]"
                    : currentLevel === "Sedang"
                    ? "bg-[#FFB547]"
                    : "bg-[#E31A1A]"
                }`}
              />
              {currentLevel}
            </span>
            {diagnosis.revised_level && (
              <span className="text-[10px] bg-[#E9E3FF] text-[#4318FF] px-1.5 py-0.5 rounded font-bold">
                Revisi
              </span>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="text-[11px] text-[#4318FF] hover:text-[#3311DB] font-bold flex items-center gap-0.5 hover:underline ml-1"
              title="Revisi Tingkat Diagnosis (Pakar)"
            >
              <MdEdit className="text-xs" />
              <span>Revise</span>
            </button>
          </div>
        )}
        {reviseState?.success && (
          <div className="text-[10px] text-emerald-600 font-medium mt-1">
            ✓ {reviseState.success}
          </div>
        )}
        {reviseState?.error && (
          <div className="text-[10px] text-red-600 font-medium mt-1">
            ⚠ {reviseState.error}
          </div>
        )}
      </td>
      <td className="py-4 px-4 text-center whitespace-nowrap">
        <form action={retainFormAction} className="inline-block">
          <input type="hidden" name="id" value={diagnosis.id} />
          <RetainButton disabled={diagnosis.retained} />
        </form>
        {retainState?.success && (
          <div className="text-[10px] text-emerald-600 font-bold mt-1">
            ✓ {retainState.success}
          </div>
        )}
        {retainState?.error && (
          <div className="text-[10px] text-red-600 font-medium mt-1">
            ⚠ {retainState.error}
          </div>
        )}
      </td>
      <td className="py-4 px-4 text-center">
        <Link
          href={`/diagnosis/hasil/${diagnosis.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[#4318FF] bg-[#F4F7FE] hover:bg-[#E9E3FF] font-bold rounded-full transition"
        >
          <span>Detail</span>
          <MdArrowForward className="text-xs" />
        </Link>
      </td>
    </tr>
  );
}
