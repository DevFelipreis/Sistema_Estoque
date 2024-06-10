import { NextFunction, Request, Response } from "express";
import { knex } from "../database/conection";
import { Categoria, Produto } from "../types";
import dotenv from "dotenv";
dotenv.config();

export const productValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nome, preco, quantidade, categoria_id: id } = req.body;

        if (!id || !nome || !preco || !quantidade) {
            return res.status(400).json({ message: "Nome, preço, quantidade e ID da Categoria são obrigatórios" });
        };

        const product = await knex<Categoria>("categorias").where({ id }).first();
        if (!product) {
            return res.status(404).json({ message: "Categoria do produto não encontrada" });
        };

        next();

    } catch (error) {
        return res.status(500).json({ message: "Erro inesperado" });
    };
};

export const productValidationId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.body;
        const product = await knex<Produto>("produtos").where({ id }).first();

        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado" });
        };

        next();

    } catch (error) {
        return res.status(500).json({ message: "Erro inesperado" });
    };
};

export const productValidationName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nome } = req.body;
        const normalizedNome = nome.trim().toLowerCase();
        const productName = await knex<Produto>("produtos").select().whereRaw('LOWER(nome) = ?', [normalizedNome]).first();

        if (productName) {
            return res.status(409).json({ message: "Produto já cadastrado. Dê entrada de estoque ao invés de cadastrar" });
        };

        next();

    } catch (error) {
        return res.status(500).json({ message: "Erro inesperado ao validar o produto" });
    };
};
