import type { FastifyReply, FastifyRequest } from "fastify"
import prisma from "../../config/prima";
import {createTransactionSchema } from "../../schemas/transaction.schema"




const createTrasaction = async(request: FastifyRequest, reply:FastifyReply): Promise<void> =>{

    const userId = request.userId;

    if (!userId){
        reply.status(401).send({error: 'usuario nao autenticado'})
        return;
    }

    //validacao
    const result = createTransactionSchema.safeParse(request.body) // safeParse retorna um objeto com sucesso ou erro
    console.log(result)

    if (!result.success) {
        const errorMessage = result.error.errors[0].message || "Validacao inválida";

        reply.status(400).send({ error: errorMessage });
        return;
    }

    const transaction = result.data;

    try{
        const category = await prisma.category.findFirst({
            where: {
                id: transaction.categoryId,
                type: transaction.type,
            },
        });
        if (!category) {
            reply.status(400).send({ error: "Categoria inválida" });
            return;
        }

        const parseDate = new Date(transaction.date);


        const newTransaction = await prisma.transaction.create({
            data:{
                ...transaction,
                userId,
                date: parseDate,

            },
            include:{
                category: true, // Inclui a categoria relacionada
            },
        });

        reply.status(201).send(newTransaction);

    }catch(error){
        request.log.error("Erro ao criar transação:", error);
        reply.status(500).send({ error: "Erro ao criar transação" });
    }

}

export default createTrasaction