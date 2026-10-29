"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateSymptomWeightAction } from "../../actions";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary py-1.5 px-3 text-xs"
    >
      {pending ? "..." : "Simpan"}
    </button>
  );
}

export default function SymptomWeightRow({ symptom, idx }) {
  const [state, formAction] = useFormState(updateSymptomWeightAction, null);
  const [weight, setWeight] = useState(symptom.weight);

  return (
    <tr className="hover:bg-slate-50/80 transition text-xs">
      <td className="py-3.5 px-4 font-mono font-bold text-slate-500">#{idx + 1}</td>
      <td className="py-3.5 px-4 font-mono font-bold text-primary">{symptom.code}</td>
      <td className="py-3.5 px-4 font-bold text-dark">{symptom.name}</td>
      <td className="py-3.5 px-4">
        <form action={formAction} className="flex items-center gap-2">
          <input type="hidden" name="code" value={symptom.code} />
          <input
            type="number"
            name="weight"
            step="0.1"
            min="0.1"
            required
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-20 text-center font-mono font-bold text-xs p-1.5 rounded-lg border border-border focus:border-primary"
          />
          <SubmitButton />
        </form>
        {state?.success && (
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">
            ✓ {state.success}
          </span>
        )}
        {state?.error && (
          <span className="text-[10px] text-red-600 font-bold block mt-1">
            ⚠️ {state.error}
          </span>
        )}
      </td>
      <td className="py-3.5 px-4 text-xs text-text">
        {symptom.code === "G01" && "Mengenali huruf dasar (abjad)."}
        {symptom.code === "G02" && "Kebingungan orientasi huruf simetris."}
        {symptom.code === "G03" && "Kecepatan dan kelancaran membaca."}
        {symptom.code === "G04" && "Kerapian urutan ejaan kata."}
        {symptom.code === "G05" && "Daya serap komprehensi isi teks."}
        {symptom.code === "G06" && "Keterampilan menulis kata dasar."}
        {symptom.code === "G07" && "Respon afektif/keengganan membaca."}
      </td>
    </tr>
  );
}
