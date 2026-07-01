"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timetableController = void 0;
const Timetable_1 = require("../models/Timetable");
const tagEngine_1 = require("../services/tagEngine");
const pdfService_1 = require("../services/pdfService");
exports.timetableController = {
    getAllLectures: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield Timetable_1.TimetableModel.getAllLectures();
            res.json({ status: 'success', data });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Failed to fetch lecture timetables' });
        }
    }),
    getAllExams: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield Timetable_1.TimetableModel.getAllExams();
            res.json({ status: 'success', data });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Failed to fetch exam timetables' });
        }
    }),
    addLecture: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = yield Timetable_1.TimetableModel.addLecture(req.body);
            res.status(201).json({ status: 'success', message: 'Lecture added', data: { id } });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Failed to add lecture timetable' });
        }
    }),
    addExam: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = yield Timetable_1.TimetableModel.addExam(req.body);
            res.status(201).json({ status: 'success', message: 'Exam added', data: { id } });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Failed to add exam timetable' });
        }
    }),
    deleteLecture: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const success = yield Timetable_1.TimetableModel.deleteLecture(parseInt(req.params.id));
            if (success)
                res.json({ status: 'success', message: 'Lecture deleted' });
            else
                res.status(404).json({ status: 'error', message: 'Not found' });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Failed to delete lecture' });
        }
    }),
    deleteExam: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const success = yield Timetable_1.TimetableModel.deleteExam(parseInt(req.params.id));
            if (success)
                res.json({ status: 'success', message: 'Exam deleted' });
            else
                res.status(404).json({ status: 'error', message: 'Not found' });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Failed to delete exam' });
        }
    }),
    generateTAG: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { courses } = req.body; // Array of selected course IDs
            if (!courses || !Array.isArray(courses)) {
                return res.status(400).json({ status: 'error', message: 'Courses array required' });
            }
            const result = yield tagEngine_1.TAGEngine.generatePersonalizedTimetable(courses);
            res.json({ status: 'success', data: result });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'TAG Generation failed' });
        }
    }),
    downloadTAGPDF: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { courses, type } = req.body;
            if (!courses || !Array.isArray(courses) || !['lecture', 'exam'].includes(type)) {
                return res.status(400).json({ status: 'error', message: 'Invalid request' });
            }
            const result = yield tagEngine_1.TAGEngine.generatePersonalizedTimetable(courses);
            if (type === 'lecture') {
                (0, pdfService_1.generateLectureTimetablePDF)(res, result.lectures);
            }
            else {
                (0, pdfService_1.generateExamTimetablePDF)(res, result.exams);
            }
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'PDF Generation failed' });
        }
    })
};
