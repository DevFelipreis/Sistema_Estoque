import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
};

export type Usuario = {
    id: number | string,
    nome: string,
    username: string,
    senha: string,
    email: string,
    profissao_id: string,
    ativo: boolean,
    ultimo_login: Date
};

export type Categoria = {
    id: number | string,
    categoria: string
};

export type Produto = {
    id: number | string,
    nome: string,
    preco: number,
    quantidade: number,
    categoria_id: number,
    descricao?: string
};

export type Profissoes = {
    id: number | string,
    profissao: string
};

export type Vendas = {
    id: number | string,
    cliente: string,
    cpf_cliente: string,
    vendedor_id: number,
    produto_id: number,
    valor_produto: number,
    quantidade: number,
    total: number,
    data_compra: Date,
    ativo: boolean
};