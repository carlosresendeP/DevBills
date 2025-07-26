import type { FastifyReply, FastifyRequest } from "fastify";
import type { DeleteTransactionParams } from "../../schemas/transaction.schema";
import prisma from "../../config/prima";

export const deleteTransaction = async (
  request: FastifyRequest<{ Params: DeleteTransactionParams }>,
  reply: FastifyReply,
): Promise<void> => {

    //validção do usuario
  const userId = "ahousfhufhuo";
  const { id } = request.params;

  if (!userId) {
    reply.status(401).send({ error: "usuario nao autenticado" });
  }

  try{
    //verificar se a transação é a o usuario(id)
    const transaction = await prisma.transaction.findFirst({
        where:{
            id,
            userId,
        },
    })

    if(!transaction){
        reply.status(400).send({error: "Id da trasansação inválido"})
        return
    }

    await prisma.transaction.delete({
        where: {id}
    })

    reply.status(200).send({message:'Transação deletada com sucesso'})

  }catch(error){
    request.log.error({message:'Erro ao deletar transação'})
    reply.status(500).send({error: "Erro interno no servidor, falha ao deletar a transação."})
  }
};
