import pool from '../config/db';

export interface Course {
  id: number;
  code: string;
  title: string;
  level: string;
  type: string;
  created_at: string;
}

export const CourseModel = {
  getAll: async (): Promise<Course[]> => {
    const result = await pool.query(
      'SELECT * FROM courses ORDER BY level ASC, code ASC'
    );
    return result.rows as Course[];
  },

  getByLevel: async (level: string): Promise<Course[]> => {
    const result = await pool.query(
      'SELECT * FROM courses WHERE level = $1 ORDER BY code ASC',
      [level]
    );
    return result.rows as Course[];
  },

  searchCourses: async (query: string): Promise<Course[]> => {
    const searchPattern = `%${query}%`;
    const result = await pool.query(
      'SELECT * FROM courses WHERE code ILIKE $1 OR title ILIKE $2 ORDER BY code ASC',
      [searchPattern, searchPattern]
    );
    return result.rows as Course[];
  },

  create: async (course: Omit<Course, 'id' | 'created_at'>): Promise<number> => {
    const result = await pool.query(
      'INSERT INTO courses (code, title, level, type) VALUES ($1, $2, $3, $4) RETURNING id',
      [course.code, course.title, course.level, course.type]
    );
    return result.rows[0].id;
  },

  update: async (id: number, course: Partial<Course>): Promise<boolean> => {
    const result = await pool.query(
      'UPDATE courses SET code = $1, title = $2, level = $3, type = $4 WHERE id = $5',
      [course.code, course.title, course.level, course.type, id]
    );
    return (result.rowCount ?? 0) > 0;
  },

  delete: async (id: number): Promise<boolean> => {
    const result = await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
};
