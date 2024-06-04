# Sistema de Gerenciamento de Estoque #

Acesse o projeto online: https://sistema-estoque-front-end.vercel.app/
Clique e inicie o servidor caso esteja pausado: https://api.render.com/deploy/srv-cpfp10dds78s739hbnl0?key=2HSWFj-pXTo

Acesse o Figma do Projeto --> https://www.figma.com/design/zCEwYUzq4cWqdvF0nR202e/SISTEMA-DE-CADASTRO?m=dev&node-id=0-1&t=ncGY3XIGgYLMS3OE-1

## Endpoints ##

Login

- **Método:** POST
- **URL:** `/login`
- **Descrição:** Endpoint para autenticar o usuário.
- **Corpo da requisição (JSON):**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Resposta de Sucesso (200):**
  ```json
  {
    "token": "string"
  }
  ```

### Produtos (Autenticado)

#### Cadastrar Produto
- **Método:** POST
- **URL:** `/produto`
- **Descrição:** Criar um novo produto.
- **Corpo da requisição (JSON):**
  ```json
  {
    "nome": "string",
    "preco": "number",
    "tipo": "string"
    "descricao": "string"
  }
  ```
- **Resposta de Sucesso (201):** Produto criado com sucesso.

#### Atualizar Produto
- **Método:** PUT
- **URL:** `/produto`
- **Descrição:** Atualizar um produto existente.
- **Parâmetros da URL:**
  - `id` (string): ID do produto a ser atualizado.
- **Corpo da requisição (JSON):**
  ```json
  {
    "nome": "string",
    "preco": "number",
    "tipo": "string"
    "descricao": "string"
  }
  ```
- **Resposta de Sucesso (200):** Produto atualizado com sucesso.

#### Excluir Produto
- **Método:** DELETE
- **URL:** `/produto`
- **Descrição:** Excluir um produto existente.
- **Parâmetros da URL:**
  - `id` (string): ID do produto a ser excluído.
- **Resposta de Sucesso (204):** Produto excluído com sucesso.

#### Listar Produtos
- **Método:** GET
- **URL:** `/produto`
- **Descrição:** Listar todos os produtos.
- **Resposta de Sucesso (200):** Lista de produtos no formato JSON.

## Autenticação
Todos os endpoints que exigem autenticação devem incluir um cabeçalho `Authorization` com o valor `Bearer <token>` onde `<token>` é o token de acesso JWT obtido após o login.


## Licença

Este projeto é licenciado sob a [Licença Pública Geral GNU (GNU GPL)](https://www.gnu.org/licenses/gpl-3.0.html) - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
