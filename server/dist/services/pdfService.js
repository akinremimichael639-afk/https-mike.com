"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExamTimetablePDF = exports.generateLectureTimetablePDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const generateLectureTimetablePDF = (res, lectures) => {
    const doc = new pdfkit_1.default({ margin: 50 });
    res.setHeader('Content-disposition', 'attachment; filename="lecture_timetable.pdf"');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);
    doc.fontSize(20).text('Lagos State University', { align: 'center' });
    doc.fontSize(14).text('Personalized Lecture Timetable (TAG Model)', { align: 'center' });
    doc.moveDown(2);
    // Group by day
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    days.forEach(day => {
        const dayLectures = lectures.filter(l => l.day === day).sort((a, b) => a.start_time.localeCompare(b.start_time));
        if (dayLectures.length > 0) {
            doc.fontSize(16).text(day, { underline: true });
            doc.moveDown(0.5);
            dayLectures.forEach(l => {
                doc.fontSize(12).fillColor('#000000').text(`${l.start_time.slice(0, 5)} - ${l.end_time.slice(0, 5)} | ${l.course_code} - ${l.course_title}`);
                doc.fontSize(10).fillColor('#888888').text(`Venue: ${l.venue} | Lecturer: ${l.lecturer}`);
                doc.fillColor('#000000').moveDown(0.5);
            });
            doc.moveDown(1);
        }
    });
    doc.end();
};
exports.generateLectureTimetablePDF = generateLectureTimetablePDF;
const generateExamTimetablePDF = (res, exams) => {
    const doc = new pdfkit_1.default({ margin: 50 });
    res.setHeader('Content-disposition', 'attachment; filename="exam_timetable.pdf"');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);
    doc.fontSize(20).text('Lagos State University', { align: 'center' });
    doc.fontSize(14).text('Personalized Examination Timetable (TAG Model)', { align: 'center' });
    doc.moveDown(2);
    exams.sort((a, b) => {
        if (a.exam_date !== b.exam_date)
            return new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime();
        return a.start_time.localeCompare(b.start_time);
    });
    exams.forEach(e => {
        const dateStr = new Date(e.exam_date).toDateString();
        doc.fontSize(12).fillColor('#000000').text(`${dateStr} | ${e.start_time.slice(0, 5)} - ${e.end_time.slice(0, 5)}`);
        doc.fontSize(12).fillColor('#000000').text(`${e.course_code} - ${e.course_title}`);
        doc.fontSize(10).fillColor('#888888').text(`Venue: ${e.venue}`);
        doc.fillColor('#000000').moveDown(1);
    });
    doc.end();
};
exports.generateExamTimetablePDF = generateExamTimetablePDF;
