//importar o fastify e as rotas
import Fastify from "fastify";
//infortar o fastifay instance
import type { FastifyInstance } from "fastify";
import routes from "./Routes";
import { env } from "./config/env";
import cors from '@fastify/cors'

//criar uma variável do tipo FastifyInstance e o logger ativado
//o logger é uma funcionalidade do fastify que permite registrar logs de requisições e respostas
//e também erros, o que é muito útil para depuração e monitoramento da aplicação

const app: FastifyInstance = Fastify({
    logger: {
        level: env.NODE_ENV === 'dev' ? 'info': 'error', // Define o nível de log com base no ambiente
    },
});

app.register(cors, {
    origin: true, // Permitir todas as origens
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Métodos HTTP permitidos
})

//registrar as rotas no servidor com o prefixo '/api'
app.register(routes, {prefix: '/api'});

//prefix: 'api' é usado para definir um prefixo para todas as rotas registradas
//localhgost:3000/api/categories

export default app;
