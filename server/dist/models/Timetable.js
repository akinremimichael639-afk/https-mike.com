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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimetableModel = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.TimetableModel = {
    getAllLectures: () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_1.default.query(`
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
        return result.rows;
    }),
    getAllExams: () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_1.default.query(`
      SELECT e.*, c.code AS course_code, c.title AS course_title
      FROM examination_timetables e
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.exam_date ASC, e.start_time ASC
    `);
        return result.rows;
    }),
    addLecture: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_1.default.query(`INSERT INTO lecture_timetables (level, course_id, day, start_time, end_time, venue, lecturer)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [data.level, data.course_id, data.day, data.start_time, data.end_time, data.venue, data.lecturer]);
        return result.rows[0].id;
    }),
    addExam: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_1.default.query(`INSERT INTO examination_timetables (level, course_id, exam_date, start_time, end_time, venue)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`, [data.level, data.course_id, data.exam_date, data.start_time, data.end_time, data.venue]);
        return result.rows[0].id;
    }),
    deleteLecture: (id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield db_1.default.query('DELETE FROM lecture_timetables WHERE id = $1', [id]);
        return ((_a = result.rowCount) !== null && _a !== void 0 ? _a : 0) > 0;
    }),
    deleteExam: (id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield db_1.default.query('DELETE FROM examination_timetables WHERE id = $1', [id]);
        return ((_a = result.rowCount) !== null && _a !== void 0 ? _a : 0) > 0;
    })
};
