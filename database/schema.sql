-- PostgreSQL Schema for LASU TAG System
-- Run this in your PostgreSQL client (pgAdmin, psql, etc.)

-- Create the database (run this separately if needed)
-- CREATE DATABASE lasu_tag_db;

-- Connect to the database first, then run the rest:

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    level VARCHAR(3) NOT NULL CHECK (level IN ('100', '200', '300', '400')),
    type VARCHAR(20) NOT NULL DEFAULT 'Compulsory' CHECK (type IN ('Compulsory', 'Elective')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Lecture Timetables Table
CREATE TABLE IF NOT EXISTS lecture_timetables (
    id SERIAL PRIMARY KEY,
    level VARCHAR(3) NOT NULL CHECK (level IN ('100', '200', '300', '400')),
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    day VARCHAR(10) NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue VARCHAR(100) NOT NULL,
    lecturer VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Examination Timetables Table
CREATE TABLE IF NOT EXISTS examination_timetables (
    id SERIAL PRIMARY KEY,
    level VARCHAR(3) NOT NULL CHECK (level IN ('100', '200', '300', '400')),
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lecture_day ON lecture_timetables(day);
CREATE INDEX IF NOT EXISTS idx_lecture_course ON lecture_timetables(course_id);
CREATE INDEX IF NOT EXISTS idx_exam_date ON examination_timetables(exam_date);
CREATE INDEX IF NOT EXISTS idx_exam_course ON examination_timetables(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
