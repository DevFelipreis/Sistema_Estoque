"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.verify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
const verify = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verify = verify;
const loginValidation = async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        return res.status(400).json({ mensagem: "O token deve ser informado corretamente" });
    }
    const token = bearerToken.split(" ")[1];
    try {
        const user = (0, exports.verify)(token, secret);
        if (!user) {
            return res.status(401).json({ mensagem: "Token inválido ou expirado" });
        }
        req.userId = user.id;
        next();
    }
    catch (error) {
        console.error("Erro ao verificar o token:", error);
        return res.status(401).json({ mensagem: "Token inválido ou expirado" });
    }
};
exports.loginValidation = loginValidation;
