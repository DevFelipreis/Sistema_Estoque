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

export const updateAtivo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const date = new Date();
        const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000; // 30 dias em milissegundos
        const usuarios = await knex<Usuario>("usuarios").select();

        for (const usuario of usuarios) {
            if (usuario.ultimo_login instanceof Date && (date.getTime() - usuario.ultimo_login.getTime()) > thirtyDaysInMilliseconds) {
                await knex<Usuario>("usuarios")
                    .where({ id: usuario.id })
                    .update({ ativo: false });
            }
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Erro inesperado" });
    }
}

export const updateDateLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;
        const updateUltimoLogin = await knex<Usuario>("usuarios")
            .update({ ultimo_login: new Date() }).where({ username });
        next();

    } catch (error) {
        res.status(500).json({ message: "Erro inesperado" });
    }
}




