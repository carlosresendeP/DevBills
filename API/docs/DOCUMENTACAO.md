# 📚 Documentação Completa - DevBills API

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Banco de Dados](#banco-de-dados)
5. [Autenticação](#autenticação)
6. [Configurações](#configurações)
7. [Rotas da API](#rotas-da-api)
8. [Controllers](#controllers)
9. [Middlewares](#middlewares)
10. [Schemas e Validações](#schemas-e-validações)
11. [Serviços](#serviços)
12. [Como Executar](#como-executar)

---

## 🎯 Visão Geral

A **DevBills API** é uma aplicação backend desenvolvida em **TypeScript** com **Fastify** para gerenciamento de transações financeiras pessoais. A API permite que usuários autenticados criem, listem, filtrem e excluam transações de receitas e despesas, além de obter resumos financeiros e históricos.

### Principais Funcionalidades:
- ✅ Autenticação de usuários via Firebase Authentication
- ✅ Criação de transações (receitas e despesas)
- ✅ Listagem de transações com filtros avançados
- ✅ Resumo financeiro mensal (total de receitas, despesas e saldo)
- ✅ Histórico de transações com gráficos (6 meses)
- ✅ Categorias globais pré-definidas
- ✅ Exclusão de transações

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Fastify** - Framework web rápido e eficiente
- **Prisma** - ORM (Object-Relational Mapping) para banco de dados
- **MongoDB** - Banco de dados NoSQL

### Autenticação
- **Firebase Admin SDK** - Autenticação e verificação de tokens

### Validação
- **Zod** - Validação de schemas e tipos
- **zod-to-json-schema** - Conversão de schemas Zod para JSON Schema

### Utilitários
- **Day.js** - Manipulação de datas
- **dotenv** - Gerenciamento de variáveis de ambiente
- **CORS** - Controle de acesso entre origens

### Desenvolvimento
- **TSX** - Execução de TypeScript em modo watch
- **Biome** - Linter e formatador de código

---

## 📁 Estrutura do Projeto

```
API/
├── prisma/
│   └── schema.prisma              # Schema do banco de dados
├── src/
│   ├── config/
│   │   ├── env.ts                 # Validação de variáveis de ambiente
│   │   ├── firebase.ts            # Inicialização do Firebase Admin
│   │   └── prima.ts               # Conexão com Prisma/MongoDB
│   ├── controllers/
│   │   ├── catergory.controller.ts
│   │   └── transactions/
│   │       ├── createTransaction.controller.ts
│   │       ├── deleteTransaction.Controller.ts
│   │       ├── getHistoricalTransaction.controller.ts
│   │       ├── getTransactions.controller.ts
│   │       └── getTransactionsSummary.controller.ts
│   ├── middlewares/
│   │   └── auth.middlewares.ts    # Middleware de autenticação
│   ├── Routes/
│   │   ├── index.ts               # Rotas principais
│   │   ├── category.routes.ts     # Rotas de categorias
│   │   └── transation.routes.ts   # Rotas de transações
│   ├── schemas/
│   │   └── transaction.schema.ts  # Schemas de validação
│   ├── services/
│   │   └── globalCategories.service.ts  # Categorias globais
│   ├── types/
│   │   ├── category.types.ts
│   │   └── transactions.types.ts
│   ├── app.ts                     # Configuração do Fastify
│   └── server.ts                  # Inicialização do servidor
├── biome.json                     # Configuração do Biome
├── package.json
├── tsconfig.json
└── .env                           # Variáveis de ambiente
```

---

## 🗄️ Banco de Dados

### Tecnologia: MongoDB com Prisma ORM

### Modelos de Dados:

#### 1. **Category** (Categoria)
Representa as categorias de transações (ex: Alimentação, Transporte, Salário).

```prisma
model Category {
  id        String          
  name      String
  color     String          // Cor hexadecimal (#FF5733)
  type      transactionType // INCOME ou EXPENSE
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
  
  transactions Transaction[]
  
  @@unique([name, type])
}
```

**Campos:**
- `id`: Identificador único (ObjectId do MongoDB)
- `name`: Nome da categoria
- `color`: Cor em hexadecimal para representação visual
- `type`: Tipo da transação (INCOME ou EXPENSE)
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização
- `transactions`: Relacionamento com transações

**Índice único:** Combinação de `name` e `type` (não pode ter duas categorias "Alimentação" do tipo EXPENSE)

---

#### 2. **Transaction** (Transação)
Representa uma transação financeira do usuário.

```prisma
model Transaction {
  id          String          ***
  description String
  amount      Float           // Valor da transação
  date        DateTime        @default(now())
  type        transactionType // INCOME ou EXPENSE
  userId      String          // ID do usuário (Firebase Auth)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  
  categoryId String   @db.ObjectId
  categoty   Category @relation(fields: [categoryId], references: [id])
  
  @@index([userId, date])
  @@index([userId, date, categoryId])
}
```

**Campos:**
- `id`: Identificador único
- `description`: Descrição da transação
- `amount`: Valor monetário
- `date`: Data da transação
- `type`: Tipo (INCOME ou EXPENSE)
- `userId`: ID do usuário autenticado
- `categoryId`: ID da categoria relacionada
- `categoty`: Relacionamento com a categoria

**Índices:**
- `[userId, date]`: Otimização para consultas por usuário e data
- `[userId, date, categoryId]`: Otimização para filtros complexos

---

#### 3. **Enum transactionType**
```prisma
enum transactionType {
  INCOME   // Receita
  EXPENSE  // Despesa
}
```

---

## 🔐 Autenticação

### Firebase Authentication

A API utiliza **Firebase Admin SDK** para autenticação de usuários.

### Como Funciona:

1. **Frontend/Cliente** faz login com Firebase Authentication
2. Cliente recebe um **ID Token** do Firebase
3. Cliente envia o token no header `Authorization` das requisições
4. **Middleware de Autenticação** valida o token
5. Se válido, extrai o `userId` e anexa ao objeto `request`
6. Controllers usam o `userId` para operações no banco

### Middleware de Autenticação (`auth.middlewares.ts`)

```typescript
export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const authHeader = request.headers.authorization;
  
  // Verificar se o token foi fornecido
  if (!authHeader) {
    reply.status(401).send({ error: "Token de autorização não fornecido" });
    return;
  }

  // Extrair o token (com ou sem Bearer)
  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.replace("Bearer ", "") 
    : authHeader;

  try {
    // Verificar o token com o Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    request.userId = decodedToken.uid; // Adiciona o userId ao request
  } catch (error) {
    request.log.error("Erro ao verificar token", error);
    reply.status(401).send({ error: "Token inválido ou expirado" });
    return;
  }
};
```

**Fluxo:**
1. Extrai o token do header `Authorization`
2. Remove o prefixo "Bearer " se presente
3. Valida o token com Firebase Admin
4. Extrai o `uid` (ID do usuário) do token decodificado
5. Adiciona `userId` ao objeto `request`

**Respostas:**
- ✅ **200**: Token válido, `userId` adicionado ao request
- ❌ **401**: Token não fornecido, inválido ou expirado

---

## ⚙️ Configurações

### Variáveis de Ambiente (`.env`)

```env
# Servidor
PORT=3001
NODE_ENV=dev

# Banco de Dados
DATABASE_URL=

# Firebase
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
```

### Validação de Variáveis (`config/env.ts`)

Utiliza **Zod** para validar as variáveis de ambiente na inicialização:

```typescript
const envShema = z.object({
  PORT: z.string().transform(Number).default("3001"),
  DATABASE_URL: z.string().min(5, "DATABASE_URL é obrigatório"),
  NODE_ENV: z.enum(["dev", "test", "prod"]),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
});
```

Se alguma variável obrigatória estiver faltando, o processo é encerrado com erro.

---

## 🚀 Rotas da API

### Base URL
```
http://localhost:3001/api
```

### Health Check
```http
GET /api/health
```

**Resposta:**
```json
{
  "status": "ok",
  "message": "Servidor está ativo e funcionando corretamente!"
}
```

---

### 📂 Categorias

#### Listar Categorias
```http
GET /api/categories
```

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
[
  {
    "id": "***",
    "name": "Alimentação",
    "color": "#FF5733",
    "type": "EXPENSE",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  },
  {
    "id": "***",
    "name": "Salário",
    "color": "#33FF57",
    "type": "INCOME",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
]
```

**Erros:**
- **401**: Token não fornecido ou inválido
- **500**: Erro ao buscar categorias

---

### 💰 Transações

#### 1. Criar Transação
```http
POST /api/transactions
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "description": "Compra no supermercado",
  "amount": 150.50,
  "date": "2025-10-20",
  "categoryId": "***",
  "type": "EXPENSE"
}
```

**Resposta (201):**
```json
{
  "id": "***",
  "description": "Compra no supermercado",
  "amount": 150.50,
  "date": "2025-10-20T00:00:00Z",
  "type": "EXPENSE",
  "userId": "***",
  "categoryId": "***",
  "categoty": {
    "id": "***",
    "name": "Alimentação",
    "color": "#FF5733",
    "type": "EXPENSE"
  },
  "createdAt": "2025-10-26T10:00:00Z",
  "updatedAt": "2025-10-26T10:00:00Z"
}
```

**Erros:**
- **400**: Dados inválidos ou categoria inválida
- **401**: Usuário não autenticado

---

#### 2. Listar Transações (com filtros)
```http
GET /api/transactions?month=10&year=2025&type=EXPENSE&categoryId=***
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params (opcionais):**
- `month`: Mês (1-12)
- `year`: Ano (ex: 2025)
- `type`: INCOME ou EXPENSE
- `categoryId`: ID da categoria

**Resposta (200):**
```json
[
  {
    "id": "***",
    "description": "Compra no supermercado",
    "amount": 150.50,
    "date": "2025-10-20T00:00:00Z",
    "type": "EXPENSE",
    "userId": "firebase-user-id-123",
    "categoryId": "507f1f77bcf86cd799439011",
    "categoty": {
      "name": "Alimentação",
      "color": "#FF5733",
      "type": "EXPENSE"
    }
  }
]
```

---

#### 3. Resumo Financeiro Mensal
```http
GET /api/transactions/summary?month=10&year=2025
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params (obrigatórios):**
- `month`: Mês (1-12)
- `year`: Ano (ex: 2025)

**Resposta (200):**
```json
{
  "totalExpenses": 850.75,
  "totalIncomes": 3500.00,
  "totalBalance": 2649.25,
  "expensesByCategory": [
    {
      "categoryId": "***",
      "categoryName": "Alimentação",
      "categoryColor": "#FF5733",
      "amount": 450.50,
      "percentage": 52.95
    },
    {
      "categoryId": "***",
      "categoryName": "Transporte",
      "categoryColor": "#33A8FF",
      "amount": 200.00,
      "percentage": 23.51
    },
    {
      "categoryId": "***",
      "categoryName": "Lazer",
      "categoryColor": "#FFBA33",
      "amount": 200.25,
      "percentage": 23.54
    }
  ]
}
```

**Explicação dos campos:**
- `totalExpenses`: Soma de todas as despesas do mês
- `totalIncomes`: Soma de todas as receitas do mês
- `totalBalance`: Saldo (receitas - despesas)
- `expensesByCategory`: Array com despesas agrupadas por categoria
  - `amount`: Total gasto na categoria
  - `percentage`: Percentual do total de despesas

---

#### 4. Histórico de Transações (Gráfico)
```http
GET /api/transactions/historical?month=10&year=2025&months=6
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
- `month`: Mês base (1-12) - **obrigatório**
- `year`: Ano base (ex: 2025) - **obrigatório**
- `months`: Quantidade de meses retroativos (1-12, padrão: 6) - **opcional**

**Resposta (200):**
```json
{
  "history": [
    {
      "name": "mai/2025",
      "INCOME": 3500.00,
      "EXPENSES": 1200.50
    },
    {
      "name": "jun/2025",
      "INCOME": 3500.00,
      "EXPENSES": 980.75
    },
    {
      "name": "jul/2025",
      "INCOME": 4000.00,
      "EXPENSES": 1500.00
    },
    {
      "name": "ago/2025",
      "INCOME": 3500.00,
      "EXPENSES": 1100.00
    },
    {
      "name": "set/2025",
      "INCOME": 3500.00,
      "EXPENSES": 1350.25
    },
    {
      "name": "out/2025",
      "INCOME": 3500.00,
      "EXPENSES": 850.75
    }
  ]
}
```

**Como funciona:**
- Retorna dados dos últimos N meses (padrão 6)
- Agrupa receitas e despesas por mês
- Formato ideal para criar gráficos de linha/barra
- Útil para visualizar tendências financeiras

---

#### 5. Deletar Transação
```http
DELETE /api/transactions/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Params:**
- `id`: ID da transação (ObjectId do MongoDB)

**Resposta (200):**
```json
{
  "message": "Transação deletada com sucesso"
}
```

**Erros:**
- **400**: ID da transação inválido
- **401**: Usuário não autenticado
- **500**: Erro ao deletar transação

---

## 🎮 Controllers

### 1. Category Controller (`catergory.controller.ts`)

#### `getCategories`
**Responsabilidade:** Buscar todas as categorias do banco de dados

**Lógica:**
1. Busca todas as categorias no banco
2. Ordena por nome em ordem alfabética
3. Retorna array de categorias

**Código:**
```typescript
export const getCategories = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" }
    });
    reply.send(categories);
  } catch (err) {
    request.log.error("Erro ao buscar categorias", err);
    reply.status(500).send({ error: "erro ao buscar categorias" });
  }
};
```

---

### 2. Transaction Controllers

#### `createTransaction.controller.ts`
**Responsabilidade:** Criar uma nova transação

**Fluxo:**
1. Valida se o usuário está autenticado (`userId`)
2. Valida os dados da requisição usando schema Zod
3. Verifica se a categoria existe e corresponde ao tipo da transação
4. Converte a data para objeto Date
5. Cria a transação no banco
6. Retorna a transação criada com a categoria relacionada

**Validações:**
- Descrição: obrigatória
- Valor: deve ser positivo
- Data: formato válido
- CategoryId: ObjectId válido
- Type: INCOME ou EXPENSE

---

#### `getTransactions.controller.ts`
**Responsabilidade:** Buscar transações com filtros opcionais

**Filtros disponíveis:**
- `month` e `year`: Filtra transações de um mês específico
- `type`: Filtra por INCOME ou EXPENSE
- `categoryId`: Filtra por categoria

**Lógica:**
1. Valida autenticação
2. Constrói objeto de filtros dinamicamente
3. Se mês e ano fornecidos:
   - Calcula primeiro dia do mês (startDate)
   - Calcula último dia do mês (endDate)
   - Adiciona filtro de data (`gte` e `lte`)
4. Busca transações no banco
5. Ordena por data (mais recentes primeiro)
6. Inclui dados da categoria relacionada
7. Retorna array de transações

**Uso do Day.js:**
```typescript
const startDate = dayjs.utc(`${year}-${month}-01`)
  .startOf("month")
  .toDate();
const endDate = dayjs.utc(startDate)
  .endOf("month")
  .toDate();
```

---

#### `getTransactionsSummary.controller.ts`
**Responsabilidade:** Calcular resumo financeiro mensal

**Algoritmo:**
1. Valida autenticação
2. Valida que mês e ano foram fornecidos
3. Calcula período do mês
4. Busca todas as transações do usuário nesse período
5. **Processa transações:**
   - Para cada EXPENSE:
     - Agrupa por categoria usando Map
     - Soma valores por categoria
     - Soma total de despesas
   - Para cada INCOME:
     - Soma total de receitas
6. **Calcula percentuais:**
   - Para cada categoria: `(valorCategoria / totalDespesas) * 100`
7. **Ordena categorias:** Do maior gasto para o menor
8. Retorna resumo completo

**Estrutura de Dados:**
```typescript
type TrasactionSummary = {
  totalExpenses: number;
  totalIncomes: number;
  totalBalance: number;
  expensesByCategory: CategotySummary[];
}

type CategotySummary = {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  percentage: number;
}
```

**Por que usar Map?**
- Agrupa eficientemente despesas por categoria
- Permite atualização dinâmica dos valores
- Conversão fácil para array com `Array.from(map.values())`

---

#### `getHistoricalTransaction.controller.ts`
**Responsabilidade:** Gerar histórico de transações para gráficos

**Parâmetros:**
- `month`: Mês base
- `year`: Ano base
- `months`: Quantidade de meses retroativos (padrão: 6)

**Algoritmo:**
1. Valida autenticação
2. Calcula período:
   - `startDate`: N meses antes do mês base
   - `endDate`: Último dia do mês base
3. Busca todas as transações nesse período
4. **Cria array de meses:**
   ```typescript
   const monthlyData = Array.from({ length: months }, (_, i) => {
     const date = dayjs.utc(baseDate).subtract(months - 1 - i, "month");
     return {
       name: date.format("MMM/YYYY"), // ex: "out/2025"
       INCOME: 0,
       EXPENSES: 0,
     };
   });
   ```
5. **Preenche dados:**
   - Para cada transação, identifica o mês (formato: "MMM/YYYY")
   - Encontra o mês correspondente no array
   - Soma o valor no campo INCOME ou EXPENSES
6. Retorna histórico formatado

**Exemplo de período:**
- Mês base: outubro/2025, months: 6
- Período: maio/2025 até outubro/2025

---

#### `deleteTransaction.Controller.ts`
**Responsabilidade:** Deletar uma transação

**Validações:**
1. Verifica se usuário está autenticado
2. Busca transação por ID e userId (segurança)
3. Se não encontrada, retorna erro 400
4. Deleta transação
5. Retorna mensagem de sucesso

**Segurança:**
- Sempre valida que a transação pertence ao usuário logado
- Evita que um usuário delete transações de outro

---

## 🛡️ Middlewares

### `authMiddleware` (`auth.middlewares.ts`)

**Função:** Validar autenticação em rotas protegidas

**Como usar:**
```typescript
// Aplicar em todas as rotas de um grupo
fastify.addHook('preHandler', authMiddleware);

// Ou em uma rota específica
fastify.get('/rota-protegida', { preHandler: authMiddleware }, handler);
```

**Extensão do FastifyRequest:**
```typescript
declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}
```
Permite adicionar propriedade `userId` ao objeto request.

---

## ✅ Schemas e Validações

### Biblioteca: Zod

#### Por que Zod?
- Validação em tempo de execução
- Inferência automática de tipos TypeScript
- Mensagens de erro personalizadas
- Integração com Fastify via `zod-to-json-schema`

---

### Schemas de Transação (`transaction.schema.ts`)

#### 1. `createTransactionSchema`
```typescript
export const createTransactionSchema = z.object({
  description: z.string().min(1, "Descrição Obrigatória"),
  amount: z.number().positive("Valor deve ser positivo"),
  date: z.coerce.date({ errorMap: () => ({ message: "Data inválida" }) }),
  categoryId: z.string().refine(isValidObjectId, { message: "Categoria inválido" }),
  type: z.enum([transactionType.EXPENSE, transactionType.INCOME], {
    errorMap: () => ({ message: "Tipo Invalido" }),
  }),
});
```

**Validações:**
- `description`: String não vazia
- `amount`: Número positivo
- `date`: Data válida (com coerção de string para Date)
- `categoryId`: ObjectId válido do MongoDB
- `type`: Apenas INCOME ou EXPENSE

---

#### 2. `getTransactionSchema`
```typescript
export const getTransactionSchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
  type: z.enum([transactionType.EXPENSE, transactionType.INCOME]).optional(),
  categoryId: z.string().refine(isValidObjectId).optional(),
});
```

**Todos os campos são opcionais** para permitir filtros flexíveis.

---

#### 3. `getTransactionSummarySchema`
```typescript
export const getTransactionSummarySchema = z.object({
  month: z.string({ message: "O mes é obrigatório" }),
  year: z.string({ message: "O ano é obrigatório" }),
});
```

**Campos obrigatórios:** Mês e ano são necessários para calcular o resumo.

---

#### 4. `getHistoricalTransactionSchema`
```typescript
export const getHistoricalTransactionSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  months: z.coerce.number().min(1).max(12).optional(),
});
```

**Validações:**
- `month`: Número entre 1 e 12
- `year`: Número entre 2000 e 2100
- `months`: Número entre 1 e 12 (padrão: 6)
- `coerce`: Converte strings para números automaticamente

---

#### 5. `deleteTransactionSchema`
```typescript
export const deleteTransactionSchema = z.object({
  id: z.string().refine(isValidObjectId, { message: "Id inválido" }),
});
```

**Validação personalizada:**
```typescript
const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);
```

---

### Uso nos Controllers

```typescript
const result = createTransactionSchema.safeParse(request.body);

