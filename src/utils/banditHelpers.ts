
// LinUCB bandit helper functions
export const INDUSTRIES = [
  "HealthTech", "FinTech", "EdTech", "AI/ML", "SaaS", 
  "Gaming", "CleanTech", "E-commerce", "Biotech", "Cybersecurity"
];

export const STAGES = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"];

export type Startup = {
  id: string;
  industry: string;
  stage: string;
  metrics: {
    mrr?: number;
    burn_rate?: number;
    founder_experience_score?: number;
  } | null;
};

export function buildFeatureVector(startup: Startup): number[] {
  const metrics = startup.metrics || {};
  
  // Industry one-hot (10 dims)
  const industryVec = INDUSTRIES.map(i => startup.industry === i ? 1 : 0);
  
  // Stage one-hot (5 dims)
  const stageVec = STAGES.map(s => startup.stage === s ? 1 : 0);
  
  // Normalize metrics (3 dims)
  const mrr = Number(metrics.mrr || 0);
  const burnRate = Number(metrics.burn_rate || 0);
  const founderExp = Number(metrics.founder_experience_score || 0);
  
  const mrrNorm = Math.min(mrr / 100000, 1); // Normalize by 100k
  const burnNorm = Math.min(burnRate / 50000, 1); // Normalize by 50k
  const expNorm = Math.min(founderExp / 10, 1); // Normalize by 10
  
  return [...industryVec, ...stageVec, mrrNorm, burnNorm, expNorm];
}

export function identityMatrix(d: number): number[][] {
  return Array.from({ length: d }, (_, i) =>
    Array.from({ length: d }, (_, j) => (i === j ? 1 : 0))
  );
}

export function zeroVector(d: number): number[] {
  return Array(d).fill(0);
}

export function matrixVectorMultiply(A: number[][], v: number[]): number[] {
  return A.map(row => row.reduce((sum, aij, j) => sum + aij * v[j], 0));
}

export function vectorDot(a: number[], b: number[]): number {
  return a.reduce((sum, ai, i) => sum + ai * b[i], 0);
}

export function addOuterProduct(A: number[][], x: number[]): number[][] {
  const d = x.length;
  return A.map((row, i) =>
    row.map((val, j) => val + x[i] * x[j])
  );
}

export function addVectors(a: number[], b: number[]): number[] {
  return a.map((ai, i) => ai + b[i]);
}

// Simple matrix inversion using Gauss-Jordan elimination
export function inverseMatrix(matrix: number[][]): number[][] {
  const n = matrix.length;
  const augmented = matrix.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => i === j ? 1 : 0)
  ]);

  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    // Make diagonal element 1
    const pivot = augmented[i][i];
    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= pivot;
    }

    // Eliminate column
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = augmented[k][i];
        for (let j = 0; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
  }

  return augmented.map(row => row.slice(n));
}
