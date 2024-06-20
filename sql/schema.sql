create database sistema_gerenciamento_estoque;

create table profissoes(
    id serial primary key,
    nome varchar(255) not null unique
);

create table usuarios(
    id serial primary key,
    username varchar(255) unique not null,
    nome varchar(255) not null ,
    senha varchar(255) not null,
    email varchar(255),
    profissao_id int references profissoes(id),
    ultimo_login timestamp not null,
    ativo boolean    
);

create table categorias(
    id serial primary key,
    nome varchar(255) not null 
);

create table produtos(
    id serial primary key,
    nome varchar(255) not null unique ,
    preco numeric(10,2) not null,
    quantidade int not null,
    categoria_id int references categorias(id),
    descricao varchar(255)
);

create table vendas(
    id serial primary key,
    cliente varchar(255) not null,
    cpf_cliente varchar(255),
    vendedor_id int references usuarios(id),
    produto_id int references produtos(id),
    valor_produto numeric(10,2) not null,
    quantidade int not null,
    total numeric(10,2) not null,
    data_compra timestamp not null,
    ativo boolean
);

insert into categorias (nome) values
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

insert into profissoes (nome) values
('administrador'),
('encarregado'),
('gerente'),
('vendedor'),
('estoquista'),
('conferente'),
