import assert from "node:assert/strict";
import { calculateSimilarity, retrieveTopCases, generateNextCaseCode } from "../lib/cbr.js";

const sampleSymptoms = [
  { code: "G01", name: "Sulit mengenali huruf", weight: 3 },
  { code: "G02", name: "Tertukar huruf (b–d, p–q)", weight: 2 },
  { code: "G03", name: "Lambat membaca", weight: 2 },
  { code: "G04", name: "Salah eja", weight: 2 },
  { code: "G05", name: "Sulit memahami bacaan", weight: 3 },
  { code: "G06", name: "Sulit menulis kata sederhana", weight: 3 },
  { code: "G07", name: "Menghindari kegiatan membaca", weight: 1 },
];

const sampleCases = [
  // Ringan placeholder
  { code: "C01", symptoms: ["G02"], level: "Ringan", is_placeholder: true },
  { code: "C02", symptoms: ["G04"], level: "Ringan", is_placeholder: true },
  { code: "C03", symptoms: ["G03"], level: "Ringan", is_placeholder: true },
  { code: "C04", symptoms: ["G02", "G04"], level: "Ringan", is_placeholder: true },
  { code: "C05", symptoms: ["G02", "G03"], level: "Ringan", is_placeholder: true },
  { code: "C06", symptoms: ["G04", "G05"], level: "Ringan", is_placeholder: true },
  { code: "C07", symptoms: ["G06"], level: "Ringan", is_placeholder: true },

  // Sedang
  { code: "C08", symptoms: ["G02", "G03", "G04"], level: "Sedang", is_placeholder: false },
  { code: "C09", symptoms: ["G03", "G04", "G05"], level: "Sedang", is_placeholder: false },
  { code: "C10", symptoms: ["G02", "G04", "G06"], level: "Sedang", is_placeholder: false },
  { code: "C11", symptoms: ["G02", "G03", "G04", "G05"], level: "Sedang", is_placeholder: false },
  { code: "C12", symptoms: ["G03", "G04", "G06", "G07"], level: "Sedang", is_placeholder: false },
  { code: "C13", symptoms: ["G01", "G02", "G04"], level: "Sedang", is_placeholder: false },
  { code: "C14", symptoms: ["G03", "G05", "G06", "G07"], level: "Sedang", is_placeholder: false },

  // Berat
  { code: "C15", symptoms: ["G01", "G02", "G03", "G04", "G06"], level: "Berat", is_placeholder: false },
  { code: "C16", symptoms: ["G01", "G02", "G03", "G04", "G05", "G06"], level: "Berat", is_placeholder: false },
  { code: "C17", symptoms: ["G01", "G03", "G04", "G05", "G06", "G07"], level: "Berat", is_placeholder: false },
  { code: "C18", symptoms: ["G01", "G02", "G03", "G05", "G06", "G07"], level: "Berat", is_placeholder: false },
  { code: "C19", symptoms: ["G01", "G02", "G03", "G04", "G05", "G06", "G07"], level: "Berat", is_placeholder: false },
  { code: "C20", symptoms: ["G01", "G02", "G04", "G05", "G06", "G07"], level: "Berat", is_placeholder: false },
];

console.log("Running CBR tests...");

// Test 1: {G02, G03, G04} -> C08 Sedang 100%
const res1 = retrieveTopCases(["G02", "G03", "G04"], sampleCases, sampleSymptoms, 3);
assert.equal(res1[0].caseCode, "C08");
assert.equal(res1[0].level, "Sedang");
assert.equal(res1[0].similarityPercentage, 100);
console.log("✓ Test 1 Passed: {G02, G03, G04} -> C08 Sedang 100%");

// Test 2: all G01-G07 -> C19 Berat 100%
const res2 = retrieveTopCases(
  ["G01", "G02", "G03", "G04", "G05", "G06", "G07"],
  sampleCases,
  sampleSymptoms,
  3
);
assert.equal(res2[0].caseCode, "C19");
assert.equal(res2[0].level, "Berat");
assert.equal(res2[0].similarityPercentage, 100);
console.log("✓ Test 2 Passed: all G01-G07 -> C19 Berat 100%");

// Test 3: {G02} -> C01 Ringan 100%
const res3 = retrieveTopCases(["G02"], sampleCases, sampleSymptoms, 3);
assert.equal(res3[0].caseCode, "C01");
assert.equal(res3[0].level, "Ringan");
assert.equal(res3[0].similarityPercentage, 100);
console.log("✓ Test 3 Passed: {G02} -> C01 Ringan 100%");

// Test 4: generateNextCaseCode
const next1 = generateNextCaseCode(sampleCases.map(c => c.code));
assert.equal(next1, "C21");
console.log("✓ Test 4 Passed: next code is C21");

console.log("All CBR tests passed successfully!");
