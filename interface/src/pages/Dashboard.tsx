import { useEffect, useState } from "react";
//import { api } from "../services/api";
import MonthYearSelect from "../components/MonthYearSelect";
import { getTransactionMonthly, getTransactionSummary } from "../services/transactionService";
import type { MonthlyItem, TrasactionSummary } from "../types/transactions";
import Card from "../components/Card";
import { ArrowUp, Calendar, TrendingUp, Wallet } from "lucide-react";
import { formatCurrency } from "../utils/formatter";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

//valor inicial do resumo(summary)
const initialSummary: TrasactionSummary = {
  expensesByCategory: [],
  totalBalance: 0,
  totalExpenses: 0,
  totalIncomes: 0,
};

interface ChartLabelProps {
  categoryName: string;
  percent: number;
}

const Dashboard = () => {
  const currentDate = new Date();

  const [year, setYear] = useState<number>(currentDate.getFullYear()); //ano atual
  const [month, setMonth] = useState(currentDate.getMonth() + 1); //mês atual (getMonth() retorna de 0 a 11, por isso o +1)
  const [summary, setSummary] = useState<TrasactionSummary>(initialSummary); //estado para armazenar o resumo das transações
  const [monthlyItemData, setMonthlyItemData] = useState<MonthlyItem[]>([]); //estado para armazenar os dados mensais de receitas e despesas

  useEffect(() => {
    async function loadTransactionsSummary() {
      const response = await getTransactionSummary(month, year);

      setSummary(response);

    }
    loadTransactionsSummary();
  }, [month, year]);
  

  useEffect(() => {
    async function loadTransactionsMonthly() {
      const response = await getTransactionMonthly(month, year, 4);



      setMonthlyItemData(response?.history || []);
      console.log(response.history);
    }
    loadTransactionsMonthly();
  }, [month, year]);

  const renderPieChartLabel = ({ categoryName, percent }: ChartLabelProps): string => {
    return `${categoryName}: ${(percent * 100).toFixed(1)}%`;
  };
  const FormatToolTipValue = (value: number | string): string => {
    return formatCurrency(typeof value === "number" ? value : 0);
  };

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>

      {/*cards*/}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card
          icon={<Wallet size={20} className="text-primary-500" />}
          title="Saldo"
          hover
          glowEffect={summary.totalBalance > 0}
        >
          <p
            className={`text-2xl font-semibold mt-2
              ${summary.totalBalance > 0 ? "text-primary-500" : "text-red-400"}
        
              `}
          >
            {formatCurrency(summary.totalBalance)}
          </p>
        </Card>
        <Card icon={<ArrowUp size={20} className="text-primary-500" />} title="Receitas" hover>
          <p
            className={`text-2xl font-semibold mt-2 text-primary-500
              
              `}
          >
            {formatCurrency(summary.totalIncomes)}
          </p>
        </Card>
        <Card icon={<Wallet size={20} className="text-red-500" />} title="Despesas" hover>
          <p
            className={`text-2xl font-semibold mt-2 text-red-600
              `}
          >
            {formatCurrency(summary.totalExpenses)}
          </p>
        </Card>
      </div>

      {/*Graficos*/}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-6 mt-3">
        {/*1*/}
        <Card
          icon={<TrendingUp size={20} className="text-primary-500" />}
          title="Despesas por Categoria"
          className="min-h-80"
        >
          {summary.expensesByCategory.length > 0 ? (
            <div className="h-72 mt-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={summary.expensesByCategory.map(item => ({
                      ...item,
                      name: item.categoryName,
                      value: item.amount
                    }))}
                    cx="50%"
                    cy="50%"
                    label={renderPieChartLabel}
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="categoryName"
                  >

                    {summary.expensesByCategory.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.categoryColor}></Cell>
                    ))}
                  </Pie>
                  <Tooltip formatter={FormatToolTipValue} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-600">
              <p className="text-center">Nenhuma despesa nesse período.</p>
            </div>
          )}
        </Card>



        {/*2*/}
        
        <Card
          icon={<Calendar size={20} className="text-primary-500" />}
          title="Histórico Mensal"
          className="min-h-80 p-2.5"
        >
          <div className="h-72 mt-4">
            {monthlyItemData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyItemData}
                  margin={{
                    left: 40,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,225,0.1)" />
                  <XAxis
                    dataKey="name"
                    stroke="#91a3b8"
                    tick={{ style: { textTransform: "capitalize" } }}
                  />{" "}

                  <YAxis
                    stroke="#91a3b8"
                    tickFormatter={formatCurrency}
                    tick={{ style: { fontSize: 14 } }}
                  />
                  <Tooltip
                    formatter={formatCurrency}
                    contentStyle={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
                    labelStyle={{color: "#f8f8f8"}}
                  />
                  <Legend />
                  <Bar dataKey="EXPENSES" fill="#ff6384" name="Despesas" />
                  <Bar dataKey="INCOME" fill="#37e359" name="Receitas" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-600">
                <p className="text-center">Nenhuma despesa nesse período.</p>
              </div>
            )}
          </div>
        </Card> 
      </div>
    </div>
  );
};

export default Dashboard;