if (!result.success) {
  const errorMessage = result.error.errors[0].message;
  reply.status(400).send({ error: errorMessage });
  return;
}

const transaction = result.data; // Dados validados e tipados
```

---

### Uso nas Rotas (JSON Schema)

```typescript
fastify.route({
  method: "POST",
  url: "/",
  schema: {
    body: zodToJsonSchema(createTransactionSchema)
  },
  handler: createTrasaction
});
```

**Benefícios:**
- Validação automática pelo Fastify
- Documentação automática da API
- Mensagens de erro padronizadas

---

## 🔧 Serviços

### `globalCategories.service.ts`

**Responsabilidade:** Inicializar categorias globais no banco de dados

#### Categorias Pré-definidas:

**Despesas (EXPENSE):**
1. Alimentação (#FF5733)
2. Transporte (#33A8FF)
3. Moradia (#33FF57)
4. Saúde (#F033FF)
5. Educação (#FF3366)
6. Lazer (#FFBA33)
7. Compras (#33FFF6)
8. Outros (#B033FF)

**Receitas (INCOME):**
1. Salário (#33FF57)
2. Freelance (#33A8FF)
3. Investimentos (#FFBA33)
4. Outros (#B033FF)

#### Função `inializeGlobalCategories`

**Algoritmo:**
1. Para cada categoria na lista:
2. Verifica se já existe no banco (nome + tipo)
3. Se NÃO existir:
   - Cria nova categoria
   - Log: "✅ Criada a [nome]"
4. Se existir:
   - Usa a existente
5. Adiciona ao array de retorno
6. Retorna todas as categorias

**Quando é executada:**
- No `server.ts`, durante a inicialização do servidor
- Antes do servidor começar a aceitar requisições

**Por que usar `Pick`?**
```typescript
type GlobalCategoryInput = Pick<Category, "name" | "color" | "type">;
```
- Extrai apenas os campos necessários do tipo Category
- Evita precisar definir campos como `id`, `createdAt`, `updatedAt`

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- MongoDB Atlas (ou instância local do MongoDB)
- Conta Firebase com projeto configurado

---

### 1. Instalação

```bash
# Clonar o repositório (se aplicável)
git clone <url-do-repositorio>

