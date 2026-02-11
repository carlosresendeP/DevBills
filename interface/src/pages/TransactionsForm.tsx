import { useEffect, useId, useState, type ChangeEvent, type FormEvent } from "react";
import { getCategories } from "../services/categoryService";
import { TransactionType, type createTrasactionDTO } from "../types/transactions";
import type { Category } from "../types/category";
import Card from "../components/Card";
import TransactionTypeSelector from "../components/transactionTypeSelector";
import Input from "../components/Input";
import { AlertCircle, Calendar, DollarSign, Save, Tag } from "lucide-react";
import Select from "../components/Select";
import Button from "../components/Button";
import { useNavigate } from "react-router";
import { createTransaction } from "../services/transactionService";
import { toast } from "react-toastify";

interface FormData{
    description: string;
    amount: string;
    date: string;
    categoryId: string;
    type: TransactionType;
}
const initialFormData: FormData = {
    description: "",
    amount: "",
    date: "",
    categoryId: "",
    type: TransactionType.EXPENSE,
}


const TransactionsForm = ()=>{

    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setformData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const formId = useId();

    const navigate = useNavigate();

    //busca as categorias quando o componente é montado
    useEffect(()=>{
    const fetchCategories = async():Promise<void>=>{
        const response =await getCategories();
        setCategories(response);
    }
    fetchCategories();
    },[]);

    const validateForm = ():boolean => {
        if(!formData.description || !formData.amount || !formData.date || !formData.categoryId){
            setErrors("Todos os campos são obrigatórios");
            return false;
        }
        if (Number.parseFloat(formData.amount) <= 0){
            setErrors("O valor deve ser maior que zero");
            return false;
        }

        return true;
    }


    //filtra as categorias com base no tipo de transação
    const filteredCategories = categories.filter((category)=>category.type === formData.type);


    //função que será chamada quando o formulário for enviado
    const handleSubmit = async (event:FormEvent):Promise<void> => {
        event.preventDefault();
        setLoading(true);
        setErrors(null);
        try{
            if(!validateForm()){
                return;
            }

            const transactionData: createTrasactionDTO = {
                description: formData.description,
                amount: Number.parseFloat(formData.amount),
                categoryId: formData.categoryId,
                type: formData.type,
                date: `${formData.date}T12:00:00.000Z`,
            }

            console.log(transactionData);
            
            await createTransaction(transactionData);
            toast.success("Transação criada com sucesso");
            navigate("/transacoes");
        }catch(error){
            console.error(error);
            toast.error("Erro ao criar transação");
        }
        finally{
            setLoading(false);
        }
    }


    const handleTransactionType = (itemType: TransactionType): void => {
        setformData( (prev)=> ({...prev, type: itemType})) //so atualiza o tipo
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>): void => {
        const {name, value} = event.target;
        setformData( (prev)=> ({...prev, [name]: value}))
    }

    const handleCancel = (): void => {
        navigate("/transacoes");
    }

    return(
        <div className="container-app py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">Nova Transação</h1>

                <Card>
                    {errors && (
                        <div className="flex items-center gap-2 mb-6 p-4 bg-red-300 border border-red-700 rounded-xl">
                            <AlertCircle className="h-5 w-5 text-red-700" />
                            <p className="text-red-700 text-sm">{errors}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 flex flex-col gap-2">
                            <label htmlFor={formId} className="mb-2 font-semibold">Tipo de Transação</label>
                            <TransactionTypeSelector id={formId}
                            value={formData.type}
                            onChange={handleTransactionType}
                            />
                        </div>
                        <Input 
                        id="description" 
                        label="Descrição"
                        name="description"
                        type="text"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Ex: Aluguel, Supermercado, etc"
                        />
                        
                        <Input 
                        id="amount" 
                        label="Valor"
                        name="amount"
                        type="number"
                        step="0.01"
 
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Ex: 100, 200, etc"

                        icon={<DollarSign className="h-4 w-4" />}
                        />
                        
                        <Input 
                        id="date" 
                        label="Data"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        icon={<Calendar className="h-4 w-4" />}

                        />
                        
                        <Select
                        id="categoryId"
                        label="Categoria"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        icon={<Tag className="h-4 w-4" />}

                        options={[
                            {value: "", label: "Selecione uma categoria"},
                            ...filteredCategories.map((category)=>{
                                return{
                                    value: category.id,
                                    label: category.name,
                                }
                            })
                        ]}
                        />

                        <div className="flex gap-4 items-center justify-end">
                            <Button variant="outline" type="button" 
                            onClick={handleCancel}
                            disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" variant={formData.type === TransactionType.EXPENSE ? "danger" : "success"}
                            disabled={loading}
                            >
                                {loading ? (
                                    <div className="w-4 h-4 mx-auto ml-4 border-4 border-gray-700 border-t-transparent rounded-full animate-spin"
                                    role="status">
                                    <span className="sr-only">Loading...</span>
                                    </div>)
                                    : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Salvar
                            </Button>
                        </div>
                        
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default TransactionsForm;