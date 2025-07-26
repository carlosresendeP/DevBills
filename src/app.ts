//importar o fastify e as rotas
import Fastify from "fastify";
//infortar o fastifay instance
import type { FastifyInstance } from "fastify";
import routes from "./Routes";
import { env } from "./config/env";

//criar uma variável do tipo FastifyInstance e o logger ativado
//o logger é uma funcionalidade do fastify que permite registrar logs de requisições e respostas
//e também erros, o que é muito útil para depuração e monitoramento da aplicação

const app: FastifyInstance = Fastify({
    logger: {
        level: env.NODE_ENV === 'dev' ? 'info': 'error', // Define o nível de log com base no ambiente
    },
});

//registrar as rotas no servidor com o prefixo '/api'
app.register(routes, {prefix: '/api'});

//prefix: 'api' é usado para definir um prefixo para todas as rotas registradas
//localhgost:3000/api/categories

export default app;