# Navegar para a pasta do projeto
cd API

# Instalar dependências
npm install
```

---

### 2. Configuração do Banco de Dados

#### MongoDB Atlas (Recomendado)

1. Criar conta em [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Criar novo cluster
3. Criar database user
4. Obter connection string
5. Substituir `<password>` pela senha do usuário

**Exemplo de connection string:**
```
mongodb+srv://devbills:senha123@cluster0.xxxxx.mongodb.net/devbills
```

---

### 3. Configuração do Firebase

1. Acessar [console.firebase.google.com](https://console.firebase.google.com)
2. Criar novo projeto
3. Ativar Authentication
4. Ir em Project Settings > Service Accounts
5. Gerar nova chave privada (arquivo JSON)
6. Extrair as credenciais:
   - `project_id`
   - `private_key`
   - `client_email`

---

### 4. Configurar Variáveis de Ambiente

Criar arquivo `.env` na raiz:

```env
PORT=3001
NODE_ENV=dev
DATABASE_URL=***

FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY=**
FIREBASE_CLIENT_EMAIL=***
```

**⚠️ IMPORTANTE:**
- A chave privada deve estar entre aspas duplas
- Manter os `\n` na chave privada

---

### 5. Configurar Prisma

```bash
# Gerar Prisma Client
npx prisma generate

