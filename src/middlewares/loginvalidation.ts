import { Request, Response, NextFunction } from "express";
import { verify } from "../jwtTokenUser";
import { secret } from "../jwtHash";

export const loginValidation = async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        return res.status(400).json({ mensagem: "O token deve ser informado corretamente" });
    }

    const token = bearerToken.split(" ")[1];

    try {
        const user = verify(token, secret) as { id: string };
        if (!user) {
            return res.status(401).json({ mensagem: "Token inválido ou expirado" });
        }
        req.userId = user.id;
        next();
    } catch (error) {
        console.error("Erro ao verificar o token:", error);
        return res.status(401).json({ mensagem: "Token inválido ou expirado" });
    }
};
