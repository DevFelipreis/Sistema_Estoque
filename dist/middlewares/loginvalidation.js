"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = void 0;
const jwtTokenUser_1 = require("../jwt/jwtTokenUser");
const jwtHash_1 = require("../jwt/jwtHash");
const loginValidation = async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        return res.status(400).json({ message: "Usuário não autorizado" });
    }
    const token = bearerToken.split(" ")[1];
    try {
        const user = (0, jwtTokenUser_1.verify)(token, jwtHash_1.secret);
        if (!user) {
            return res.status(401).json({ message: "Token inválido ou expirado" });
        }
        req.userId = user.id;
        next();
    }
    catch (error) {
        console.error("Erro ao verificar o token:", error);
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
};
exports.loginValidation = loginValidation;
