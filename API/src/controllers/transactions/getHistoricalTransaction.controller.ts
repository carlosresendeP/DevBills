import dayjs from "dayjs";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prima";
import type { GetHistoricalTransactionQuery } from "../../schemas/transaction.schema";
import "dayjs/locale/pt-br";
import utc from "dayjs/plugin/utc";

dayjs.locale("pt-br");
dayjs.extend(utc);

export const getHistoricalTransaction = async (
  request: FastifyRequest<{ Querystring: GetHistoricalTransactionQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.status(401).send({ error: "usuario nao autenticado" });
    return;
  }

  const { month, year, months = 6 } = request.query;

  const baseDate = new Date(year, month - 1, 1); //mes começa do 0, entao subtrai 1

  const startDate = dayjs
    .utc(baseDate)
    .subtract(months - 1, "month")
    .startOf("month")
    .toDate(); //subtrai os meses para pegar o inicio do periodo
  const endDate = dayjs.utc(baseDate).endOf("month").toDate(); //pega o final do mes

  try {
    const transaction = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        date: true,
        type: true,
      },
    });

    transaction;

    const monthlyData = Array.from({ length: months }, (_, i) => {
      const date = dayjs.utc(baseDate).subtract(months - 1 - i, "month");

      return {
        name: date.format("MMM/YYYY"),
        INCOME: 0,
        EXPENSES: 0,
      };
    });

    //pegar transaçao por transaçao e deixar no formato do dayjs
    // biome-ignore lint/complexity/noForEach: <explanation>
    transaction.forEach((transaction) => {
      const monthKey = dayjs.utc(transaction.date).format("MMM/YYYY");
      const monthData = monthlyData.find((m) => m.name === monthKey);

      if (monthData) {
        if (transaction.type === "INCOME") {
          monthData.INCOME += transaction.amount;
        } else {
          monthData.EXPENSES += transaction.amount;
        }
      }
    });
    reply.send({ history: monthlyData });
  } catch (error) {
    request.log.error("Erro ao buscar histórico de transações", error);
    reply.status(500).send({ error: "Erro ao buscar histórico de transações" });
  }
};
