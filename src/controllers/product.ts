import { Request, Response } from "express";
import { knex } from "../database/conection";
import { Categoria, Produto } from "../types";
import dotenv from "dotenv";
dotenv.config();

export const getProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (id) {
            const oneProduct = await knex<Produto>("produtos")
                .join<Categoria>("categorias", "produtos.categoria_id", "categorias.id")
                .select(
                    "produtos.id",
                    "produtos.nome",
                    "produtos.preco",
                    "produtos.quantidade",
                    "produtos.descricao",
                    "categorias.nome as categoria_nome"
                )
                .where("produtos.id", id)
                .first();

            if (!oneProduct) {
                return res.status(404).json({ message: "Produto não encontrado" });
            }

            return res.status(200).json(oneProduct);
        } else {
            const allProducts = await knex<Produto>("produtos")
                .join<Categoria>("categorias", "produtos.categoria_id", "categorias.id")
                .select(
                    "produtos.id",
                    "produtos.nome",
                    "produtos.preco",
                    "produtos.quantidade",
                    "produtos.descricao",
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
        const { nome, preco, quantidade, categoria_id, descricao } = req.body;

        const newProduct = await knex<Produto>("produtos").insert({
            nome: nome.toLowerCase(),
            preco: preco,
            quantidade: quantidade,
            categoria_id: categoria_id,
            descricao: descricao ? descricao.toLowerCase() : null,
        }).returning("*");

        const { id, nome: productNome, preco: productPreco, quantidade: productQuantidade, categoria_id: productCategoriaId, descricao: productDescricao } = newProduct[0];

        const categoria = await knex<Categoria>("categorias").where({ id: productCategoriaId }).first();

        const responseProduct = {
            id,
            nome: productNome,
            preco: productPreco,
            quantidade: productQuantidade,
            categoria_id: categoria?.id,
            descricao: productDescricao
        };

        const productCreated = JSON.stringify(responseProduct);

        res.status(201).json({ message: `${productNome} criado com sucesso! ${productCreated}` });
    } catch (error) {
        res.status(500).json({ message: "Erro inesperado" });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id, nome, preco, quantidade, categoria_id, descricao } = req.body;

        const newProduct = await knex<Produto>("produtos").where({ id }).update({
            nome: nome.toLowerCase(),
            preco: preco,
            categoria_id: categoria_id,
            quantidade: quantidade,
            descricao: descricao ? descricao.toLowerCase() : null,
        }).returning("*");

        const { id: productId, nome: productNome, preco: productPreco, quantidade: productQuantidade, categoria_id: productCategoriaId, descricao: productDescricao } = newProduct[0];

        const categoria = await knex<Categoria>("categorias").where({ id: productCategoriaId }).first();

        const responseProduct = {
            productId,
            nome: productNome,
            preco: productPreco,
            quantidade: productQuantidade,
            categoria_id: categoria?.id,
            descricao: productDescricao
        };

        res.status(201).json({ message: `${productNome} atualizado com sucesso! ${responseProduct}` });
    } catch (error) {
        res.status(500).json({ message: "Erro inesperado" });
    }
};

export const entryProduct = async (req: Request, res: Response) => {
    try {
        const { id, quantidade } = req.body;

        const getProduct: Produto | undefined = await knex<Produto>('produtos')
            .where({ id })
            .first();


        if (!getProduct) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        const currentQuantity: number = Number(getProduct.quantidade);

        const quantityToAdd: number = Number(quantidade);

        const sum: number = currentQuantity + quantityToAdd;

        const updatedProduct: Produto[] = await knex<Produto>('produtos')
            .where({ id })
            .update({
                quantidade: sum
            })
            .returning('*');

        const { categoria_id: productCategoriaId } = updatedProduct[0];
        const categoria: Categoria | undefined = await knex<Categoria>('categorias')
            .where({ id: productCategoriaId })
            .first();

        const responseProduct = {
            ...updatedProduct[0],
            categoria: categoria?.categoria
        };

        res.status(204).json({ message: `${responseProduct.nome} entrada no estoque com sucesso!`, product: responseProduct });
    } catch (error) {
        console.error('Erro inesperado:', error);
        res.status(500).json({ message: "Erro inesperado." });
    }
};


export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const newProduct = await knex<Produto>("produtos").where({ id }).delete()
        res.status(201).json({ message: "Produto excluído com sucesso!" });
    } catch (error) {
        console.error("Erro ao criar produto:", error);
        res.status(500).json({ message: "Erro inesperado" });
    }
};