import { AlertCircle, ArrowUp, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router";
import MonthYearSelect from "../components/MonthYearSelect";
import { useEffect, useState, type ChangeEvent } from "react";
import Input from "../components/Input";
import Card from "../components/Card";
import { TransactionType, type Transaction } from "../types/transactions";
import { deleteTransaction, getTransaction } from "../services/transactionService";
import Button from "../components/Button";
import { formatCurrency, formatDate } from "../utils/formatter";
import { toast } from "react-toastify";

const Transactions = () => {
  const currentDate = new Date();

  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setmMonth] = useState<number>(currentDate.getMonth() + 1);
  const [loading, setloading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>("");
  const [searchText, setSearchText] = useState<string>("");

  const fetchTransactions = async (): Promise<void> => {
    try {
      setloading(true);
      setError("");

      const data = await getTransaction({ month, year });
      setTransactions(data);
      setFilteredTransactions(data)
      console.log(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar transações.Tenete novamente.");
    } finally {
      setloading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchTransactions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      setloading(true);
      setDeletingId(id);
      await deleteTransaction(id);
      toast.success("Transação excluída com sucesso.");
      setFilteredTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir transação.Tente novamente.");
    } finally {
      setloading(false);
      setDeletingId("")

    }
  };

  const confirmDelete = (id: string): void => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      handleDelete(id);
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>):void =>{
    setSearchText(event.target.value);
    setFilteredTransactions(
      transactions.filter( (transaction) => transaction.description
      .toUpperCase().includes(event.target.value.toUpperCase())));
  };

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
      <Card className="mb-6">
        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={setmMonth}
          onYearChange={setYear}
        ></MonthYearSelect>
      </Card>
      {/*busca*/}
      <Card className="mb-6">
        <Input
          placeholder="Buscar transações..."
          icon={<Search className="w-4 h-4" />}
          fullWidth
          onChange={handleSearch}
          value={searchText}
        ></Input>
      </Card>

      <Card className="overflow-hidden ">
        {loading ? (
          <div>
            {/** biome-ignore lint/a11y/useSemanticElements: div used for loading spinner */}
            <div
              className="w-12 h-12 mx-auto m-6 border-5 border-gray-500 border-t-primary-500 rounded-full animate-spin"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
            <p className="text-center bm-6">{error}</p>
            <Button onClick={fetchTransactions} className="mx-auto mt-6">
              Tentar Novamente
            </Button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-6">
            <p>Nenhuma Transação encontrada</p>
            <Link
              to="/transacoes/nova"
              className="w-fit mx-auto mt-6 bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex
              items-center justify-center hover:bg-primary-600 transition-all"
            >
              <Plus className="w-4 h-4 mr-2"></Plus>
              Nova Transação
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/*tabela*/}
            <table className="divide-y divide-gray-700 min-h-full w-full">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Descrição
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Data
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Categoria
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Valor
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    {""}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-800">
                    {/*descrição*/}

                    <td className="px-6 py-4 text-sm whitespace-nowrap ">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {transaction.type === TransactionType.INCOME ? (
                            <ArrowUp className="w-4 h-4 text-primary-500" />
                          ) : (
                            <ArrowUp className="w-4 h-4 text-red-500 rotate-180" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-50">
                          {transaction.description}
                        </span>
                      </div>
                    </td>
                    {/*data*/}

                    <td className="px-6 py-4 text-sm whitespace-nowrap ">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                    </td>

                    {/*categoria*/}
                    <td className="px-6 py-4 text-sm whitespace-nowrap ">
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: transaction.category.color }}
                        ></div>
                        <span className="text-sm  text-gray-400">{transaction.category.name}</span>
                      </div>
                    </td>

                    {/*valor*/}
                    <td className="px-6 py-4 text-sm whitespace-nowrap ">
                      <span
                        className={`
                          ${
                            transaction.type === TransactionType.INCOME
                              ? "text-primary-500"
                              : "text-red-500"
                          }
                          `}
                      >
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>

                    {/*ações*/}
                    <td className="px-6 py-4 text-sm whitespace-nowrap ">
                      <button
                        type="button"
                        onClick={() => confirmDelete(transaction.id)}
                        disabled={deletingId === transaction.id}
                        className="text-red-500 hover:text-red-700 rounded-full cursor-pointer"
                      >
                        {deletingId === transaction.id ? (
                          <span className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;
