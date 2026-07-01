"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const env_1 = require("./env");
const pool = new pg_1.Pool({
    host: env_1.config.DB_HOST,
    user: env_1.config.DB_USER,
    password: env_1.config.DB_PASS,
    database: env_1.config.DB_NAME,
    port: env_1.config.DB_PORT,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
exports.default = pool;
