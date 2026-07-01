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
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = __importDefault(require("./config/db"));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Test DB Connection
        const client = yield db_1.default.connect();
        client.release();
        console.log('✅ PostgreSQL database connected successfully.');
        app_1.default.listen(env_1.config.PORT, () => {
            console.log(`🚀 Server running on http://localhost:${env_1.config.PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to connect to the database:', error);
        process.exit(1);
    }
});
startServer();
