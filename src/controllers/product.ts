import { Request, Response } from "express";
import { knex } from "../database/conection";
import { Categoria, Produto } from "../types";
import dotenv from "dotenv";
dotenv.config();

export const getProduct = async (req: Request, res: Response) => {
    try {
        const { id, nome, categoria_id } = req.query;
        console.log(id, nome, categoria_id)
        let query = knex<Produto>("produtos")
            .join<Categoria>("categorias", "produtos.categoria_id", "categorias.id")
            .select(
                "produtos.id",
                "produtos.nome",
                "produtos.preco",
                "produtos.quantidade",
                "produtos.descricao",
                "categorias.nome as categoria_nome"
            );

        if (id) {
            query = query.where("produtos.id", id);
            const products = await query;

            return res.status(200).json(products);
        }

        if (nome) {
            query = query.where("produtos.nome", "like", `%${nome}%`);
            const products = await query;

            return res.status(200).json(products);
        }

        if (categoria_id) {
            query = query.where("produtos.categoria_id", categoria_id);
            const products = await query;

            return res.status(200).json(products);
        }

        const products = await query;
        console.log(products)
        return res.status(200).json(products);
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

        res.status(201).json(productCreated);
    } catch (error) {
        res.status(500).json({ message: "Erro inesperado" });
    }
};


export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id, nome, preco, quantidade, categoria_id, descricao } = req.body;

        const currentProduct = await knex<Produto>("produtos").where({ id }).first();

        const updatedProductData = {
            nome: nome ? nome.toLowerCase() : currentProduct?.nome,
            preco: preco !== undefined ? preco : currentProduct?.preco,
            quantidade: quantidade !== undefined ? quantidade : currentProduct?.quantidade,
            categoria_id: categoria_id !== undefined ? categoria_id : currentProduct?.categoria_id,
            descricao: descricao ? descricao.toLowerCase() : currentProduct?.descricao
        };

        const newProduct = await knex<Produto>("produtos")
            .where({ id })
            .update(updatedProductData)
            .returning("*");

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
        const productUpdated = JSON.stringify(responseProduct);
        res.status(201).json({ message: `${productNome} atualizado com sucesso! ${productUpdated}` });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: "Erro inesperado" });
    }
};


export const entryProduct = async (req: Request, res: Response) => {
    try {
        const { id, quantidade } = req.body;
        console.log(id, quantidade)
        if (!id || !quantidade) {
            return res.status(400).json({ message: "Id e quantidade são obrigatórios" });
        }

        const getProduct: Produto | undefined = await knex<Produto>('produtos')
            .where({ id })
            .first();

        const currentQuantity: number = Number(getProduct?.quantidade);

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
        const productEntry = JSON.stringify(responseProduct);
        res.status(201).json({ message: `${responseProduct.nome} entrada no estoque com sucesso!`, productEntry });
    } catch (error) {
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