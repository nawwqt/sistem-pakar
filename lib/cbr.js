/**
 * Case-Based Reasoning (CBR) for Dyslexia Severity Screening
 * Formula: Sim = Σ(w * s) / Σ w across all 7 symptoms
 * s = 1 if status is identical (both present or both absent), else 0
 */

export function calculateSimilarity(inputSymptoms = [], caseItem, allSymptoms = []) {
  const inputSet = new Set(inputSymptoms);
  const caseSet = new Set(caseItem.symptoms || []);

  let sumNumerator = 0;
  let sumDenominator = 0;
  let commonActiveCount = 0;

  for (const symptom of allSymptoms) {
    const weight = Number(symptom.weight) || 1;
    sumDenominator += weight;

    const inputHas = inputSet.has(symptom.code);
    const caseHas = caseSet.has(symptom.code);

    if (inputHas === caseHas) {
      sumNumerator += weight;
      if (inputHas && caseHas) {
        commonActiveCount += 1;
      }
    }
  }

  const similarityScore = sumDenominator > 0 ? sumNumerator / sumDenominator : 0;
  const similarityPercentage = Math.round(similarityScore * 10000) / 100; // e.g. 100, 87.5

  return {
    caseCode: caseItem.code,
    level: caseItem.level,
    symptoms: caseItem.symptoms || [],
    isPlaceholder: Boolean(caseItem.is_placeholder),
    similarity: similarityScore,
    similarityPercentage,
    commonActiveCount,
  };
}

export function retrieveTopCases(inputSymptoms = [], caseList = [], allSymptoms = [], topN = 3) {
  const scoredCases = caseList.map((caseItem) =>
    calculateSimilarity(inputSymptoms, caseItem, allSymptoms)
  );

  // Sorting:
  // 1. similarityScore descending
  // 2. commonActiveCount descending
  // 3. caseCode ascending (e.g. C01, C02, ...)
  scoredCases.sort((a, b) => {
    if (Math.abs(b.similarity - a.similarity) > 0.00001) {
      return b.similarity - a.similarity;
    }
    if (b.commonActiveCount !== a.commonActiveCount) {
      return b.commonActiveCount - a.commonActiveCount;
    }
    return a.caseCode.localeCompare(b.caseCode, undefined, { numeric: true });
  });

  return scoredCases.slice(0, topN);
}

export function generateNextCaseCode(existingCodes = []) {
  let maxNumber = 20;
  for (const code of existingCodes) {
    const match = code && code.match(/^C(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }
  }
  const nextNum = maxNumber + 1;
  return `C${nextNum < 10 ? "0" + nextNum : nextNum}`;
}
