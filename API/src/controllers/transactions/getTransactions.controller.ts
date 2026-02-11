import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prima";
import type { GetTransactionQuery } from "../../schemas/transaction.schema";
import type { transactionFilter } from "../../types/transactions.types";

dayjs.extend(utc); //plugin para manipular datas em UTC

export const getTransactions = async (
  request: FastifyRequest<{ Querystring: GetTransactionQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.status(401).send({ error: "usuario nao autenticado" });
    return;
  }

  const { month, categoryId, type, year } = request.query;

  const filters: transactionFilter = { userId }; //inicializa o filtro com o userId

  //se o usuario passar o mes e o ano, filtra as transações desse mês
  if (month && year) {
    const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate(); //primeiro dia do mes
    const endDate = dayjs.utc(startDate).endOf("month").toDate(); //ultimo dia do mes

    filters.date = { gte: startDate, lte: endDate };
  }

  if (type) {
    filters.type = type;
  }

  if (categoryId) {
    filters.categoryId = categoryId;
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: filters,
      orderBy: { date: "desc" },
      include: {
        category: {
          select: {
            color: true,
            name: true,
            type: true,
          },
        },
      },
    });
    //ordena por data, do mais recente para o mais antigo

    reply.send(transactions);
  } catch (error) {
    request.log.error("Erro ao buscar transações:", error);
    reply.status(500).send({ error: "Erro ao buscar transações" });
  }
};
