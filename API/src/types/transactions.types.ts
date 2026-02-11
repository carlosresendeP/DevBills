import type { transactionType } from "@prisma/client"
import type{ CategorySummary } from "./category.types"

export type transactionFilter = {
    userId: string,
    date?: {
        gte: Date,
        lte: Date,
    },
    type?: transactionType,
    categoryId?: string,
}

//gte => greater than or equal to (maior ou igual a >=)
//lte => less than or equal to (menor ou igual a <=)

export interface TrasactionSummary{
    totalExpenses: number,
    totalIncomes: number,
    totalBalance: number,
    expensesByCategory: CategorySummary[]
}