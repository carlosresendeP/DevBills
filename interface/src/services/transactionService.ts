import type {
  TransactionFilter,
  Transaction,
  TrasactionSummary,
  MonthlyItem,
} from "../types/transactions";
import { api } from "./api";

/*
partial: permite que todos os campos sejam opcionais

*/

//busca todas as transações ou com filtro
export const getTransaction = async (
  filter?: Partial<TransactionFilter>,
): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>("/transactions", { params: filter });

  return response.data;
};

//cria ou atualiza uma transação já otimizada obrigando o envio de mes e ano
export const getTransactionSummary = async (
  month: number,
  year: number,
): Promise<TrasactionSummary> => {
  const response = await api.get<TrasactionSummary>("/transactions/summary", {
    params: { month, year },
  });

  return response.data;
};

export const getTransactionMonthly = async (
  month: number,
  year: number,
  months?: number,
): Promise<{ history: MonthlyItem[] }> => {
  const response = await api.get("/transactions/historical", {
    params: { month, year, months },
  });

  return response.data;
};
