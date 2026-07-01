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
exports.courseController = void 0;
const Course_1 = require("../models/Course");
exports.courseController = {
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const courses = yield Course_1.CourseModel.getAll();
            res.json({ status: 'success', data: courses });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Failed to fetch courses' });
        }
    }),
    getByLevel: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const level = req.params.level;
            const courses = yield Course_1.CourseModel.getByLevel(level);
            res.json({ status: 'success', data: courses });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Failed to fetch courses by level' });
        }
    }),
    search: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { query } = req.query;
            if (!query || typeof query !== 'string') {
                return res.status(400).json({ status: 'error', message: 'Search query is required' });
            }
            const courses = yield Course_1.CourseModel.searchCourses(query);
            res.json({ status: 'success', data: courses });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Failed to search courses' });
        }
    }),
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = yield Course_1.CourseModel.create(req.body);
            res.status(201).json({ status: 'success', message: 'Course created', data: { id } });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Failed to create course' });
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.id);
            const success = yield Course_1.CourseModel.update(id, req.body);
            if (success) {
                res.json({ status: 'success', message: 'Course updated' });
            }
            else {
                res.status(404).json({ status: 'error', message: 'Course not found' });
            }
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Failed to update course' });
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.id);
            const success = yield Course_1.CourseModel.delete(id);
            if (success) {
                res.json({ status: 'success', message: 'Course deleted' });
            }
            else {
                res.status(404).json({ status: 'error', message: 'Course not found' });
            }
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Failed to delete course' });
        }
    })
};