# Sincronizar schema com o banco (desenvolvimento)
npx prisma db push
```

---

### 6. Executar o Servidor

```bash
# Modo desenvolvimento (com hot reload)
npm run dev
```

**Saída esperada:**
```
✅ Conectado ao banco de dados
✅ Criada a Alimentação
✅ Criada a Transporte
...
TODAS as categorias inicializadas
🚀 Firebase Admin inicializado com sucesso
Servidor está ativo na porta http://localhost:3001
```

---

### 7. Testar a API

#### Usando cURL:

```bash
# Health Check
curl http://localhost:3001/api/health

# Listar categorias (requer token)
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  http://localhost:3001/api/categories
```

#### Usando Postman/Insomnia:

1. Criar nova requisição
2. Adicionar header `Authorization: Bearer <token>`
3. Testar endpoints

---

## 📊 Fluxo Completo da Aplicação

### 1. Inicialização do Servidor

```
server.ts (ponto de entrada)
    ↓
initalizeFirebaseAdmin() - Inicializa Firebase Admin
    ↓
prismaConnect() - Conecta ao MongoDB via Prisma
    ↓
inializeGlobalCategories() - Cria categorias padrão
    ↓
app.listen() - Inicia servidor Fastify na porta 3001
```

---

### 2. Requisição para Criar Transação

```
Cliente envia POST /api/transactions com token
    ↓
