import express from "express";
import "dotenv/config";
import Router from "./routers/routers";

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(Router);

app.listen(port, () => {
    console.log(`Servidor está rodando na porta ${port}`);
});
