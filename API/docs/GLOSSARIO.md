# 📖 Glossário de Termos Técnicos - DevBills API

> Explicação de termos técnicos, conceitos e tecnologias usadas no projeto.

---

## 🔤 A

### API (Application Programming Interface)

Interface que permite a comunicação entre diferentes sistemas de software. No DevBills, é uma API REST que permite ao frontend interagir com o backend.

**Exemplo:** Quando o app móvel quer listar transações, ele faz uma requisição HTTP para a API.

---

### Authentication (Autenticação)

Processo de verificar a identidade de um usuário. No projeto, usa Firebase Authentication.

**Exemplo:** Quando você faz login, o sistema verifica se suas credenciais estão corretas.

---

### Authorization (Autorização)

Processo de verificar se um usuário autenticado tem permissão para acessar um recurso.

**Exemplo:** Mesmo autenticado, você só pode ver suas próprias transações, não as de outros usuários.

---

## 🔤 B

### Backend

Parte do sistema que roda no servidor e processa lógica de negócio, banco de dados, etc.

**No projeto:** A API Fastify que processa transações, valida dados e acessa o banco.

---

### Bearer Token

Tipo de token de autenticação enviado no header HTTP com prefixo "Bearer ".

**Exemplo:** `Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6...`

---

### Biome

Ferramenta moderna para linting e formatação de código JavaScript/TypeScript.

**Uso no projeto:** Mantém o código formatado e identifica problemas.

---

## 🔤 C

### CORS (Cross-Origin Resource Sharing)

Mecanismo que permite ou bloqueia requisições de diferentes origens (domínios).

**No projeto:** Configurado no Fastify para permitir que o frontend acesse a API.

---

### Controller

Camada responsável pela lógica de negócio, processar requisições e retornar respostas.

**Exemplo:** `createTransaction.controller.ts` - cria uma nova transação no banco.

---

### Coercion (Coerção)

Conversão automática de um tipo de dado para outro.

**Exemplo Zod:** `z.coerce.number()` converte string "123" para número 123.

---

## 🔤 D

### Day.js

Biblioteca JavaScript leve para manipulação de datas e horas.

**Uso no projeto:** Calcular períodos, formatar datas, trabalhar com UTC.

**Exemplo:**

```typescript
dayjs.utc("2025-10-01").startOf("month").toDate();
// Retorna: 1º de outubro de 2025, 00:00:00 UTC
```

---

### DTO (Data Transfer Object)

Objeto usado para transferir dados entre camadas da aplicação.

**No projeto:** Schemas Zod definem DTOs para validação.

---

### Dotenv

Biblioteca que carrega variáveis de ambiente de um arquivo `.env`.

**Uso:** Configurar DATABASE_URL, FIREBASE_PROJECT_ID, etc.

---

## 🔤 E

### Enum (Enumeração)

Tipo que define um conjunto fixo de valores possíveis.

**Exemplo no projeto:**

```typescript
enum transactionType {
  INCOME   // Receita
  EXPENSE  // Despesa
}
```

---

### Environment Variables (Variáveis de Ambiente)

Valores configuráveis fora do código (arquivo `.env`).

**Benefício:** Mudar configurações sem alterar código (senhas, URLs, etc.).

---

## 🔤 F

### Fastify

Framework web Node.js focado em alta performance e baixo overhead.

**Vantagens:** Mais rápido que Express, validação de schemas integrada, suporte a TypeScript.

---

### Firebase Authentication

Serviço do Google para autenticação de usuários (login, registro, OAuth).

**No projeto:** Valida tokens JWT e gerencia usuários.

---

### Firebase Admin SDK

Biblioteca para usar serviços Firebase no backend (verificar tokens, gerenciar usuários).

**Uso:** `admin.auth().verifyIdToken(token)` - valida token do cliente.

---

## 🔤 H

### HTTP Methods (Métodos HTTP)

Verbos que definem o tipo de operação em uma requisição.

| Método    | Uso                |
| --------- | ------------------ |
| GET       | Buscar dados       |
| POST      | Criar novo recurso |
| PUT/PATCH | Atualizar recurso  |
| DELETE    | Deletar recurso    |

---

### Header (Cabeçalho HTTP)

