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
exports.CourseModel = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.CourseModel = {
    getAll: () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_1.default.query('SELECT * FROM courses ORDER BY level ASC, code ASC');
        return result.rows;
    }),
    getByLevel: (level) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_1.default.query('SELECT * FROM courses WHERE level = $1 ORDER BY code ASC', [level]);
        return result.rows;
    }),
    searchCourses: (query) => __awaiter(void 0, void 0, void 0, function* () {
        const searchPattern = `%${query}%`;
        const result = yield db_1.default.query('SELECT * FROM courses WHERE code ILIKE $1 OR title ILIKE $2 ORDER BY code ASC', [searchPattern, searchPattern]);
        return result.rows;
    }),
    create: (course) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_1.default.query('INSERT INTO courses (code, title, level, type) VALUES ($1, $2, $3, $4) RETURNING id', [course.code, course.title, course.level, course.type]);
        return result.rows[0].id;
    }),
    update: (id, course) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield db_1.default.query('UPDATE courses SET code = $1, title = $2, level = $3, type = $4 WHERE id = $5', [course.code, course.title, course.level, course.type, id]);
        return ((_a = result.rowCount) !== null && _a !== void 0 ? _a : 0) > 0;
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield db_1.default.query('DELETE FROM courses WHERE id = $1', [id]);
        return ((_a = result.rowCount) !== null && _a !== void 0 ? _a : 0) > 0;
    })
};
