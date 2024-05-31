import { Request, Response, NextFunction } from "express";
//import jwt_user_token from "../jwtTokenUser";
//import jwt_password from "../jwtHash";

module.exports = async function (req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.authorization;

    if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        return res.status(400).json({ mensagem: "O token deve ser informado corretamente" });
    }

    const token = bearerToken.split(" ")[1];

    try {
        const user = jwt_user_token.verify(token, jwt_password);
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
