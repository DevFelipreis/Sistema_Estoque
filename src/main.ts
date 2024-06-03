import express from "express";
import "dotenv/config";
import Router from "./routers/routers";
import cors from 'cors';


const port = process.env.PORT;

const app = express();

app.use(cors());

app.use(express.json());

app.use(Router);

app.listen(port, () => {
    console.log(`Servidor está rodando na porta ${port}`);
});
