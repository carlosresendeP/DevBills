import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../config/prima";

//funcao para obter uma categoria
export const getCategories = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {

    try{
        //vai no banco de dados e busca todas as categorias
        //finmany = busca muitas categorias 
        //orderBy = ordena as categorias pelo nome em ordem
        const categories = await prisma.category.findMany({
            orderBy: {
                name: "asc"
            }
        }) 
        //retorna as categorias encontradas
        reply.send(categories)
    }catch (err){
        request.log.error("Erro ao buscar categorias", err)
        reply.status(500).send({error: "erro ao buscar categorias"})
    }
};
