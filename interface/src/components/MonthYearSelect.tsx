import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthYearSelectProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

// Array com os nomes dos meses em português apenas para leitura
const monthNames: readonly string[] = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const MonthYearSelect = ({ month, year, onMonthChange, onYearChange }: MonthYearSelectProps) => {
  const currentYear = new Date().getFullYear();

  //gera um array de anos de currentYear-5 até currentYear+5
  const years: number[] = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Funções para lidar com a mudança de mês
  //avancar
  const handleNextMonth = (): void => {
    if (month === 12) {
      onMonthChange(1);
      onYearChange(year + 1);
    } else {
      onMonthChange(month + 1);
    }
  };
  //voltar
  const handlePreviousMonth = (): void => {
    if (month === 1) {
      onMonthChange(12);
      onYearChange(year - 1);
    } else {
      onMonthChange(month - 1);
    }
  };
  return (
    <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3 border border-gray-700 ">
      <button
        type="button"
        className="p-2 rounded-full hover:bg-gray-800 hover:text-primary-500 transition-colors cursor-pointer"
        aria-label="Mês Anterior"
        onClick={handlePreviousMonth}
      >
        <ChevronLeft />
      </button>

      <div className="flex gap-4">
        {/* Select para o mes */}
        <label htmlFor="month-select" className="sr-only">
          Selecionar Mês
        </label>
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          id="month-select"
          className="bg-gray-800 bonder border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus:outline-none focus:ring-1
          ring-primary-500"
        >
          {monthNames.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>

        {/* Select para o ano */}
        <label htmlFor="year-select" className="sr-only">
          Selecionar Ano
        </label>
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          id="year-select"
          className="bg-gray-800 bonder border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus:outline-none focus:ring-1
          ring-primary-500"
        >
          {years.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="p-2 rounded-full hover:bg-gray-800 hover:text-primary-500 transition-colors cursor-pointer"
        aria-label="Proximo Mês"
        onClick={handleNextMonth}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default MonthYearSelect;
