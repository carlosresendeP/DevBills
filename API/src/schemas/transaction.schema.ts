//validação da schema de transações
//utulizando zod para validação de dados (= yup)

import { transactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import { z } from "zod";

//verifica se o id é um ObjectId válido
const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

// Schema para criação de transações
export const createTransactionSchema = z.object({
  description: z.string().min(1, "Descrição Obrigatória"), //descrição
  amount: z.number().positive("Valor deve ser positivo"), //valor
  date: z.coerce.date({ errorMap: () => ({ message: "Data inválida" }) }), //data, coerce é procura algo mais a fundo, nesse caso uma string que represente uma data
  categoryId: z.string().refine(isValidObjectId, { message: "Categoria inválido" }), //id da categoria, verifica se é um ObjectId válido
  type: z.enum([transactionType.EXPENSE, transactionType.INCOME], {
    errorMap: () => ({ message: "Tipo Invalido" }),
  }), //type
});



/*
e como se tivesse assim :
type CreateTransaction = {
    description: string;
    amount: number;
    date: Date;
    categoryId: string;
    type: "EXPENSE" | "INCOME";
}
  
*/

// Schema para buscar transações com filtros
export const getTransactionSchema = z.object({
  //mes , ano, type, categoryId
  month: z.string().optional(),
  year: z.string().optional(),
  type: z
    .enum([transactionType.EXPENSE, transactionType.INCOME], {
      errorMap: () => ({ message: "Tipo Invalido" }),
    })
    .optional(),
  categoryId: z.string().refine(isValidObjectId, { message: "Categoria inválido" }).optional(),
});


export const getTransactionSummarySchema = z.object({
  month: z.string({ message: "O mes é obrigatório" }),
  year: z.string({ message: "O ano é obrigatório" }),
});



export const getHistoricalTransactionSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  months: z.coerce.number().min(1).max(12).optional(),
});


//delete
export const deleteTransactionSchema = z.object({
  id: z.string().refine(isValidObjectId, { message: "Id inválido" }),
});

export type CreateTransactionQuery = z.infer<typeof createTransactionSchema>; //cria um tipo TypeScript a partir do schema Zod
export type GetTransactionQuery = z.infer<typeof getTransactionSchema>; //cria um tipo TypeScript a partir do schema Zod
export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>
export type getTransactionSummaryQuery = z.infer<typeof getTransactionSummarySchema>;
export type GetHistoricalTransactionQuery = z.infer<typeof getHistoricalTransactionSchema>;