Metadados enviados em requisições/respostas HTTP.

**Exemplo:**

```
Authorization: Bearer token123
Content-Type: application/json
```

---

## 🔤 J

### JSON (JavaScript Object Notation)

Formato de dados leve e legível usado para troca de informações.

**Exemplo:**

```json
{
  "name": "Alimentação",
  "amount": 150.5,
  "type": "EXPENSE"
}
```

---

### JWT (JSON Web Token)

Token compacto e seguro para transmitir informações entre partes.

**Estrutura:** `header.payload.signature`

**No projeto:** Firebase retorna JWTs para autenticar usuários.

---

## 🔤 M

### Middleware

Função executada entre a requisição e o handler final.

**No projeto:** `authMiddleware` valida token antes de processar requisição.

**Fluxo:**

```
Requisição → Middleware → Controller → Resposta
```

---

### MongoDB

Banco de dados NoSQL orientado a documentos (armazena dados em JSON-like).

**Vantagens:** Flexível, escalável, ótimo para dados não-relacionais.

---

### Map (Estrutura de Dados)

Coleção de pares chave-valor com busca eficiente.

**Uso no projeto:** Agrupar despesas por categoria.

**Exemplo:**

```typescript
const map = new Map<string, number>();
map.set("categoria1", 100);
map.get("categoria1"); // 100
```

---

## 🔤 N

### NoSQL

Bancos de dados que não usam SQL tradicional (ex: MongoDB, Redis).

**Diferença SQL vs NoSQL:**

- SQL: Tabelas relacionais, estrutura rígida
- NoSQL: Documentos flexíveis, estrutura dinâmica

---

### Node.js

Ambiente de execução JavaScript no lado do servidor.

**Permite:** Executar JavaScript fora do navegador, criar APIs, acessar sistema de arquivos.

---

## 🔤 O

### ObjectId

Tipo de identificador único usado pelo MongoDB (24 caracteres hexadecimais).

**Exemplo:** `507f1f77bcf86cd799439011`

**Estrutura:**

- 4 bytes: timestamp
- 5 bytes: valor aleatório
- 3 bytes: contador incremental

---

### ORM (Object-Relational Mapping)

Ferramenta que mapeia objetos da aplicação para tabelas do banco de dados.

**No projeto:** Prisma mapeia classes TypeScript para collections MongoDB.

---

## 🔤 P

### Prisma

ORM moderno para Node.js com TypeScript.

**Benefícios:**

- Type-safe (tipagem forte)
- Auto-completion no editor
- Migrations automáticas
- Query builder intuitivo

**Exemplo:**

```typescript
await prisma.transaction.create({ data: {...} })
```

---

### Promise

Objeto que representa a eventual conclusão (ou falha) de uma operação assíncrona.

**Exemplo:**

```typescript
const resultado = await prisma.transaction.findMany();
// await "espera" a Promise resolver
```

---

## 🔤 Q

### Query Parameters (Parâmetros de Consulta)

Dados enviados na URL após o símbolo `?`.

**Exemplo:**

```
/api/transactions?month=10&year=2025&type=EXPENSE
```

**Acesso no código:**

```typescript
const { month, year, type } = request.query;
```

---

### Query Builder

Interface para construir queries de banco de dados programaticamente.

**Prisma exemplo:**

```typescript
prisma.transaction.findMany({
  where: { userId: "123" },
  orderBy: { date: "desc" },
});
```

---

## 🔤 R

### REST (Representational State Transfer)

Arquitetura para APIs baseada em recursos e métodos HTTP.

**Princípios:**

- Recursos identificados por URLs
- Operações via métodos HTTP (GET, POST, etc.)
- Stateless (sem estado no servidor)

---

### Repository Pattern

Padrão que abstrai acesso a dados.

**No projeto:** Prisma age como repository para MongoDB.

---

## 🔤 S

### Schema

Estrutura que define formato e validação de dados.

**Prisma Schema:** Define modelos do banco

```prisma
model Transaction {
  id     String @id
  amount Float
}
```

**Zod Schema:** Valida dados de entrada

```typescript
z.object({
  amount: z.number().positive(),
});
```

---

### SDK (Software Development Kit)