Fastify recebe requisição
    ↓
authMiddleware valida token Firebase
    ↓
Extrai userId e adiciona ao request
    ↓
Fastify valida body com createTransactionSchema
    ↓
createTrasaction controller é executado
    ↓
Valida categoria existe e corresponde ao tipo
    ↓
Cria transação no MongoDB via Prisma
    ↓
Retorna transação criada com categoria
```

---

### 3. Requisição para Resumo Mensal

```
Cliente envia GET /api/transactions/summary?month=10&year=2025
    ↓
authMiddleware valida token
    ↓
Fastify valida querystring com getTransactionSummarySchema
    ↓
getTransactionsSummary controller é executado
    ↓
Calcula período do mês com Day.js
    ↓
Busca todas as transações do período
    ↓
Agrupa despesas por categoria usando Map
    ↓
Calcula totais e percentuais
    ↓
Ordena categorias por valor
    ↓
Retorna resumo completo
```

---

## 🔍 Boas Práticas Implementadas

### 1. **Separação de Responsabilidades**
- Controllers: Lógica de negócio
- Middlewares: Autenticação e validação
- Services: Operações auxiliares
- Schemas: Validação de dados
- Types: Tipagem TypeScript

### 2. **Validação em Múltiplas Camadas**
- Variáveis de ambiente (Zod)
- Requisições HTTP (Zod + Fastify)
- Dados do banco (Prisma)

### 3. **Segurança**
- Autenticação obrigatória em rotas sensíveis
- Validação de propriedade (usuário só acessa suas transações)
- Validação de ObjectIds para prevenir injeções

### 4. **Tratamento de Erros**
- Try/catch em todos os controllers
- Logs de erro com Fastify logger
- Mensagens de erro descritivas

### 5. **Performance**
- Índices no banco de dados
- Uso de Map para agregações
- Queries otimizadas com Prisma

### 6. **Manutenibilidade**
- Código TypeScript tipado
- Comentários explicativos
- Estrutura de pastas organizada
- Uso de enums para valores fixos

---

## 🐛 Problemas Comuns e Soluções

### 1. Erro: "Token de autorização não fornecido"
**Causa:** Header Authorization não enviado ou mal formatado

**Solução:**
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6...
```

