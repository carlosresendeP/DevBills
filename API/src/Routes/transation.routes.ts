import type { FastifyInstance } from "fastify";
import  createTrasaction  from "../controllers/transactions/createTransaction.controller";
import {zodToJsonSchema} from "zod-to-json-schema";
import { createTransactionSchema, deleteTransactionSchema, getHistoricalTransactionSchema, getTransactionSchema, getTransactionSummarySchema } from "../schemas/transaction.schema";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.Controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { getHistoricalTransaction } from "../controllers/transactions/getHistoricalTransaction.controller";

const transitionRoutes = async(fastify: FastifyInstance) =>{

    fastify.addHook('preHandler', authMiddleware)

    //criação
    fastify.route({
        method: "POST",
        url: "/",
        schema: {
            body: zodToJsonSchema(createTransactionSchema) // Converte o schema Zod para JSON Schema
        },
        handler: createTrasaction
    });

    //Buscar com filtros
    fastify.route({
        method: "GET",
        url: '/',
        schema:{
             querystring: zodToJsonSchema(getTransactionSchema) // Converte o schema Zod para JSON Schema
        },
        handler: getTransactions
    })

    //buscar resumo
    fastify.route({
        method: "GET",
        url: '/summary',
        schema: {
            querystring: zodToJsonSchema(getTransactionSummarySchema)
        },
        handler: getTransactionsSummary
    })

    //historico de transaçoes 
    fastify.route({
        method: "GET",
        url: '/historical',
        schema: {
            querystring: zodToJsonSchema(getHistoricalTransactionSchema)
        },
        handler: getHistoricalTransaction
    })

    //delete
   fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema:{
        params: zodToJsonSchema(deleteTransactionSchema)
    },
    handler: deleteTransaction
   })

}

export default transitionRoutes;


/*
zodToJsonSchema => Converte o schema Zod para JSON Schema, que é o formato esperado pelo Fastify para validação de entrada.
querystring => Define que o schema será usado para validar os parâmetros de consulta da requisição GET.
*/