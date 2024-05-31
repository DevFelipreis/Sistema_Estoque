import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { knex } from "../database/conection";
import { Usuario } from "../types";
import jwt_user_token from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, senha } = req.body;

        if (!username || !senha) {
            return res.status(400).json({ mensagem: "Credenciais ausentes" });
        }

        const user = await knex<Usuario>("usuarios").where({ username }).first();

        if (!user) {
            return res.status(401).json({ mensagem: "Credenciais inválidas" });
        }

        const pass = await bcrypt.compare(senha, user.senha);
        if (!pass) {
            return res.status(401).json({ mensagem: "Credenciais inválidas" });
        }

        const { id, nome: userNome, username: userEmail } = user;
        const token = jwt_user_token.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });

        return res.status(200).json({
            usuario: {
                id,
                nome: userNome,
                email: userEmail,
            },
            token,
        });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ mensagem: "Erro inesperado" });
    }
};


export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        if (id) {
            const oneUser = await knex<Usuario>("usuarios").where({ id }).first();
            if (!oneUser) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }
            const { id: userId, nome: userNome, username: userUsername } = oneUser;
            return res.status(200).json({ id: userId, nome: userNome, username: userUsername });
        } else {
            const allUsers = await knex<Usuario>("usuarios").select();
            return res.status(200).json(allUsers.map(user => ({
                id: user.id,
                nome: user.nome,
                username: user.username,
            })));
        }
    } catch (error) {
        console.error("Erro ao obter usuário(s):", error);
        return res.status(500).json({ mensagem: "Erro inesperado" });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { nome, username, senha } = req.body;

        const pass = await bcrypt.hash(senha, 10);
        const newUser = await knex<Usuario>("usuarios").insert({
            nome: nome.toLowerCase(),
            username: username.toLowerCase().toString(),
            senha: pass,
        }).returning("*");

        const { id, nome: userNome, username: userUsername } = newUser[0];
        res.status(201).json({ id, nome: userNome, username: userUsername });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ mensagem: "Erro inesperado" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id, nome, username, senha } = req.body;

        const pass = await bcrypt.hash(senha, 10);
        const newUser = await knex<Usuario>("usuarios").where({ id }).update({
            id: id.Usuario,
            nome: nome.toLowerCase(),
            username: username.toLowerCase().toString(),
            senha: pass,
        }).returning("*");

        const { id: userId, nome: userNome, username: userUsername } = newUser[0];
        res.status(201).json({ id: userId, nome: userNome, username: userUsername });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ mensagem: "Erro inesperado" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        const newUser = await knex<Usuario>("usuarios").where({ id }).delete();

        res.status(204).json({});
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ mensagem: "Erro inesperado" });
    }
};