---

### 2. Erro: "Categoria inválido"
**Causa:** CategoryId não é um ObjectId válido do MongoDB

**Solução:**
- Usar um ID de categoria válido
- Formato: 24 caracteres hexadecimais
- Exemplo: `507f1f77bcf86cd799439011`

---

### 3. Erro: "DATABASE_URL é obrigatório"
**Causa:** Variável de ambiente não configurada

**Solução:**
- Criar arquivo `.env`
- Adicionar `DATABASE_URL=mongodb+srv://...`

---

### 4. Erro: "Firebase Admin não inicializado"
**Causa:** Credenciais do Firebase faltando ou inválidas

**Solução:**
- Verificar `.env`:
  ```
  FIREBASE_PROJECT_ID=...
  FIREBASE_PRIVATE_KEY="-----BEGIN..."
  FIREBASE_CLIENT_EMAIL=...
  ```
- Garantir que a chave privada está entre aspas duplas

---

### 5. Erro: "Cannot find module 'prisma'"
**Causa:** Prisma Client não foi gerado

**Solução:**
```bash
npx prisma generate
```

---

## 📝 Tipos TypeScript

### Transaction Types (`transactions.types.ts`)

```typescript
export type transactionFilter = {
  userId: string;
  date?: {
    gte: Date;
    lte: Date;
  };
  type?: transactionType;
  categoryId?: string;
};

export type TrasactionSummary = {
  totalExpenses: number;
  totalIncomes: number;
  totalBalance: number;
  expensesByCategory: CategotySummary[];
};
```

