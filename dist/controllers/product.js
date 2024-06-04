"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.entryProduct = exports.updateProduct = exports.createProduct = exports.getProduct = void 0;
const conection_1 = require("../database/conection");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            const oneProduct = await (0, conection_1.knex)("produtos")
                .join("categorias", "produtos.categoria_id", "categorias.id")
                .select("produtos.id", "produtos.nome", "produtos.preco", "produtos.quantidade", "produtos.descricao", "categorias.nome as categoria_nome")
                .where("produtos.id", id)
                .first();
            if (!oneProduct) {
                return res.status(404).json({ message: "Produto não encontrado" });
            }
            return res.status(200).json(oneProduct);
        }
        else {
            const allProducts = await (0, conection_1.knex)("produtos")
                .join("categorias", "produtos.categoria_id", "categorias.id")
                .select("produtos.id", "produtos.nome", "produtos.preco", "produtos.quantidade", "produtos.descricao", "categorias.nome as categoria_nome");
            return res.status(200).json(allProducts);
        }
    }
    catch (error) {
        console.error("Erro ao obter produto(s):", error);
        return res.status(500).json({ mensagem: "Erro inesperado" });
    }
};
exports.getProduct = getProduct;
const createProduct = async (req, res) => {
    try {
        const { nome, preco, quantidade, categoria_id, descricao } = req.body;
        const newProduct = await (0, conection_1.knex)("produtos").insert({
            nome: nome.toLowerCase(),
            preco: preco,
            quantidade: quantidade,
            categoria_id: categoria_id,
            descricao: descricao ? descricao.toLowerCase() : null,
        }).returning("*");
        const { id, nome: productNome, preco: productPreco, quantidade: productQuantidade, categoria_id: productCategoriaId, descricao: productDescricao } = newProduct[0];
        const categoria = await (0, conection_1.knex)("categorias").where({ id: productCategoriaId }).first();
        const responseProduct = {
            id,
            nome: productNome,
            preco: productPreco,
            quantidade: productQuantidade,
            categoria_id: categoria === null || categoria === void 0 ? void 0 : categoria.id,
            descricao: productDescricao
        };
        const productCreated = JSON.stringify(responseProduct);
        res.status(201).json({ message: `${productNome} criado com sucesso! ${productCreated}` });
    }
    catch (error) {
        res.status(500).json({ message: "Erro inesperado" });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id, nome, preco, quantidade, categoria_id, descricao } = req.body;
        const newProduct = await (0, conection_1.knex)("produtos").where({ id }).update({
            nome: nome.toLowerCase(),
            preco: preco,
            categoria_id: categoria_id,
            quantidade: quantidade,
            descricao: descricao ? descricao.toLowerCase() : null,
        }).returning("*");
        const { id: productId, nome: productNome, preco: productPreco, quantidade: productQuantidade, categoria_id: productCategoriaId, descricao: productDescricao } = newProduct[0];
        const categoria = await (0, conection_1.knex)("categorias").where({ id: productCategoriaId }).first();
        const responseProduct = {
            productId,
            nome: productNome,
            preco: productPreco,
            quantidade: productQuantidade,
            categoria_id: categoria === null || categoria === void 0 ? void 0 : categoria.id,
            descricao: productDescricao
        };
        res.status(201).json({ message: `${productNome} atualizado com sucesso! ${responseProduct}` });
    }
    catch (error) {
        res.status(500).json({ message: "Erro inesperado" });
    }
};
exports.updateProduct = updateProduct;
const entryProduct = async (req, res) => {
    try {
        const { id, quantidade } = req.body;
        const getProduct = await (0, conection_1.knex)('produtos')
            .where({ id })
            .first();
        if (!getProduct) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        const currentQuantity = Number(getProduct.quantidade);
        const quantityToAdd = Number(quantidade);
        const sum = currentQuantity + quantityToAdd;
        const updatedProduct = await (0, conection_1.knex)('produtos')
            .where({ id })
            .update({
            quantidade: sum
        })
            .returning('*');
        const { categoria_id: productCategoriaId } = updatedProduct[0];
        const categoria = await (0, conection_1.knex)('categorias')
            .where({ id: productCategoriaId })
            .first();
        const responseProduct = {
            ...updatedProduct[0],
            categoria: categoria === null || categoria === void 0 ? void 0 : categoria.categoria
        };
        res.status(204).json({ message: `${responseProduct.nome} entrada no estoque com sucesso!`, product: responseProduct });
    }
    catch (error) {
        console.error('Erro inesperado:', error);
        res.status(500).json({ message: "Erro inesperado." });
    }
};
exports.entryProduct = entryProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const newProduct = await (0, conection_1.knex)("produtos").where({ id }).delete();
        res.status(201).json({ message: "Produto excluído com sucesso!" });
    }
    catch (error) {
        console.error("Erro ao criar produto:", error);
        res.status(500).json({ message: "Erro inesperado" });
    }
};
exports.deleteProduct = deleteProduct;
