import { Request, Response } from 'express';
import { TimetableModel } from '../models/Timetable';
import { TAGEngine } from '../services/tagEngine';
import { generateLectureTimetablePDF, generateExamTimetablePDF } from '../services/pdfService';

export const timetableController = {
  getAllLectures: async (req: Request, res: Response) => {
    try {
      const data = await TimetableModel.getAllLectures();
      res.json({ status: 'success', data });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to fetch lecture timetables' });
    }
  },

  getAllExams: async (req: Request, res: Response) => {
    try {
      const data = await TimetableModel.getAllExams();
      res.json({ status: 'success', data });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to fetch exam timetables' });
    }
  },

  addLecture: async (req: Request, res: Response) => {
    try {
      const id = await TimetableModel.addLecture(req.body);
      res.status(201).json({ status: 'success', message: 'Lecture added', data: { id } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to add lecture timetable' });
    }
  },

  addExam: async (req: Request, res: Response) => {
    try {
      const id = await TimetableModel.addExam(req.body);
      res.status(201).json({ status: 'success', message: 'Exam added', data: { id } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to add exam timetable' });
    }
  },

  deleteLecture: async (req: Request, res: Response) => {
    try {
      const success = await TimetableModel.deleteLecture(parseInt(req.params.id as string));
      if (success) res.json({ status: 'success', message: 'Lecture deleted' });
      else res.status(404).json({ status: 'error', message: 'Not found' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to delete lecture' });
    }
  },

  deleteExam: async (req: Request, res: Response) => {
    try {
      const success = await TimetableModel.deleteExam(parseInt(req.params.id as string));
      if (success) res.json({ status: 'success', message: 'Exam deleted' });
      else res.status(404).json({ status: 'error', message: 'Not found' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to delete exam' });
    }
  },

  generateTAG: async (req: Request, res: Response) => {
    try {
      const { courses } = req.body; // Array of selected course IDs
      if (!courses || !Array.isArray(courses)) {
        return res.status(400).json({ status: 'error', message: 'Courses array required' });
      }

      const result = await TAGEngine.generatePersonalizedTimetable(courses);
      res.json({ status: 'success', data: result });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'TAG Generation failed' });
    }
  },

  downloadTAGPDF: async (req: Request, res: Response) => {
    try {
      const { courses, type } = req.body;
      if (!courses || !Array.isArray(courses) || !['lecture', 'exam'].includes(type)) {
        return res.status(400).json({ status: 'error', message: 'Invalid request' });
      }

      const result = await TAGEngine.generatePersonalizedTimetable(courses);

      if (type === 'lecture') {
        generateLectureTimetablePDF(res, result.lectures);
      } else {
        generateExamTimetablePDF(res, result.exams);
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'PDF Generation failed' });
    }
  }
};
