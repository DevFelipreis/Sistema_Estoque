import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { knex } from "../database/conection";
import { Usuario, Profissoes } from "../types";
import jwt_user_token from "jsonwebtoken";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

interface CustomJwtPayload extends JwtPayload {
    userId: string;
}

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
        const { nome, username, senha, email, profissao_id, ativo } = req.body;

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
            nome: nome.toLowerCase(),
            username: username.toString(),
            senha: hashedPassword,
            email: email.toLowerCase(),
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

        const { id, profissao, ultimo_login } = user;
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
        res.status(500).json({ message: "Erro inesperado" });
    }
};


export const updateUserAll = async (req: Request, res: Response) => {
    try {
        const { id, nome, username, senha, email, profissao_id, ativo } = req.body;
        const pass = await bcrypt.hash(senha, 10);
        const newUser = await knex<Usuario>("usuarios").where({ id }).update({
            id: id.Usuario,
            nome: nome.toLowerCase(),
            username: username.toString(),
            senha: pass,
            email: email.toLowerCase(),
            profissao_id,
            ativo,
            ultimo_login: new Date(),
        }).returning("*");

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

        const { profissao, ultimo_login } = user;
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
        res.status(500).json({ message: "Erro inesperado" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Token não fornecido" });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;

        const userId = decoded!.id;

        const { nome, username, senha, email } = req.body;
        const pass = await bcrypt.hash(senha, 10);

        const newUser = await knex<Usuario>("usuarios").where({ id: userId }).update({
            nome: nome.toLowerCase(),
            username: username.toString(),
            senha: pass,
            email: email.toLowerCase(),
        }).returning("*");

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

        const { id, profissao, ativo, ultimo_login } = user;
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
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Token inválido" });
        }
        console.error(error);
        res.status(500).json({ message: "Erro inesperado" });
    }
}

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



