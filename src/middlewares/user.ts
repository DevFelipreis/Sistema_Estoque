import { Request, Response, NextFunction } from "express";
import { knex } from "../database/conection";
import { Profissoes, Usuario } from "../types";
import dotenv from "dotenv";
dotenv.config();

export const userValidationProfession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { profissao_id: id } = req.body;
        const profession = await knex<Profissoes>("profissoes").where({ id }).first();

        if (!profession) {
            return res.status(401).json({ message: "Profissão não encontrada" });
        }

        next();
    } catch (error) {
        console.error("Erro ao validar profissão:", error);
        return res.status(500).json({ message: "Erro inesperado" });
    }
};

export const userValidationId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.body;
        const user = await knex<Usuario>("usuarios").where({ id }).first();
        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        };

        next();

    } catch (error) {
        return res.status(500).json({ message: "Erro inesperado" });
    };
};




