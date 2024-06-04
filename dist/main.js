"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const routers_1 = __importDefault(require("./routers/routers"));
const cors_1 = __importDefault(require("cors"));
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(routers_1.default);
app.listen(port, () => {
    console.log(`Servidor está rodando na porta ${port}`);
});
