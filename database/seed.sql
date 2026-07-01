-- PostgreSQL Seed for LASU TAG System
-- Run AFTER schema.sql

-- Insert default admin
-- Password is 'admin123' hashed with bcrypt (cost 10)
INSERT INTO admins (username, password_hash)
VALUES ('admin', '$2b$10$9H3GkIGfotNujbSTrPG5SuomaJ3CTbQLBOodQpxJFIeze/9mAKn6C')
ON CONFLICT (username) DO NOTHING;

-- Insert sample LASU Computer Science courses
INSERT INTO courses (code, title, level, type) VALUES
('CSC 111', 'Introduction to Computer Science', '100', 'Compulsory'),
('CSC 112', 'Computer Applications', '100', 'Compulsory'),
('MTH 111', 'Elementary Mathematics I', '100', 'Compulsory'),
('PHY 111', 'General Physics I', '100', 'Compulsory'),
('GNS 111', 'Use of English', '100', 'Compulsory'),

('CSC 211', 'Computer Programming I', '200', 'Compulsory'),
('CSC 212', 'Computer Hardware', '200', 'Compulsory'),
('MTH 211', 'Mathematical Methods I', '200', 'Compulsory'),
('CSC 218', 'Foundation of Sequential Programming', '200', 'Compulsory'),
('ENT 211', 'Entrepreneurship Studies I', '200', 'Compulsory'),

('CSC 311', 'Object-Oriented Programming', '300', 'Compulsory'),
('CSC 312', 'Compiler Construction I', '300', 'Compulsory'),
('CSC 313', 'Data Structures & Algorithms', '300', 'Compulsory'),
('CSC 314', 'Operating Systems I', '300', 'Compulsory'),
('CSC 315', 'Database Design & Management', '300', 'Compulsory'),
('CSC 331', 'Operations Research', '300', 'Elective'),

('CSC 411', 'Artificial Intelligence', '400', 'Compulsory'),
('CSC 412', 'Software Engineering', '400', 'Compulsory'),
('CSC 413', 'Data Communication & Networks', '400', 'Compulsory'),
('CSC 414', 'Computer Architecture', '400', 'Compulsory'),
('CSC 415', 'Project Management', '400', 'Elective')
ON CONFLICT (code) DO NOTHING;

-- Sample Lecture Timetable entries (seeded after courses are inserted)
INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '100', id, 'Monday', '08:00', '10:00', 'LT1', 'Dr. A. Bello' FROM courses WHERE code = 'CSC 111';

INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '100', id, 'Monday', '10:00', '12:00', 'LT2', 'Prof. K. Ade' FROM courses WHERE code = 'MTH 111';

INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '100', id, 'Tuesday', '08:00', '10:00', 'LT3', 'Dr. P. Okafor' FROM courses WHERE code = 'PHY 111';

INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '100', id, 'Wednesday', '10:00', '12:00', 'LT1', 'Mr. S. Ojo' FROM courses WHERE code = 'GNS 111';

INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '100', id, 'Thursday', '14:00', '16:00', 'LT2', 'Dr. A. Bello' FROM courses WHERE code = 'CSC 112';

INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '200', id, 'Monday', '08:00', '10:00', 'LT4', 'Dr. C. Emeka' FROM courses WHERE code = 'CSC 211';

INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '200', id, 'Tuesday', '10:00', '12:00', 'LT1', 'Prof. K. Ade' FROM courses WHERE code = 'MTH 211';

INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '200', id, 'Wednesday', '08:00', '10:00', 'Lab A', 'Dr. C. Emeka' FROM courses WHERE code = 'CSC 212';

INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '300', id, 'Monday', '10:00', '12:00', 'LT5', 'Prof. R. Adeyemi' FROM courses WHERE code = 'CSC 311';

INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '300', id, 'Tuesday', '08:00', '10:00', 'LT3', 'Dr. F. Nwosu' FROM courses WHERE code = 'CSC 313';

INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '300', id, 'Wednesday', '14:00', '16:00', 'LT2', 'Dr. F. Nwosu' FROM courses WHERE code = 'CSC 315';

INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '400', id, 'Monday', '08:00', '10:00', 'LT6', 'Prof. J. Olawale' FROM courses WHERE code = 'CSC 411';

INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '400', id, 'Tuesday', '10:00', '12:00', 'LT5', 'Dr. M. Ibrahim' FROM courses WHERE code = 'CSC 412';

INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
SELECT '400', id, 'Thursday', '08:00', '10:00', 'LT4', 'Dr. M. Ibrahim' FROM courses WHERE code = 'CSC 413';

-- Sample Examination Timetable entries
INSERT INTO examination_timetables (level, course_id, exam_date, start_time, end_time, venue)
SELECT '100', id, '2026-11-10', '09:00', '12:00', 'Exam Hall 1' FROM courses WHERE code = 'CSC 111';

INSERT INTO examination_timetables (level, course_id, exam_date, start_time, end_time, venue)
SELECT '100', id, '2026-11-11', '09:00', '12:00', 'Exam Hall 2' FROM courses WHERE code = 'MTH 111';

INSERT INTO examination_timetables (level, course_id, exam_date, start_time, end_time, venue)
SELECT '100', id, '2026-11-12', '09:00', '12:00', 'Exam Hall 1' FROM courses WHERE code = 'PHY 111';

INSERT INTO examination_timetables (level, course_id, exam_date, start_time, end_time, venue)
SELECT '200', id, '2026-11-10', '13:00', '16:00', 'Exam Hall 3' FROM courses WHERE code = 'CSC 211';

INSERT INTO examination_timetables (level, course_id, exam_date, start_time, end_time, venue)
SELECT '200', id, '2026-11-13', '09:00', '12:00', 'Exam Hall 2' FROM courses WHERE code = 'MTH 211';

INSERT INTO examination_timetables (level, course_id, exam_date, start_time, end_time, venue)
SELECT '300', id, '2026-11-10', '09:00', '12:00', 'Exam Hall 4' FROM courses WHERE code = 'CSC 311';

INSERT INTO examination_timetables (level, course_id, exam_date, start_time, end_time, venue)
SELECT '300', id, '2026-11-14', '09:00', '12:00', 'Exam Hall 1' FROM courses WHERE code = 'CSC 313';

INSERT INTO examination_timetables (level, course_id, exam_date, start_time, end_time, venue)
SELECT '400', id, '2026-11-11', '13:00', '16:00', 'Exam Hall 3' FROM courses WHERE code = 'CSC 411';

INSERT INTO examination_timetables (level, course_id, exam_date, start_time, end_time, venue)
SELECT '400', id, '2026-11-12', '13:00', '16:00', 'Exam Hall 4' FROM courses WHERE code = 'CSC 412';
