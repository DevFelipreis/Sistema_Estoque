import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { knex } from "../database/conection";
import { Usuario } from "../types";
import jwt_user_token from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userValidation = async (req: Request, res: Response, next: any) => {
    try {
        const { id, username, senha } = req.body;
        const user = await knex<Usuario>("usuarios").where({ id }).first();
        if (!user) {
            return res.status(401).json({ mensagem: "Usuário não encontrado" });
        }
        next();
    }
    catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ mensagem: "Erro inesperado" });
    }
}
