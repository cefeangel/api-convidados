# API Convidados - Documentação de Endpoints

Esta documentação descreve detalhadamente todos os endpoints disponíveis na nossa **API de Convidados** (referenciada anteriormente), abordando como a autenticação funciona e como interagir com os módulos de Usuários, Listas de Eventos e Convidados.

---

## 🔐 Autenticação e Segurança

A API utiliza o padrão **JWT (JSON Web Token)**. Quase todas as rotas da API requerem autenticação (com exceção do Cadastro de Usuário e do Login).

Para acessar rotas protegidas, você deve enviar o Token no cabeçalho (Header) da requisição HTTP:
```http
Authorization: Bearer <SEU_TOKEN_AQUI>
```

---

## 1. Módulo de Autenticação (`/api/auth`)

### `POST /api/auth/login`
- **Descrição**: Autentica um usuário existente e devolve o Token JWT.
- **Acesso**: Público.
- **Corpo da Requisição (JSON)**:
  ```json
  {
    "email": "joao@teste.com",
    "senha": "senha_segura123"
  }
  ```
- **Retorno (200 OK)**:
  ```json
  {
    "message": "Login realizado com sucesso",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

## 2. Módulo de Usuários (`/api/users`)

### `POST /api/users`
- **Descrição**: Cria uma nova conta de usuário para gerenciar listas.
- **Acesso**: Público.
- **Corpo da Requisição (JSON)**:
  ```json
  {
    "nome": "João",
    "email": "joao@teste.com",
    "senha": "senha_segura123"
  }
  ```

### `GET /api/users`
- **Descrição**: Lista todos os usuários cadastrados no sistema.
- **Acesso**: Protegido (Requer Token).

### `GET /api/users/:id`
- **Descrição**: Retorna os detalhes de um usuário específico pelo ID.
- **Acesso**: Protegido (Requer Token).

### `PUT /api/users/:id`
- **Descrição**: Atualiza os dados de um usuário (nome, email ou senha).
- **Acesso**: Protegido (Requer Token).

### `DELETE /api/users/:id`
- **Descrição**: Remove a conta do usuário (as listas e convidados serão excluídos em cascata).
- **Acesso**: Protegido (Requer Token).

---

## 3. Módulo de Listas de Eventos (`/api/eventos`)

> **Importante**: Todo usuário só tem acesso às listas de evento criadas por ele mesmo. O sistema filtra automaticamente usando o Token.

### `POST /api/eventos`
- **Descrição**: Cria uma nova lista de eventos / lista de convidados.
- **Acesso**: Protegido.
- **Corpo da Requisição**:
  ```json
  {
    "nome": "Casamento João e Maria",
    "maximo_convidados": 150,
    "maximo_acompanhantes_por_convidado": 2
  }
  ```

### `GET /api/eventos`
- **Descrição**: Lista todos os eventos cadastrados pelo usuário autenticado. Retorna a contagem atualizada de participantes.
- **Acesso**: Protegido.

### `GET /api/eventos/:id`
- **Descrição**: Retorna os detalhes de uma lista de evento específica.
- **Acesso**: Protegido.

### `GET /api/eventos/:id/relatorio`
- **Descrição**: Retorna o **Dashboard Estatístico** da lista, calculando pendentes, confirmados e total de acompanhantes.
- **Acesso**: Protegido.
- **Retorno (200 OK)**:
  ```json
  {
    "nome_lista": "Casamento João e Maria",
    "quantidade_total_convidados_cadastrados": 50,
    "quantidade_convidados_confirmados": 30,
    "quantidade_convidados_nao_confirmados": 20,
    "quantidade_total_acompanhantes": 15,
    "total_pessoas_confirmadas": 45
  }
  ```

### `PUT /api/eventos/:id`
- **Descrição**: Altera o nome ou os limites de vagas e acompanhantes do evento.
- **Acesso**: Protegido.

### `DELETE /api/eventos/:id`
- **Descrição**: Exclui permanentemente a lista de evento e todos os convidados vinculados.
- **Acesso**: Protegido.

---

## 4. Módulo de Convidados (`/api/eventos/:evento_id/convidados`)

> As rotas de convidados são amarradas ao ID do evento (`:evento_id`) na URL para garantir organização.

### `POST /api/eventos/:evento_id/convidados`
- **Descrição**: Adiciona um convidado (e seus acompanhantes opcionais) na lista do evento. Valida o limite de vagas se enviado já com status confirmado. O telefone deve obrigatoriamente seguir o regex brasileiro: `(XX) 9XXXX-XXXX`.
- **Acesso**: Protegido.
- **Corpo da Requisição**:
  ```json
  {
    "nome": "Carlos Roberto",
    "telefone": "(11) 98888-7777",
    "confirmado": false,
    "acompanhantes": [
      { "nome": "Ana Maria" },
      { "nome": "Pedro" }
    ]
  }
  ```

### `GET /api/eventos/:evento_id/convidados`
- **Descrição**: Lista todos os convidados de um evento com seus acompanhantes.
- **Acesso**: Protegido.
- **Filtros Opcionais (Query Params)**:
  - `?status=confirmados` : Retorna apenas a lista de presença confirmada.
  - `?status=pendentes` : Retorna apenas quem ainda não confirmou presença.

### `PUT /api/eventos/:evento_id/convidados/:id/confirmar`
- **Descrição**: Altera o **Status de Confirmação** de um convidado específico. É neste endpoint que a engine de banco de dados verifica o cálculo rigoroso para saber se há **Vagas Suficientes** baseando-se no limite estipulado pelo evento.
- **Acesso**: Protegido.
- **Corpo da Requisição**:
  ```json
  {
    "confirmado": true
  }
  ```

### `DELETE /api/eventos/:evento_id/convidados/:id`
- **Descrição**: Remove um convidado da lista e exclui automaticamente seus respectivos acompanhantes.
- **Acesso**: Protegido.

---

## Padrão de Erros (Error Handling)
Caso haja qualquer problema relacionado a limites do evento, entradas inválidas ou dados mal formatados, a API utiliza validação centralizada e responde sempre em formato JSON limpo com status `400 Bad Request` ou `404 Not Found`:

```json
{
  "status": "error",
  "message": "Limite de vagas excedido. A lista possui 150 confirmados e o máximo é 150."
}
```