### Category Types (`category.types.ts`)

```typescript
export type CategotySummary = {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  percentage: number;
};
```

---

## 🎓 Conceitos Técnicos Explicados

### 1. **ORM (Prisma)**
Object-Relational Mapping - mapeia objetos TypeScript para documentos do MongoDB.

**Sem Prisma:**
```typescript
const result = await db.collection('transactions').insertOne({...});
```

**Com Prisma:**
```typescript
const result = await prisma.transaction.create({ data: {...} });
```

---

### 2. **Middleware no Fastify**
Funções executadas antes do handler principal.

```typescript
// Adicionar a todas as rotas de um grupo
fastify.addHook('preHandler', authMiddleware);
```

---

### 3. **Zod Schema → TypeScript Type**
Inferência automática de tipos:

```typescript
const schema = z.object({
  name: z.string(),
  age: z.number()
});

type Person = z.infer<typeof schema>;
// Equivale a: { name: string; age: number }
```

---

### 4. **Day.js UTC**
Manipulação consistente de datas em UTC:

```typescript
dayjs.utc("2025-10-01")  // Data em UTC
  .startOf("month")       // Primeiro dia do mês 00:00:00
  .toDate()               // Converte para Date do JavaScript
```

---

### 5. **Map para Agregação**
Estrutura de dados chave-valor:

