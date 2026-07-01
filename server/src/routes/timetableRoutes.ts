import { Router } from 'express';
import { timetableController } from '../controllers/timetableController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

// Public routes for TAG System
router.get('/lecture', timetableController.getAllLectures);
router.get('/exam', timetableController.getAllExams);
router.post('/generate', timetableController.generateTAG);
router.post('/download-pdf', timetableController.downloadTAGPDF);

// Admin routes for managing timetables
router.post('/lecture', requireAuth, timetableController.addLecture);
router.delete('/lecture/:id', requireAuth, timetableController.deleteLecture);
router.post('/exam', requireAuth, timetableController.addExam);
router.delete('/exam/:id', requireAuth, timetableController.deleteExam);

export default router;
