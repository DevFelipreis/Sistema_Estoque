import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { knex } from "../database/conection";
import { Usuario, Profissoes } from "../types";
import jwt_user_token from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, senha } = req.body;

        if (!username || !senha) {
            return res.status(400).json({ message: "Credenciais ausentes" });
        }

        const user = await knex<Usuario>("usuarios")
            .join<Profissoes>("profissoes", "usuarios.profissao_id", "profissoes.id")
            .select(
                "usuarios.id",
                "usuarios.nome",
                "usuarios.username",
                "usuarios.email",
                "profissoes.nome as profissao",
                "usuarios.ativo",
                "usuarios.senha",
                "usuarios.ultimo_login"
            )
            .where("usuarios.username", username)
            .first();

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const pass = await bcrypt.compare(senha, user.senha);
        if (!pass) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const { id, nome, username: apelido, email, profissao, ativo, ultimo_login } = user;
        const token = jwt_user_token.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });

        return res.status(200).json({
            usuario: {
                id,
                nome,
                apelido,
                email,
                profissao,
                ativo,
                ultimo_login,
            },
            token,
        });
    } catch (error) {
        return res.status(500).json({ message: "Erro inesperado" });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id, nome, username, profissao_id } = req.query;
        let query = knex<Usuario>("usuarios")
            .join<Profissoes>("profissoes", "usuarios.profissao_id", "profissoes.id")
            .select(
                "usuarios.id",
                "usuarios.nome",
                "usuarios.username",
                "usuarios.email",
                "profissoes.nome as profissao",
                "usuarios.ativo",
                "usuarios.ultimo_login"
            );

        if (id) {
            query = query.where("usuarios.id", id);
            const users = await query;
            return res.status(200).json(
                users
            );
        }
        if (nome) {
            query = query.where("usuarios.nome", nome);
            const users = await query;
            return res.status(200).json(
                users
            );
        }
        if (username) {
            query = query.where("usuarios.username", username);
            const users = await query;
            return res.status(200).json(
                users
            );
        }
        if (profissao_id) {
            query = query.where("usuarios.profissao_id", profissao_id);
            const users = await query;
            return res.status(200).json(
                users
            );
        } else {
            const users = await query;
            return res.status(200).json(
                users
            );
        }
    } catch (error) {
        return res.status(500).json({ message: "Erro inesperado" });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { nome, username, senha, email, profissao_id, ativo, ultimo_login } = req.body;

        if (!nome || !username || !senha || !email || !profissao_id) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        const existingUser = await knex<Usuario>("usuarios").where({ username }).first();
        if (existingUser) {
            return res.status(409).json({ message: "Username já existe." });
        }

        const existingEmail = await knex<Usuario>("usuarios").where({ email }).first();
        if (existingEmail) {
            return res.status(409).json({ message: "Email já cadastrado." });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const newUserId = await knex<Usuario>("usuarios").insert({
            nome,
            username,
            senha: hashedPassword,
            email,
            profissao_id,
            ativo,
            ultimo_login: new Date(),
        }).returning("id");

        const user = await knex<Usuario>("usuarios")
            .join<Profissoes>("profissoes", "usuarios.profissao_id", "profissoes.id")
            .select(
                "usuarios.id",
                "usuarios.nome",
                "usuarios.username",
                "usuarios.email",
                "profissoes.nome as profissao",
                "usuarios.ativo",
                "usuarios.senha",
                "usuarios.ultimo_login"
            )
            .where("usuarios.username", username)
            .first();

        const { id, profissao } = user;
        return res.status(200).json({
            usuario: {
                id,
                nome,
                username,
                email,
                profissao,
                ativo,
                ultimo_login,
            },
        });

    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ message: "Erro inesperado" });
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
        res.status(500).json({ message: "Erro inesperado" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        };

        const newUser = await knex<Usuario>("usuarios").where({ id }).delete();

        res.status(204).json();

    } catch (error) {
        res.status(500).json({ message: "Erro inesperado" });
    }
};