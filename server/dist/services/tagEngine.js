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
exports.TAGEngine = void 0;
const Timetable_1 = require("../models/Timetable");
// Helper to check if two time ranges overlap (format "HH:MM:SS" or "HH:MM")
const isTimeOverlap = (start1, end1, start2, end2) => {
    const s1 = new Date(`1970-01-01T${start1}Z`).getTime();
    const e1 = new Date(`1970-01-01T${end1}Z`).getTime();
    const s2 = new Date(`1970-01-01T${start2}Z`).getTime();
    const e2 = new Date(`1970-01-01T${end2}Z`).getTime();
    // Overlap condition: start of one is before end of another, and vice versa
    return s1 < e2 && s2 < e1;
};
exports.TAGEngine = {
    generatePersonalizedTimetable: (selectedCourseIds) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Fetch all timetables
        const allLectures = yield Timetable_1.TimetableModel.getAllLectures();
        const allExams = yield Timetable_1.TimetableModel.getAllExams();
        // 2. Filter by selected courses
        const userLectures = allLectures.filter(l => selectedCourseIds.includes(l.course_id));
        const userExams = allExams.filter(e => selectedCourseIds.includes(e.course_id));
        // 3. Detect Lecture Clashes
        const lectureClashes = [];
        for (let i = 0; i < userLectures.length; i++) {
            for (let j = i + 1; j < userLectures.length; j++) {
                const l1 = userLectures[i];
                const l2 = userLectures[j];
                if (l1.day === l2.day && isTimeOverlap(l1.start_time, l1.end_time, l2.start_time, l2.end_time)) {
                    lectureClashes.push({
                        event1: l1,
                        event2: l2,
                        reason: `Time overlap on ${l1.day} between ${l1.start_time}-${l1.end_time} and ${l2.start_time}-${l2.end_time}`
                    });
                }
            }
        }
        // 4. Detect Exam Clashes
        const examClashes = [];
        for (let i = 0; i < userExams.length; i++) {
            for (let j = i + 1; j < userExams.length; j++) {
                const e1 = userExams[i];
                const e2 = userExams[j];
                // Date format from DB might include time or be ISO, slice first 10 chars (YYYY-MM-DD)
                const date1 = new Date(e1.exam_date).toISOString().slice(0, 10);
                const date2 = new Date(e2.exam_date).toISOString().slice(0, 10);
                if (date1 === date2 && isTimeOverlap(e1.start_time, e1.end_time, e2.start_time, e2.end_time)) {
                    examClashes.push({
                        event1: e1,
                        event2: e2,
                        reason: `Time overlap on ${date1} between ${e1.start_time}-${e1.end_time} and ${e2.start_time}-${e2.end_time}`
                    });
                }
            }
        }
        return {
            lectures: userLectures,
            exams: userExams,
            lectureClashes,
            examClashes
        };
    })
};
