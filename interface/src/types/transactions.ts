import type { Category, CategorySummary } from "./category";

export const TransactionType = {
    INCOME: "INCOME",
    EXPENSE: "EXPENSE",
} as const;
export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export interface TransactionFilter{
    month:number;
    year:number;
    categoryId?:string;
    type?:TransactionType;
}

export interface createTrasactionDTO{
    description:string;
    amount:number;
    date:string | Date;
    categoryId: string;
    type:TransactionType;
}

export interface Transaction{
    id:string;
    description:string;
    amount:number;
    date:string | Date;
    categoryId: string;
    type:TransactionType;
    createdAt:string | Date;
    updatedAt:string | Date;
    category: Category;
    userId:string;
}


export interface TrasactionSummary{
    totalExpenses: number;
    totalIncomes: number;
    totalBalance: number;
    expensesByCategory: CategorySummary[];
}


export interface MonthlyItem{
    name:string;
    expenses:number;
    income: number;
}


