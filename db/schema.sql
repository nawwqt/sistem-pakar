-- Schema for BacaBisa Dyslexia Severity Screening System using Case-Based Reasoning (CBR)

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS symptoms (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    weight NUMERIC NOT NULL CHECK (weight > 0)
);

CREATE TABLE IF NOT EXISTS cases (
    code VARCHAR(10) PRIMARY KEY,
    symptoms TEXT[] NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('Ringan', 'Sedang', 'Berat')),
    is_placeholder BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recommendations (
    level VARCHAR(20) PRIMARY KEY CHECK (level IN ('Ringan', 'Sedang', 'Berat')),
    advice TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS diagnoses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    child_label VARCHAR(255),
    symptoms TEXT[] NOT NULL,
    best_case VARCHAR(10),
    similarity NUMERIC NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('Ringan', 'Sedang', 'Berat')),
    top_matches JSONB NOT NULL DEFAULT '[]'::jsonb,
    revised_level VARCHAR(20) CHECK (revised_level IN ('Ringan', 'Sedang', 'Berat')),
    retained BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
