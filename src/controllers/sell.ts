import { Request, Response } from "express";
import { knex } from "../database/conection";
import { Vendas } from "../types";
import dotenv from "dotenv";
dotenv.config();

export const createSell = async (req: Request, res: Response) => {
    try {
        const { cliente, cpf_cliente, vendedor_id, produto_id, valor_produto, quantidade, ativo } = req.body;
        const total: number = valor_produto * quantidade
        const newSell = await knex<Vendas>("vendas").insert({
            cliente: cliente.toLowerCase(),
            cpf_cliente: cpf_cliente,
            vendedor_id: vendedor_id,
            produto_id: produto_id,
            valor_produto: valor_produto,
            quantidade: quantidade,
            total: total,
            data_compra: new Date(),
            ativo: ativo
        }).returning("*")

        const sell = await knex<Vendas>("vendas").join("produtos", "vendas.produto_id", "produtos.id")
            .select({
                "id": "vendas.id",
                "vendedor_id": "vendas.vendedor_id",
                "cliente": "vendas.cliente",
                "cpf_cliente": "vendas.cpf_cliente",
                "valor_produto": "vendas.valor_produto",
                "quantidade": "vendas.quantidade",
                "total": "vendas.total",
                "data_compra": "vendas.data_compra",
                "ativo": "vendas.ativo",
                "nome": "produtos.nome",
                "preco": "produtos.preco",
                "descricao": "produtos.descricao",
                "categoria_id": "produtos.categoria_id"

            }).where("vendas.id", newSell[0].id)

        return res.status(201).json(sell[0]);
    } catch (error) {

    }
}
