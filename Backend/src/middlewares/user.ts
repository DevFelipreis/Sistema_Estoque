import { Request, Response } from "express";
import { knex } from "../database/conection";
import { Usuario } from "../types";
import dotenv from "dotenv";
dotenv.config();

export const userValidation = async (req: Request, res: Response, next: any) => {
    try {
        const { id, username, senha } = req.body;
        const user = await knex<Usuario>("usuarios").where({ id }).first();
        if (!id || !username || !senha) {
            return res.status(401).json({ message: "Preencha todos os campos" });
        }
        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }
        next();
    }
    catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ message: "Erro inesperado" });
    }
}
