"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseController_1 = require("../controllers/courseController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', courseController_1.courseController.getAll);
router.get('/level/:level', courseController_1.courseController.getByLevel);
router.get('/search', courseController_1.courseController.search);
// Admin only routes
router.post('/', authMiddleware_1.requireAuth, courseController_1.courseController.create);
router.put('/:id', authMiddleware_1.requireAuth, courseController_1.courseController.update);
router.delete('/:id', authMiddleware_1.requireAuth, courseController_1.courseController.delete);
exports.default = router;
