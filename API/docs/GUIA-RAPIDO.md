# 🚀 Guia Rápido - DevBills API

## ⚡ Início Rápido

### 1. Instalação
```bash
npm install
```

### 2. Configurar `.env`
```env
PORT=3001
NODE_ENV=dev
DATABASE_URL=
FIREBASE_PROJECT_ID=seu-projeto
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
```

### 3. Configurar Prisma
```bash
npx prisma generate
npx prisma db push
```

### 4. Executar
```bash
npm run dev
```

---

## 📍 Endpoints Principais

### Base URL
```

```

### Health Check
```http
GET /api/health
```

---

## 🔐 Autenticação

Todas as rotas (exceto `/health`) requerem token Firebase:

```http
Authorization: Bearer ***
```

---

## 📂 Categorias

### Listar Categorias
```http
GET /api/categories
Authorization: Bearer <token>
```

**Resposta:**
```json
[
  {
    "id": "",
    "name": "Alimentação",
    "color": "#FF5733",
    "type": "EXPENSE"
  }
]
```

---

## 💰 Transações

### 1. Criar Transação
```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Compra no supermercado",
  "amount": 150.50,
  "date": "2025-10-20",
  "categoryId": "**",
  "type": "EXPENSE"
}
```

---

### 2. Listar Transações (com filtros)
```http
GET /api/transactions?month=10&year=2025&type=EXPENSE
Authorization: Bearer <token>
```

**Filtros (opcionais):**
- `month`: 1-12
- `year`: Ex: 2025
- `type`: INCOME ou EXPENSE
- `categoryId`: ObjectId da categoria

---

### 3. Resumo Mensal
```http
GET /api/transactions/summary?month=10&year=2025
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "totalExpenses": 850.75,
  "totalIncomes": 3500.00,
  "totalBalance": 2649.25,
  "expensesByCategory": [
    {
      "categoryId": "507f...",
      "categoryName": "Alimentação",
      "categoryColor": "#FF5733",
      "amount": 450.50,
      "percentage": 52.95
    }
  ]
}
```

---

### 4. Histórico (para gráficos)
```http
GET /api/transactions/historical?month=10&year=2025&months=6
Authorization: Bearer <token>
```

**Parâmetros:**
- `month`: Mês base (1-12) - **obrigatório**
- `year`: Ano base - **obrigatório**
- `months`: Quantidade de meses retroativos (padrão: 6)

**Resposta:**
```json
{
  "history": [
    { "name": "mai/2025", "INCOME": 3500, "EXPENSES": 1200 },
    { "name": "jun/2025", "INCOME": 3500, "EXPENSES": 980 },
    { "name": "jul/2025", "INCOME": 4000, "EXPENSES": 1500 }
  ]
}
```

---

### 5. Deletar Transação
```http
DELETE /api/transactions/:id
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "message": "Transação deletada com sucesso"
}
```

---

## 🔧 Comandos Úteis

### Prisma
```bash
# Gerar cliente Prisma
npx prisma generate

# Sincronizar schema com banco
npx prisma db push

# Abrir Prisma Studio (interface visual)
npx prisma studio

# Visualizar schema
npx prisma format
```

### Desenvolvimento
```bash
# Executar em modo dev (hot reload)
npm run dev

# Verificar código com Biome
npx biome check .

# Formatar código
npx biome format --write .
```

---

## 🐛 Resolver Problemas Comuns

### ❌ "Token de autorização não fornecido"
**Solução:** Adicionar header `Authorization: Bearer <token>`

### ❌ "DATABASE_URL é obrigatório"
**Solução:** Criar arquivo `.env` com `DATABASE_URL=...`

### ❌ "Cannot find module 'prisma'"
**Solução:** Executar `npx prisma generate`

### ❌ "Categoria inválido"
**Solução:** Usar um ObjectId válido (24 caracteres hexadecimais)

### ❌ "Firebase Admin não inicializado"
**Solução:** Verificar credenciais Firebase no `.env`

---

## 📊 Tipos de Transação

```typescript
enum transactionType {
  INCOME   // Receita
  EXPENSE  // Despesa
}
```

---

## 🎨 Categorias Padrão

### Despesas (EXPENSE)
- Alimentação
- Transporte
- Moradia
- Saúde
- Educação
- Lazer
- Compras
- Outros

### Receitas (INCOME)
- Salário
- Freelance
- Investimentos
- Outros

---

## 📝 Estrutura de Pastas

```
API/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/          # Configurações (env, firebase, prisma)
│   ├── controllers/     # Lógica de negócio
│   ├── middlewares/     # Autenticação
│   ├── Routes/          # Definição de rotas
│   ├── schemas/         # Validação com Zod
│   ├── services/        # Serviços auxiliares
│   ├── types/           # Tipos TypeScript
│   ├── app.ts           # Configuração Fastify
│   └── server.ts        # Inicialização
├── .env                 # Variáveis de ambiente
└── package.json
```

---

## 🔑 Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 500 | Erro no servidor |

---

## 💡 Dicas

1. **Sempre use UTC** para datas
2. **Valide ObjectIds** antes de enviar para API
3. **Guarde o token** Firebase para não precisar fazer login toda vez
4. **Use filtros** para otimizar buscas
5. **Consulte logs** do servidor em caso de erro

---

## 📚 Documentação Completa

Para mais detalhes, consulte: [`DOCUMENTACAO.md`](./DOCUMENTACAO.md)

---

**Versão:** 1.0.0
**Última atualização:** 26/10/2025
