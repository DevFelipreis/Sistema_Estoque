import { Request, Response } from "express";
import { knex } from "../database/conection";
import { Categoria, Produto } from "../types";
import dotenv from "dotenv";
dotenv.config();

export const getProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        if (id) {
            const oneProduct = await knex<Produto>("produtos")
                .join<Categoria>("categorias", "produtos.categoria_id", "categorias.id")
                .select(
                    "produtos.id",
                    "produtos.nome",
                    "produtos.preco",
                    "categorias.nome as categoria_nome"
                )
                .where("produtos.id", id)
                .first();

            if (!oneProduct) {
                return res.status(404).json({ mensagem: "Produto não encontrado" });
            }

            return res.status(200).json(oneProduct);
        } else {
            const allProducts = await knex<Produto>("produtos")
                .join<Categoria>("categorias", "produtos.categoria_id", "categorias.id")
                .select(
                    "produtos.id",
                    "produtos.nome",
                    "produtos.preco",
                    "categorias.nome as categoria_nome"
                );

            return res.status(200).json(allProducts);
        }
    } catch (error) {
        console.error("Erro ao obter produto(s):", error);
        return res.status(500).json({ mensagem: "Erro inesperado" });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { nome, preco, categoria_id, descricao } = req.body;

        const newProduct = await knex<Produto>("produtos").insert({
            nome: nome.toLowerCase(),
            preco: preco,
            categoria_id: categoria_id,
            descricao: descricao ? descricao.toLowerCase() : null,
        }).returning("*");

        const { id, nome: productNome, preco: productPreco, categoria_id: productCategoriaId, descricao: productDescricao } = newProduct[0];

        const categoria = await knex<Categoria>("categorias").where({ id: productCategoriaId }).first();

        const responseProduct = {
            id,
            nome: productNome,
            preco: productPreco,
            categoria_id: categoria?.id,
            descricao: productDescricao
        };

        res.status(201).json(responseProduct);
    } catch (error) {
        console.error("Erro ao criar produto:", error);
        res.status(500).json({ mensagem: "Erro inesperado" });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id, nome, preco, categoria_id, descricao } = req.body;

        const newProduct = await knex<Produto>("produtos").where({ id }).update({
            nome: nome.toLowerCase(),
            preco: preco,
            categoria_id: categoria_id,
            descricao: descricao ? descricao.toLowerCase() : null,
        }).returning("*");

        const { id: productId, nome: productNome, preco: productPreco, categoria_id: productCategoriaId, descricao: productDescricao } = newProduct[0];

        const categoria = await knex<Categoria>("categorias").where({ id: productCategoriaId }).first();

        const responseProduct = {
            productId,
            nome: productNome,
            preco: productPreco,
            categoria_id: categoria?.id,
            descricao: productDescricao
        };

        res.status(201).json(responseProduct);
    } catch (error) {
        console.error("Erro ao criar produto:", error);
        res.status(500).json({ mensagem: "Erro inesperado" });
    }
};