import { ChevronDown } from "lucide-react";
import { useId, type SelectHTMLAttributes, type ReactNode } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  options: SelectOption[];
}

const Select = ({
  label,
  error,
  icon,
  fullWidth = true,
  options,
  className = "",
  id,
  ...rest
}: SelectProps) => {
  const selectId = useId();

  return (
    <div className={`${fullWidth ? "w-full" : ""} mb-4 relative`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-50 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-40 0">
            {icon}
          </div>
        )}
        <select
          id={selectId}
          {...rest}
          className={`block w-full rounded-xl bg-gray-700 pl-10 pr-4 py-3 text-gray-50 text-sm ${error ? "border-red-500" : ""}
        ${error ? "focus:border-red-500" : "focus:border-primary-500"} outline-none appearance-none focus:ring-1 focus:ring-primary-500
        `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown className="w-5 h-5 text-gray-50" />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
