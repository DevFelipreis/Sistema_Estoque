"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const conection_1 = require("../database/conection");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userValidation = async (req, res, next) => {
    try {
        const { id, username, senha } = req.body;
        const user = await (0, conection_1.knex)("usuarios").where({ id }).first();
        if (!id || !username || !senha) {
            return res.status(401).json({ message: "Preencha todos os campos" });
        }
        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }
        next();
    }
    catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ message: "Erro inesperado" });
    }
};
exports.userValidation = userValidation;
