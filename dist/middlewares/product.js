"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidationEntry = exports.productValidationName = exports.productValidationId = exports.productValidation = void 0;
const conection_1 = require("../database/conection");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const productValidation = async (req, res, next) => {
    try {
        const { nome, preco, quantidade, categoria_id: id } = req.body;
        if (!id || !nome || !preco || !quantidade) {
            return res.status(400).json({ message: "Nome, preço, quantidade e ID da Categoria são obrigatórios" });
        }
        const product = await (0, conection_1.knex)("categorias").where({ id }).first();
        if (!product) {
            return res.status(404).json({ message: "Categoria do produto não encontrada" });
        }
        next();
    }
    catch (error) {
        console.error("Erro ao validar produto:", error);
        return res.status(500).json({ message: "Erro inesperado" });
    }
};
exports.productValidation = productValidation;
const productValidationId = async (req, res, next) => {
    try {
        const { id } = req.body;
        const product = await (0, conection_1.knex)("produtos").where({ id }).first();
        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        next();
    }
    catch (error) {
        console.error("Erro ao validar produto:", error);
        return res.status(500).json({ message: "Erro inesperado" });
    }
};
exports.productValidationId = productValidationId;
const productValidationName = async (req, res, next) => {
    try {
        const { nome } = req.body;
        const normalizedNome = nome.trim().toLowerCase();
        const productName = await (0, conection_1.knex)("produtos").select().whereRaw('LOWER(nome) = ?', [normalizedNome]).first();
        if (productName) {
            console.log("Produto já cadastrado");
            return res.status(409).json({ message: "Produto já cadastrado. Dê entrada de estoque ao invés de cadastrar" });
        }
        next();
    }
    catch (error) {
        console.error("Erro ao validar produto:", error);
        return res.status(500).json({ message: "Erro inesperado ao validar o produto" });
    }
};
exports.productValidationName = productValidationName;
const productValidationEntry = async (req, res, next) => {
    try {
        const { id, quantidade } = req.body;
        if (!id || !quantidade) {
            return res.status(400).json({ message: "Id e quantidade são obrigatórios" });
        }
        next();
    }
    catch (error) {
        console.error("Erro ao validar produto:", error);
        return res.status(500).json({ message: "Erro inesperado" });
    }
};
exports.productValidationEntry = productValidationEntry;
