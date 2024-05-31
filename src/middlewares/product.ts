import { Request, Response } from "express";
import { knex } from "../database/conection";
import { Categoria, Produto } from "../types";
import dotenv from "dotenv";
dotenv.config();

export const productValidation = async (req: Request, res: Response, next: any) => {
    try {
        const { nome, preco, categoria_id: id } = req.body;

        if (!id || !nome || !preco) {
            return res.status(400).json({ mensagem: "Nome, preço e ID da Categoria são obrigatórios" });
        }

        const product = await knex<Categoria>("categorias").where({ id }).first();
        if (!product) {
            return res.status(404).json({ mensagem: "Categoria do produto não encontrada" });
        }

        next();
    } catch (error) {
        console.error("Erro ao validar produto:", error);
        return res.status(500).json({ mensagem: "Erro inesperado" });
    }
};

export const productValidationId = async (req: Request, res: Response, next: any) => {
    try {
        const { id } = req.body;
        const product = await knex<Produto>("produtos").where({ id }).first();
        if (!product) {
            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }
        next();
    } catch (error) {
        console.error("Erro ao validar produto:", error);
        return res.status(500).json({ mensagem: "Erro inesperado" });
    }
};