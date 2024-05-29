import express from "express";
import "dotenv/config"
import Router from "./routers/routers";

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use(Router)

app.listen(port, () => {
    console.log("Serve is running port 3000");
})