Conjunto de ferramentas para desenvolver software para uma plataforma.

**Exemplo:** Firebase Admin SDK - ferramentas para usar Firebase no backend.

---

### Soft Delete

Marcar registro como deletado sem removê-lo fisicamente do banco.

**Implementação:**

```typescript
// Ao invés de: prisma.transaction.delete()
// Usar: prisma.transaction.update({ data: { deletedAt: new Date() } })
```

---

## 🔤 T

### TypeScript

Superset do JavaScript que adiciona tipagem estática.

**Benefícios:**

- Detecta erros em tempo de desenvolvimento
- Auto-completion melhorado
- Refatoração mais segura

**Exemplo:**

```typescript
function soma(a: number, b: number): number {
  return a + b;
}
```

---

### Type Inference (Inferência de Tipo)

TypeScript deduz automaticamente o tipo de uma variável.

**Exemplo:**

```typescript
const nome = "João"; // TypeScript infere: string
const idade = 25; // TypeScript infere: number
```

---

### Token

String única e criptografada que identifica um usuário autenticado.

**Tipos no projeto:**

- ID Token (Firebase)
- JWT (JSON Web Token)

---

## 🔤 U

### UTC (Coordinated Universal Time)

Padrão de tempo usado globalmente (sem fuso horário).

**No projeto:** Todas as datas são armazenadas em UTC.

**Benefício:** Consistência em diferentes fusos horários.

---

### UID (User Identifier)

Identificador único do usuário no Firebase.

**Exemplo:** `firebase-user-id-abc123`

---

## 🔤 V

### Validation (Validação)

Processo de verificar se dados estão no formato correto.

**Camadas de validação no projeto:**

1. Zod - valida dados de entrada
2. Prisma - valida antes de salvar no banco
3. MongoDB - valida schema no banco

---

## 🔤 Z

### Zod

Biblioteca TypeScript-first para validação de schemas.

**Vantagens:**

- Validação em runtime
- Inferência automática de tipos
- Mensagens de erro personalizadas

**Exemplo:**

```typescript
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});

const result = schema.parse({ email: "test@test.com", age: 25 });
// Se inválido, lança erro
```

---

## 📚 Conceitos Avançados

### Asynchronous Programming (Programação Assíncrona)

Executar operações sem bloquear o código principal.

**Palavras-chave:**

- `async`: Define função assíncrona
- `await`: Espera Promise resolver

**Exemplo:**

```typescript
async function buscarDados() {
  const dados = await prisma.transaction.findMany();
  return dados;
}
```

---

### Callback

Função passada como argumento para ser executada depois.

**Exemplo:**

```typescript
array.forEach((item) => {
  item; // callback executado para cada item
});
```

---

### Dependency Injection

Padrão onde dependências são fornecidas de fora, não criadas dentro.

**No projeto:**

```typescript
// Ao invés de: const prisma = new PrismaClient()
// Importar: import prisma from './config/prisma'
```

---

### Index (Índice de Banco)

Estrutura que melhora velocidade de consultas.

**No projeto:**

```prisma
@@index([userId, date])
// Acelera buscas por usuário e data
```

---

### Refine (Zod)

Validação customizada em schemas Zod.

**Exemplo:**

```typescript
z.string().refine((val) => ObjectId.isValid(val), {
  message: "ObjectId inválido",
});
```

---

### Type Guard

Função que verifica tipo em runtime.

**Exemplo:**

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

---

## 🎓 Padrões de Projeto

### MVC (Model-View-Controller)

```
Model      → Prisma Schema (dados)
View       → JSON Response (apresentação)
Controller → Lógica de negócio
```

---

### Repository Pattern

Abstração de acesso a dados.

```
Controller → Repository → Database
```

---

### Middleware Pattern

Interceptação de requisições.

```
Request → Middleware 1 → Middleware 2 → Handler
```

---

## 🔗 Acrônimos Comuns

