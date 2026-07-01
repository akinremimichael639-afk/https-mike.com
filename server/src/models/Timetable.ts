import pool from '../config/db';

export interface LectureTimetable {
  id: number;
  level: string;
  course_id: number;
  day: string;
  start_time: string;
  end_time: string;
  venue: string;
  lecturer: string;
  created_at: string;

  // Joined fields
  course_code?: string;
  course_title?: string;
}

export interface ExamTimetable {
  id: number;
  level: string;
  course_id: number;
  exam_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  created_at: string;

  // Joined fields
  course_code?: string;
  course_title?: string;
}

export const TimetableModel = {
  getAllLectures: async (): Promise<LectureTimetable[]> => {
    const result = await pool.query(`
      SELECT l.*, c.code AS course_code, c.title AS course_title
      FROM lecture_timetables l
      JOIN courses c ON l.course_id = c.id
      ORDER BY l.level ASC,
        CASE l.day
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          ELSE 6
        END,
        l.start_time ASC
    `);
    return result.rows as LectureTimetable[];
  },

  getAllExams: async (): Promise<ExamTimetable[]> => {
    const result = await pool.query(`
      SELECT e.*, c.code AS course_code, c.title AS course_title
      FROM examination_timetables e
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.exam_date ASC, e.start_time ASC
    `);
    return result.rows as ExamTimetable[];
  },

  addLecture: async (
    data: Omit<LectureTimetable, 'id' | 'created_at' | 'course_code' | 'course_title'>
  ): Promise<number> => {
    const result = await pool.query(
      `INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [data.level, data.course_id, data.day, data.start_time, data.end_time, data.venue, data.lecturer]
    );
    return result.rows[0].id;
  },

  addExam: async (
    data: Omit<ExamTimetable, 'id' | 'created_at' | 'course_code' | 'course_title'>
  ): Promise<number> => {
    const result = await pool.query(
      `INSERT INTO examination_timetables (level, course_id, exam_date, start_time, end_time, venue)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [data.level, data.course_id, data.exam_date, data.start_time, data.end_time, data.venue]
    );
    return result.rows[0].id;
  },

  deleteLecture: async (id: number): Promise<boolean> => {
    const result = await pool.query('DELETE FROM lecture_timetables WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },

  deleteExam: async (id: number): Promise<boolean> => {
    const result = await pool.query('DELETE FROM examination_timetables WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
};
