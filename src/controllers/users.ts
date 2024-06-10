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

        const user: Usuario | undefined = await knex<Usuario>("usuarios")
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

        const { id, nome, username: apelido, email, profissao_id, ativo, ultimo_login } = user;
        const token = jwt_user_token.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });

        return res.status(200).json({
            usuario: {
                id,
                nome,
                apelido,
                email,
                profissao_id,
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
        const { id } = req.body;

        if (id) {
            const oneUser = await knex<Usuario>("usuarios").where({ id }).first();
            if (!oneUser) {
                return res.status(404).json({ mensagem: "Usuário não encontrado" });
            }
            const { id: userId, nome: nome, username: apelido } = oneUser;
            return res.status(200).json({ id: userId, nome: nome, username: apelido });
        } else {
            const allUsers = await knex<Usuario>("usuarios").select();
            return res.status(200).json(allUsers.map(user => ({
                id: user.id,
                nome: user.nome,
                username: user.username,
            })));
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

        const pass = await bcrypt.hash(senha, 10);

        const newUser = await knex<Usuario>("usuarios").insert({
            nome: nome.toLowerCase(),
            username: username.toLowerCase(),
            senha: pass,
            email: email.toLowerCase(),
            profissao_id: profissao_id.toLowerCase(),
            ativo,
            ultimo_login: new Date()
        }).returning("*");

        const { id, nome: nomeCompleto, username: apelido, ultimo_login } = newUser[0];
        res.status(201).json({ id, nome: nomeCompleto, username: apelido, email, profissao_id, ativo, ultimo_login });
    } catch (error) {
        console.log(error);
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

        const newUser = await knex<Usuario>("usuarios").where({ id }).delete();

        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: "Erro inesperado" });
    }
};