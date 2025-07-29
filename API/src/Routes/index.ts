//rotas
import type { FastifyInstance } from "fastify";
import categoryRoutes from "./category.routes";
import transitionRoutes from "./transation.routes";

// Definindo as rotas do servidor
// Importando o FastifyInstance para tipagem
//promise<void> é usada para indicar que a função não retorna nada, mas é assíncrona

async function routes(fastify: FastifyInstance): Promise<void> {

    fastify.get('/health', async () => {
        return { status: 'ok',
            message: 'Servidor está ativo e funcionando corretamente!'
        };
    })


    fastify.register(categoryRoutes, {prefix: '/categories'})
    fastify.register(transitionRoutes, {prefix: '/transactions'})
}

export default routes;