"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addCaseAction, deleteCaseAction } from "../../actions";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary py-2.5 px-6 text-xs"
    >
      {pending ? "Menyimpan Kasus..." : "+ Tambahkan Kasus"}
    </button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm("Apakah Anda yakin ingin menghapus kasus ini dari basis pengetahuan CBR?")) {
          e.preventDefault();
        }
      }}
      className="text-red-600 hover:text-red-800 font-bold text-xs p-1 rounded hover:bg-red-50 transition"
      title="Hapus Kasus"
    >
      {pending ? "..." : "🗑️ Hapus"}
    </button>
  );
}

export function AddCaseForm({ symptoms, nextCode }) {
  const [state, formAction] = useFormState(addCaseAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
          ✓ {state.success}
        </div>
      )}
      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          ⚠️ {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-dark mb-1" htmlFor="code">
            Kode Kasus
          </label>
          <input
            id="code"
            name="code"
            type="text"
            required
            defaultValue={nextCode}
            placeholder="Contoh: C21"
            className="w-full text-xs font-mono font-bold rounded-lg border border-border px-3 py-2 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-dark mb-1" htmlFor="level">
            Tingkat Keparahan
          </label>
          <select
            id="level"
            name="level"
            required
            className="w-full text-xs font-semibold rounded-lg border border-border px-3 py-2 focus:border-primary"
          >
            <option value="Ringan">Ringan</option>
            <option value="Sedang">Sedang</option>
            <option value="Berat">Berat</option>
          </select>
        </div>

        <div className="flex items-center pt-5">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-dark font-medium">
            <input
              type="checkbox"
              name="is_placeholder"
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Tandai sebagai Kasus Contoh</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-dark mb-2">
          Pilih Gejala Aktif untuk Kasus Ini:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {symptoms.map((s) => (
            <label
              key={s.code}
              className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-slate-50 cursor-pointer text-xs"
            >
              <input
                type="checkbox"
                name="symptoms"
                value={s.code}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="font-mono font-bold text-primary">{s.code}</span>
              <span className="truncate text-dark">{s.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}

export function DeleteCaseForm({ code }) {
  const [state, formAction] = useFormState(deleteCaseAction, null);

  return (
    <form action={formAction} className="inline-block">
      <input type="hidden" name="code" value={code} />
      <DeleteButton />
      {state?.error && (
        <span className="text-[10px] text-red-600 block">{state.error}</span>
      )}
    </form>
  );
}
