"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const timetableController_1 = require("../controllers/timetableController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public routes for TAG System
router.get('/lecture', timetableController_1.timetableController.getAllLectures);
router.get('/exam', timetableController_1.timetableController.getAllExams);
router.post('/generate', timetableController_1.timetableController.generateTAG);
router.post('/download-pdf', timetableController_1.timetableController.downloadTAGPDF);
// Admin routes for managing timetables
router.post('/lecture', authMiddleware_1.requireAuth, timetableController_1.timetableController.addLecture);
router.delete('/lecture/:id', authMiddleware_1.requireAuth, timetableController_1.timetableController.deleteLecture);
router.post('/exam', authMiddleware_1.requireAuth, timetableController_1.timetableController.addExam);
router.delete('/exam/:id', authMiddleware_1.requireAuth, timetableController_1.timetableController.deleteExam);
exports.default = router;
