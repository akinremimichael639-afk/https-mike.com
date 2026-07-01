import { Request, Response } from 'express';
import { CourseModel } from '../models/Course';

export const courseController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const courses = await CourseModel.getAll();
      res.json({ status: 'success', data: courses });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to fetch courses' });
    }
  },

  getByLevel: async (req: Request, res: Response) => {
    try {
      const level = req.params.level as string;
      const courses = await CourseModel.getByLevel(level);
      res.json({ status: 'success', data: courses });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to fetch courses by level' });
    }
  },

  search: async (req: Request, res: Response) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ status: 'error', message: 'Search query is required' });
      }
      const courses = await CourseModel.searchCourses(query);
      res.json({ status: 'success', data: courses });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to search courses' });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const id = await CourseModel.create(req.body);
      res.status(201).json({ status: 'success', message: 'Course created', data: { id } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to create course' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const success = await CourseModel.update(id, req.body);
      if (success) {
        res.json({ status: 'success', message: 'Course updated' });
      } else {
        res.status(404).json({ status: 'error', message: 'Course not found' });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to update course' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const success = await CourseModel.delete(id);
      if (success) {
        res.json({ status: 'success', message: 'Course deleted' });
      } else {
        res.status(404).json({ status: 'error', message: 'Course not found' });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to delete course' });
    }
  }
};