| Acrônimo | Significado                       |
| -------- | --------------------------------- |
| API      | Application Programming Interface |
| CRUD     | Create, Read, Update, Delete      |
| DTO      | Data Transfer Object              |
| HTTP     | Hypertext Transfer Protocol       |
| JSON     | JavaScript Object Notation        |
| JWT      | JSON Web Token                    |
| NoSQL    | Not Only SQL                      |
| ORM      | Object-Relational Mapping         |
| REST     | Representational State Transfer   |
| SDK      | Software Development Kit          |
| SQL      | Structured Query Language         |
| UID      | User Identifier                   |
| URI      | Uniform Resource Identifier       |
| URL      | Uniform Resource Locator          |
| UTC      | Coordinated Universal Time        |

---

## 📖 Termos do Domínio (DevBills)

### Transaction (Transação)

Registro de uma entrada ou saída financeira.

**Tipos:**

- INCOME (Receita): Dinheiro que entra
- EXPENSE (Despesa): Dinheiro que sai

---

### Category (Categoria)

Classificação de uma transação (ex: Alimentação, Transporte).

---

### Balance (Saldo)

Diferença entre receitas e despesas.

```
Saldo = Total de Receitas - Total de Despesas
```

---

### Historical (Histórico)

Dados de transações ao longo do tempo, usado para gráficos.

---

### Summary (Resumo)

Consolidação de dados financeiros de um período.

**Contém:**

- Total de receitas
- Total de despesas
- Saldo
- Despesas por categoria (com percentuais)

---

## 🛠️ Comandos e Ferramentas

### npm (Node Package Manager)

Gerenciador de pacotes para Node.js.

**Comandos comuns:**

```bash
npm install        # Instalar dependências
npm run dev        # Executar script "dev"
npm install <pkg>  # Instalar pacote
```

---

### npx

Executa pacotes npm sem instalá-los globalmente.

**Exemplo:**

```bash
npx prisma generate  # Executa Prisma CLI
```

---

### TSX

Ferramenta para executar TypeScript diretamente.

**Uso:**

```bash
npx tsx watch src/server.ts  # Executa com hot reload
```

---

## 🔍 Debugging

###

Imprime valores no terminal para debug.

```typescript
("Valor:", variavel);
console.error("Erro:", erro);
```

---

### Try/Catch

Captura erros em código assíncrono.

```typescript
try {
  await operacaoPerigosa();
} catch (error) {
  console.error("Erro:", error);
}
```

---

### Logger (Fastify)

Sistema de logs integrado do Fastify.

```typescript
request.log.info("Informação");
request.log.error("Erro", erro);
```

---

## 📊 HTTP Status Codes

| Código | Categoria     | Significado         |
| ------ | ------------- | ------------------- |
| 200    | Sucesso       | OK                  |
| 201    | Sucesso       | Criado              |
| 400    | Erro Cliente  | Requisição inválida |
| 401    | Erro Cliente  | Não autenticado     |
| 403    | Erro Cliente  | Sem permissão       |
| 404    | Erro Cliente  | Não encontrado      |
| 500    | Erro Servidor | Erro interno        |

---

## 🎯 Boas Práticas Explicadas

### Type-Safe (Segurança de Tipos)

Código onde tipos são verificados em tempo de compilação.

**Benefício:** Detecta erros antes de executar.

---

### DRY (Don't Repeat Yourself)

Não repetir código - criar funções/componentes reutilizáveis.

---

### SOLID Principles

Princípios de design orientado a objetos.

**S**: Single Responsibility (Responsabilidade Única)  
**O**: Open/Closed (Aberto/Fechado)  
**L**: Liskov Substitution  
**I**: Interface Segregation  
**D**: Dependency Inversion

---

### Separation of Concerns

Separar código em camadas com responsabilidades distintas.

**No projeto:**

- Routes: Endpoints HTTP
- Controllers: Lógica de negócio
- Services: Operações auxiliares
- Config: Configurações

---

## 🎓 Para Aprender Mais

### TypeScript

- [Documentação Oficial](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Fastify

- [Fastify Docs](https://fastify.dev/docs/latest/)
- [Fastify Guides](https://fastify.dev/docs/latest/Guides/)

### Prisma

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### MongoDB

- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [MongoDB University](https://university.mongodb.com/)

### Zod

- [Zod Documentation](https://zod.dev/)

---

**Glossário Técnico - DevBills API**  
**Versão:** 1.0.0  
**Data:** 26/10/2025
