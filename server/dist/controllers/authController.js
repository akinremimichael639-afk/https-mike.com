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
exports.authController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = require("../models/Admin");
const env_1 = require("../config/env");
exports.authController = {
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username, password } = req.body;
            const admin = yield Admin_1.AdminModel.findByUsername(username);
            if (!admin) {
                return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
            }
            const isMatch = yield bcrypt_1.default.compare(password, admin.password_hash);
            if (!isMatch) {
                return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
            }
            const token = jsonwebtoken_1.default.sign({ id: admin.id, username: admin.username }, env_1.config.JWT_SECRET, { expiresIn: '1d' });
            res.json({
                status: 'success',
                data: {
                    token,
                    admin: { id: admin.id, username: admin.username }
                }
            });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Login failed' });
        }
    })
};
