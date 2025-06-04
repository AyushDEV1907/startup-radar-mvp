# bandit_helpers.py

import numpy as np

# 1) All possible industries (from your form):
INDUSTRIES = [
    "HealthTech", "FinTech", "EdTech", "AI/ML", "SaaS", 
    "Gaming", "CleanTech", "E-commerce", "Biotech", "Cybersecurity"
]

# 2) All possible stages (from your form):
STAGES = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"]

def build_feature_vector(startup: dict) -> list[float]:
    """
    Given a single `startup` record, build a numeric feature vector x ∈ R^d:
      - industry one-hot (10 dims)
      - stage one-hot (5 dims)
      - metrics: mrr_norm (1), burn_norm (1), fe_norm (1)

    Total d = 10 + 5 + 3 = 18.
    """
    industry = startup.get("industry", "")
    stage = startup.get("stage", "")
    metrics = startup.get("metrics", {}) or {}

    # 1) Industry one-hot (10 dims)
    industry_vec = [1.0 if industry == i else 0.0 for i in INDUSTRIES]

    # 2) Stage one-hot (5 dims)
    stage_vec = [1.0 if stage == s else 0.0 for s in STAGES]

    # 3) Normalize numeric metrics (3 dims)
    #    Example maxima: MRR→200k, BurnRate→100k, FounderExperience→10
    mrr = float(metrics.get("mrr", 0.0))
    burn = float(metrics.get("burn_rate", 0.0))
    fe = float(metrics.get("founder_experience_score", 0.0))

    mrr_norm = min(mrr / 200000.0, 1.0)
    burn_norm = min(burn / 100000.0, 1.0)
    fe_norm = min(fe / 10.0, 1.0)

    return industry_vec + stage_vec + [mrr_norm, burn_norm, fe_norm]


def identity_matrix(d: int) -> list[list[float]]:
    """
    Return a d×d identity matrix as nested lists.
    """
    return [[1.0 if i == j else 0.0 for j in range(d)] for i in range(d)]


def zero_vector(d: int) -> list[float]:
    """
    Return a zero vector of length d.
    """
    return [0.0 for _ in range(d)]


def matrix_inverse(matrix: list[list[float]]) -> list[list[float]]:
    """
    Compute inverse of a square matrix (list of lists) using numpy.
    Returns a list of lists.
    """
    arr = np.array(matrix, dtype=float)
    inv = np.linalg.inv(arr)
    return inv.tolist()


def matrix_vector_mult(matrix: list[list[float]], vector: list[float]) -> list[float]:
    """
    Multiply a d×d matrix by a length-d vector.
    Returns a length-d list.
    """
    return [
        sum(matrix[i][j] * vector[j] for j in range(len(vector)))
        for i in range(len(matrix))
    ]


def vector_dot(u: list[float], v: list[float]) -> float:
    """
    Dot product of two vectors of equal length.
    """
    return sum(ui * vi for ui, vi in zip(u, v))


def add_outer_product(A: list[list[float]], x: list[float]) -> list[list[float]]:
    """
    Compute A + x x^T.
    A is a d×d matrix, x is a length-d vector.
    Returns a new d×d matrix.
    """
    d = len(x)
    return [
        [A[i][j] + x[i] * x[j] for j in range(d)]
        for i in range(d)
    ]


def add_vector(a: list[float], b: list[float]) -> list[float]:
    """
    Return elementwise sum of two length-d vectors a and b.
    """
    return [ai + bi for ai, bi in zip(a, b)]


def ucb_score(A: list[list[float]], b: list[float], x: list[float], alpha: float = 1.0) -> float:
    """
    Given:
      - A: current covariance matrix (d×d)
      - b: current reward vector (length d)
      - x: feature vector of a candidate (length d)
      - alpha: exploration parameter

    Compute LinUCB score: θ = A^{-1} b, then
      p = θ^T x + alpha * sqrt(x^T A^{-1} x)

    Returns a scalar score.
    """
    A_inv = matrix_inverse(A)
    theta = matrix_vector_mult(A_inv, b)
    mean = vector_dot(theta, x)
    xAinv = matrix_vector_mult(A_inv, x)
    uncertainty = (vector_dot(xAinv, x)) ** 0.5
    return mean + alpha * uncertainty