```typescript
const map = new Map<string, number>();
map.set("key1", 100);
map.set("key1", 200); // Sobrescreve
const value = map.get("key1"); // 200
```

---

## 📦 Dependências Principais

| Pacote | Versão | Uso |
|--------|--------|-----|
| fastify | 5.3.3 | Framework web |
| @prisma/client | 6.9.0 | ORM para banco de dados |
| firebase-admin | 13.5.0 | Autenticação |
| zod | 3.25.64 | Validação de dados |
| dayjs | 1.11.13 | Manipulação de datas |
| typescript | 5.8.3 | Linguagem |

---

## 🎯 Próximos Passos (Melhorias Futuras)

1. **Testes Automatizados**
   - Testes unitários com Vitest
   - Testes de integração

2. **Documentação Swagger**
   - Gerar documentação automática da API
   - Interface visual para testar endpoints

3. **Paginação**
   - Adicionar limit/offset nas listagens
   - Melhorar performance com muitos dados

4. **Soft Delete**
   - Não deletar transações permanentemente
   - Adicionar campo `deletedAt`

5. **Cache**
   - Redis para resumos mensais
   - Reduzir carga no banco

6. **Webhooks**
   - Notificações de novas transações
   - Integração com outros sistemas

7. **Export de Dados**
   - Exportar transações em CSV/Excel
   - Relatórios em PDF

---

## 👨‍💻 Autor

**DevBills Project**
- Projeto educacional de API de gestão financeira
- Desenvolvido com TypeScript, Fastify e Prisma

---

## 📄 Licença

ISC

---

## 🆘 Suporte

Para dúvidas e problemas:
1. Verificar esta documentação
2. Consultar logs do servidor
3. Verificar configuração do `.env`
4. Testar conexão com MongoDB
5. Validar token do Firebase

---

**Data da documentação:** 26 de outubro de 2025
**Versão da API:** 1.0.0
