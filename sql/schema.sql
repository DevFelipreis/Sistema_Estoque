create database sistema_gerenciamento_estoque

create table usuarios(
    id serial primary key,
    username varchar(255) unique not null,
    nome varchar(255) not null ,
    senha varchar(255) not null 
);

create table categorias(
    id serial primary key,
    nome varchar(255) not null 
);

create table produtos(
    id serial primary key,
    nome varchar(255) not null ,
    preco int not null,
    categoria_id int references categorias(id),
    descricao varchar(255)
);


INSERT INTO categorias (nome) VALUES
('Computadores'),
('Laptops'),
('Monitores'),
('Teclados'),
('Mouses'),
('Impressoras'),
('Componentes de Hardware'),
('Acessórios'),
('Armazenamento'),
('Redes e Conectividade');

