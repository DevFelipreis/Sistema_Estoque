"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.loginAdmin = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const conection_1 = require("../database/conection");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loginUser = async (req, res) => {
    try {
        const { username, senha } = req.body;
        if (!username || !senha) {
            return res.status(400).json({ message: "Credenciais ausentes" });
        }
        const user = await (0, conection_1.knex)("usuarios").where({ username }).first();
        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }
        const pass = await bcrypt_1.default.compare(senha, user.senha);
        if (!pass) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }
        const { id, nome: nome, username: apelido } = user;
        const token = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        return res.status(200).json({
            usuario: {
                id,
                nome,
                apelido
            },
            token,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Erro inesperado" });
    }
};
exports.loginUser = loginUser;
const loginAdmin = async (req, res) => {
    try {
        const { username, senha } = req.body;
        if (!username || !senha) {
            return res.status(400).json({ message: "Credenciais ausentes" });
        }
        const user = await (0, conection_1.knex)("admin").where({ username }).first();
        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }
        const pass = await bcrypt_1.default.compare(senha, user.senha);
        if (!pass) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }
        const { id, nome: nome, username: apelido } = user;
        const token = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        return res.status(200).json({
            usuario: {
                id,
                nome,
                apelido
            },
            token,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Erro inesperado" });
    }
};
exports.loginAdmin = loginAdmin;
const getUser = async (req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            const oneUser = await (0, conection_1.knex)("usuarios").where({ id }).first();
            if (!oneUser) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }
            const { id: userId, nome: nome, username: apelido } = oneUser;
            return res.status(200).json({ id: userId, nome: nome, username: apelido });
        }
        else {
            const allUsers = await (0, conection_1.knex)("usuarios").select();
            return res.status(200).json(allUsers.map(user => ({
                id: user.id,
                nome: user.nome,
                username: user.username,
            })));
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Erro inesperado" });
    }
};
exports.getUser = getUser;
const createUser = async (req, res) => {
    try {
        const { nome, username, senha } = req.body;
        const pass = await bcrypt_1.default.hash(senha, 10);
        const newUser = await (0, conection_1.knex)("usuarios").insert({
            nome: nome.toLowerCase(),
            username: username.toLowerCase().toString(),
            senha: pass,
        }).returning("*");
        const { id, nome: nomeCompleto, username: apelido } = newUser[0];
        res.status(201).json({ id, nome: nomeCompleto, username: apelido });
    }
    catch (error) {
        res.status(500).json({ message: "Erro inesperado" });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id, nome, username, senha } = req.body;
        const pass = await bcrypt_1.default.hash(senha, 10);
        const newUser = await (0, conection_1.knex)("usuarios").where({ id }).update({
            id: id.Usuario,
            nome: nome.toLowerCase(),
            username: username.toLowerCase().toString(),
            senha: pass,
        }).returning("*");
        const { id: userId, nome: userNome, username: userUsername } = newUser[0];
        res.status(201).json({ id: userId, nome: userNome, username: userUsername });
    }
    catch (error) {
        res.status(500).json({ message: "Erro inesperado" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        const newUser = await (0, conection_1.knex)("usuarios").where({ id }).delete();
        res.status(204).json();
    }
    catch (error) {
        res.status(500).json({ message: "Erro inesperado" });
    }
};
exports.deleteUser = deleteUser;
