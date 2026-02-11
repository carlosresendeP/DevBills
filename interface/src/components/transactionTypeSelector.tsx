import { TransactionType } from "../types/transactions";

interface TransactionTypeSelectorProps {
    value: TransactionType,
    id?: string,
    onChange: (value: TransactionType) => void,
}

const TransactionTypeSelector = ({value, id, onChange}: TransactionTypeSelectorProps ) => {
    
    const transactionTypeButtons =[

        {
            type: TransactionType.EXPENSE,
            label: "Despesa",
            activeClasses: "bg-red-500 border-red-500 text-red-700 font-medium",
            inactiveClasses: "bg-transparent border-red-300 text-red-500 hover:bg-red-50",
        },
        {
            type: TransactionType.INCOME,
            label: "Receita",
            activeClasses: "bg-green-100 border-green-500 text-green-700 font-medium",
            inactiveClasses: "bg-transparent border-green-300 text-green-500 hover:bg-green-50",
        }
    ]

 

    return (
        <fieldset id={id} className="grid grid-cols-2 gap-4"> 

            {transactionTypeButtons.map((item)=>(
                <button 
                key={item.type} 
                type="button"
                onClick={()=>onChange(item.type)}
                className={ `flex items-center justify-center py-2 px-4 border rounded-md transition-all  cursor-pointer 
                    ${item.type === value 
                    ? item.activeClasses 
                    : item.inactiveClasses}` 
                }
                >
                {item.label}
                </button>
            ))}
            
        </fieldset>
    )
}

export default TransactionTypeSelector

// NOVO CONCEITO
//fieldset => é usada para agrupar campos relacionados dentro de um formulário, criando visualmente uma caixa contornada escolher uma opção apenas