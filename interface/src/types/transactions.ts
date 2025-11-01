import type { Category, CategotySummary } from "./category";

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

export interface Transaction{
    id:string;
    description:string;
    amount:number;
    date:string | Date;
    categoryId: string;
    type:TransactionType;
    createdAt:string | Date;
    updatedAt:string | Date;
    categoty: Category;
    userId:string;
}


export interface TrasactionSummary{
    totalExpenses: number;
    totalIncomes: number;
    totalBalance: number;
    expensesByCategory: CategotySummary[];
}


export interface MonthlyItem{
    name:string;
    expenses:number;
    income: number;
}


