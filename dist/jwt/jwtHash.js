"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secret = void 0;
exports.secret = process.env.JWT_SECRET || 'your_default_secret';
