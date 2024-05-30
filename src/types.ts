export type Usuario = {
    id: number | string,
    nome: string,
    username: string,
    senha: string,
};

export type Categoria = {
    id: number | string,
    categoria: string
};

export type Produto = {
    id: number | string,
    nome: string,
    preco: number,
    scategoria_id: number,
    descricao?: string
};