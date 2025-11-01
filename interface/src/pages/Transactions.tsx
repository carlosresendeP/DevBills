import { Plus, Search } from "lucide-react";
import { Link } from "react-router";
import MonthYearSelect from "../components/MonthYearSelect";
import { useState } from "react";
import Input from "../components/Input";
import Card from "../components/Card";

const Transactions = () => {
  const currentDate = new Date();

  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setmMonth] = useState<number>(currentDate.getMonth() + 1);

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start lg:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Transações</h1>
        <Link
          to="/transacoes/nova"
          className="bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex
            items-center justify-center hover:bg-primary-600 transition-all"
        >
          <Plus className="w-4 h-4 mr-2"></Plus>
          Nova Transação
        </Link>
      </div>

      {/*Filtros e busca*/}
      <div className="mb-6">
        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={setmMonth}
          onYearChange={setYear}
        ></MonthYearSelect>
      </div>
      {/*busca*/}
      <Card className="mb-6">
        <Input 
        placeholder="Buscar transações..."
        icon={<Search className="w-4 h-4" />}
        fullWidth

        >

        </Input>
      </Card>
    </div>
  );
};

export default Transactions;
