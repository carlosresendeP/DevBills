# 💰 ContaZero API

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

> API REST para gerenciamento de transações financeiras pessoais com autenticação Firebase e banco de dados MongoDB.

---

## 📖 Sobre o Projeto

**ContaZero API** é uma aplicação backend robusta desenvolvida em **TypeScript** que permite aos usuários gerenciar suas finanças pessoais de forma segura e eficiente. A API oferece funcionalidades completas para:

✅ Criar, listar, filtrar e deletar transações financeiras  
✅ Categorizar receitas e despesas  
✅ Obter resumos financeiros mensais  
✅ Visualizar histórico de transações para gráficos  
✅ Autenticação segura com Firebase Authentication

---

## 🚀 Tecnologias

### Backend

- **[Fastify](https://fastify.dev/)** - Framework web de alta performance
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript com tipagem estática
- **[Prisma](https://www.prisma.io/)** - ORM moderno para Node.js
- **[MongoDB](https://www.mongodb.com/)** - Banco de dados NoSQL

### Autenticação

- **[Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)** - Autenticação e verificação de tokens

### Validação & Utilitários

- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript-first
- **[Day.js](https://day.js.org/)** - Manipulação de datas leve e poderosa
- **[Biome](https://biomejs.dev/)** - Linter e formatador rápido

---

## 📁 Estrutura do Projeto

```
API/
├── 📄 README.md                 # Este arquivo
├── 📁 docs/                     # Documentação
│   ├── DOCUMENTACAO.md          # Documentação completa e detalhada
│   ├── GUIA-RAPIDO.md           # Guia rápido de referência
│   ├── ARQUITETURA.md           # Diagramas e arquitetura do sistema
│   └── GLOSSARIO.md             # Glossário de termos técnicos
│
├── prisma/
│   └── schema.prisma            # Schema do banco de dados
│
├── src/
│   ├── config/                  # Configurações
│   │   ├── env.ts               # Validação de variáveis de ambiente
│   │   ├── firebase.ts          # Inicialização do Firebase
│   │   └── prima.ts             # Conexão Prisma/MongoDB
│   │
│   ├── controllers/             # Lógica de negócio
│   │   ├── catergory.controller.ts
│   │   └── transactions/
│   │       ├── createTransaction.controller.ts
│   │       ├── deleteTransaction.Controller.ts
│   │       ├── getHistoricalTransaction.controller.ts
│   │       ├── getTransactions.controller.ts
│   │       └── getTransactionsSummary.controller.ts
│   │
│   ├── middlewares/             # Middleware de autenticação
│   │   └── auth.middlewares.ts
│   │
│   ├── Routes/                  # Definição de rotas
│   │   ├── index.ts
│   │   ├── category.routes.ts
│   │   └── transation.routes.ts
│   │
│   ├── schemas/                 # Validação com Zod
│   │   └── transaction.schema.ts
│   │
│   ├── services/                # Serviços auxiliares
│   │   └── globalCategories.service.ts
│   │
│   ├── types/                   # Tipos TypeScript
│   │   ├── category.types.ts
│   │   └── transactions.types.ts
│   │
│   ├── app.ts                   # Configuração do Fastify
│   └── server.ts                # Ponto de entrada da aplicação
│
├── .env                         # Variáveis de ambiente (não versionado)
├── package.json
├── tsconfig.json
└── biome.json
```

---

## ⚡ Início Rápido

### Pré-requisitos

- **Node.js** 18+
- **MongoDB Atlas** (ou instância local)
- **Conta Firebase** com projeto configurado

### 1️⃣ Instalação

```bash
# Clonar repositório (se aplicável)
git clone <url-do-repositorio>

# Navegar para a pasta
cd API

# Instalar dependências
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente

Criar arquivo `.env` na raiz:

```env
PORT=3001
NODE_ENV=dev

# MongoDB
DATABASE_URL=mongodb+srv://usuario:senha@cluster.mongodb.net/ContaZero

# Firebase
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-projeto.iam.gserviceaccount.com
```

### 3️⃣ Configurar Prisma

```bash
# Gerar Prisma Client
npx prisma generate

# Sincronizar schema com banco
npx prisma db push
```

### 4️⃣ Executar

```bash
# Modo desenvolvimento (com hot reload)
npm run dev
```

✅ Servidor rodando em: `http://localhost:3001`

---

## 📚 Documentação

| Documento                                     | Descrição                                                                     |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| **[DOCUMENTACAO.md](./docs/DOCUMENTACAO.md)** | 📖 Documentação completa da API com todos os detalhes, exemplos e explicações |
| **[GUIA-RAPIDO.md](./docs/GUIA-RAPIDO.md)**   | ⚡ Referência rápida de endpoints e comandos                                  |
| **[ARQUITETURA.md](./docs/ARQUITETURA.md)**   | 🏗️ Diagramas de arquitetura, fluxos e padrões utilizados                      |
| **[GLOSSARIO.md](./docs/GLOSSARIO.md)**       | 📖 Glossário de termos técnicos e conceitos                                   |

---

## 🔌 Endpoints Principais

### Base URL

```
http://localhost:3001/api
```

### Autenticação

Todas as rotas (exceto `/health`) requerem token Firebase no header:

```
Authorization: Bearer <seu-token-aqui>
```

### Rotas Disponíveis

| Método   | Endpoint                       | Descrição                       |
| -------- | ------------------------------ | ------------------------------- |
| `GET`    | `/api/health`                  | Health check do servidor        |
| `GET`    | `/api/categories`              | Listar categorias               |
| `POST`   | `/api/transactions`            | Criar transação                 |
| `GET`    | `/api/transactions`            | Listar transações (com filtros) |
| `GET`    | `/api/transactions/summary`    | Resumo financeiro mensal        |
| `GET`    | `/api/transactions/historical` | Histórico para gráficos         |
| `DELETE` | `/api/transactions/:id`        | Deletar transação               |

---

## 📊 Exemplos de Uso

### Criar Transação

```http
POST /api/transactions
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6...
Content-Type: application/json

{
  "description": "Compra no supermercado",
  "amount": 150.50,
  "date": "2025-10-20",
  "categoryId": "507f1f77bcf86cd799439011",
  "type": "EXPENSE"
}
```

### Resumo Mensal

```http
GET /api/transactions/summary?month=10&year=2025
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6...
```

**Resposta:**

```json
{
  "totalExpenses": 850.75,
  "totalIncomes": 3500.0,
  "totalBalance": 2649.25,
  "expensesByCategory": [
    {
      "categoryName": "Alimentação",
      "amount": 450.5,
      "percentage": 52.95
    }
  ]
}
```

---

## 🗄️ Banco de Dados

### Modelos

#### Category (Categoria)

- `id`: ObjectId
- `name`: Nome da categoria
- `color`: Cor em hexadecimal
- `type`: INCOME ou EXPENSE

#### Transaction (Transação)

- `id`: ObjectId
- `description`: Descrição
- `amount`: Valor
- `date`: Data da transação
- `type`: INCOME ou EXPENSE
- `userId`: ID do usuário (Firebase)
- `categoryId`: Referência à categoria

### Categorias Padrão

**Despesas:** Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Compras, Outros

**Receitas:** Salário, Freelance, Investimentos, Outros

---

## 🔐 Segurança

- ✅ Autenticação via Firebase Authentication
- ✅ Validação de tokens JWT em todas as rotas protegidas
- ✅ Verificação de propriedade dos dados (usuário só acessa suas transações)
- ✅ Validação de entrada com Zod
- ✅ Proteção contra NoSQL Injection via Prisma
- ✅ CORS configurado

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev                    # Executar em modo desenvolvimento

# Prisma
npx prisma generate            # Gerar Prisma Client
npx prisma db push             # Sincronizar schema
npx prisma studio              # Interface visual do banco

# Linter/Formatador
npx biome check .              # Verificar código
npx biome format --write .     # Formatar código
```

---

## 🧪 Testando a API

### Usando cURL

```bash
# Health Check
curl http://localhost:3001/api/health

# Listar categorias
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:3001/api/categories
```

### Usando Postman/Insomnia

1. Importar collection (se disponível)
2. Configurar variável `{{token}}` com seu token Firebase
3. Testar endpoints

---

## 📝 Variáveis de Ambiente

| Variável                | Descrição                    | Exemplo                 |
| ----------------------- | ---------------------------- | ----------------------- |
| `PORT`                  | Porta do servidor            | `3001`                  |
| `NODE_ENV`              | Ambiente de execução         | `dev`, `test`, `prod`   |
| `DATABASE_URL`          | Connection string do MongoDB | `mongodb+srv://...`     |
| `FIREBASE_PROJECT_ID`   | ID do projeto Firebase       | `ContaZero-123`         |
| `FIREBASE_PRIVATE_KEY`  | Chave privada Firebase       | `-----BEGIN...`         |
| `FIREBASE_CLIENT_EMAIL` | Email do service account     | `firebase-adminsdk@...` |

---

## 🐛 Resolução de Problemas

### ❌ Erro: "Token de autorização não fornecido"

**Solução:** Adicionar header `Authorization: Bearer <token>`

### ❌ Erro: "DATABASE_URL é obrigatório"

**Solução:** Verificar arquivo `.env` e adicionar `DATABASE_URL`

### ❌ Erro: "Cannot find module 'prisma'"

**Solução:** Executar `npx prisma generate`

### ❌ Erro: "Firebase Admin não inicializado"

**Solução:** Verificar credenciais do Firebase no `.env`

---

## 📈 Roadmap

- [ ] Testes automatizados (Vitest)
- [ ] Documentação Swagger/OpenAPI
- [ ] Paginação em listagens
- [ ] Soft delete de transações
- [ ] Cache com Redis
- [ ] Export de dados (CSV, PDF)
- [ ] Webhooks
- [ ] Suporte a múltiplas moedas

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença **ISC**.

---

## 👨‍💻 Autor

**ContaZero Project**

- Projeto educacional de API de gestão financeira
- Desenvolvido com TypeScript, Fastify e Prisma

---

## 🙏 Agradecimentos

- [Fastify](https://fastify.dev/) - Framework rápido e eficiente
- [Prisma](https://www.prisma.io/) - ORM moderno
- [Firebase](https://firebase.google.com/) - Autenticação
- [Zod](https://zod.dev/) - Validação de schemas

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte a [documentação completa](./docs/DOCUMENTACAO.md)
2. Verifique a [arquitetura](./docs/ARQUITETURA.md)
3. Consulte o [guia rápido](./docs/GUIA-RAPIDO.md)
4. Veja o [glossário de termos](./docs/GLOSSARIO.md)

---

<div align="center">

**Feito com ❤️ e TypeScript**

[⬆ Voltar ao topo](#-ContaZero-api)

</div>
