import { transactionType } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prima";
import type { getTransactionSummaryQuery } from "../../schemas/transaction.schema";
import type { CategorySummary } from "../../types/category.types";
import type{ TrasactionSummary } from "../../types/transactions.types";

dayjs.extend(utc); //plugin para manipular datas em UTC

export const getTransactionsSummary = async (
  request: FastifyRequest<{ Querystring: getTransactionSummaryQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId;

  if (!userId) {
    reply.status(401).send({ error: "usuario nao autenticado" });
  }
  const { month, year } = request.query;

  if (!month && !year) {
    reply.status(400).send({ error: "Mês e ano são obrigatórios" });
    return;
  }
  const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate(); //primeiro dia do mes
  const endDate = dayjs.utc(startDate).endOf("month").toDate(); //ultimo dia do mes

  //todas as transações do usuário no mês e ano especificados
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        category: true,
      },
    });
    //ordena por data, do mais recente para o mais antigo

    // Agrupar despesas por categoria
    let totalIncomes = 0;
    let totalExpenses = 0;
    const groupedExpenses = new Map<string, CategorySummary>(); // Map para agrupar despesas por categoria

    for (const transaction of transactions) {
      //quando for para cada transação

      if (transaction.type === transactionType.EXPENSE) {
        //se for uma despesa

        // Verifica se a categoria já existe no Map se não existir, cria um novo objeto
        const existing = groupedExpenses.get(transaction.categoryId) ?? {
          //se não existir, cria um novo objeto (??) =>
          categoryId: transaction.categoryId,
          categoryName: transaction.category.name,
          categoryColor: transaction.category.color,
          amount: 0,
          percentage: 0,
        };
        //se já existir, é usado um get para pegar o valor existente e guardar na variável existing
        // se não existir, é criado um novo objeto com os valores iniciais

        existing.amount += transaction.amount; //soma o valor da transação ao total da categoria
        groupedExpenses.set(transaction.categoryId, existing); //atualiza o Map com o novo valor

        totalExpenses += transaction.amount; //soma o valor da transação de TODAS as despesas
      } else {
        totalIncomes += transaction.amount; //soma o valor da transação de TODAS as receitas
      }
    }
    
    console.log( Array.from(groupedExpenses.values()))

    const summary: TrasactionSummary ={
      totalExpenses,
      totalIncomes,
      totalBalance: Number.parseFloat((totalIncomes - totalExpenses).toFixed(2)), //calcula o saldo total (receitas - despesas),
      //converte o Map em um array
      expensesByCategory: Array.from(groupedExpenses.values()).map( (entry)=>({
        ...entry, //espalha os valores do objeto existente
        percentage: Number.parseFloat(( entry.amount / totalExpenses * 100).toFixed(2))
      })).sort( (a, b)=> b.amount - a.amount), //ordena por valor da despesa, do maior para o menor(sort = função de comparação)
    }
    reply.send(summary);
  } catch (error) {
    request.log.error("Erro ao buscar transações:", error);
    reply.status(500).send({ error: "Erro ao buscar transações" });
  }
};
