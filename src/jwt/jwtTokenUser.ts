import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET as string;

export const verify = (token: string, secret: string) => {
    return jwt.verify(token, secret);
};

export const loginValidation = async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        return res.status(400).json({ mensagem: "O token deve ser informado corretamente" });
    };

    const token = bearerToken.split(" ")[1];

    try {
        const user = verify(token, secret);

        if (!user) {
            return res.status(401).json({ mensagem: "Token inválido ou expirado" });
        };

        req.userId = (user as any).id;

        next();

    } catch (error) {
        return res.status(401).json({ mensagem: "Token inválido ou expirado" });
    };
};
