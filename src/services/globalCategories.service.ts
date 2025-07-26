import { type Category, transactionType } from "@prisma/client";
import prisma from "../config/prima";

//pick = "extrair" apenas os campos que você quer, extraindo os campos 'name', 'color' e 'type' do Category
type GlobalCategoryInput = Pick<Category, "name" | "color" | "type">;

const globalCategories: GlobalCategoryInput[] = [
  // Despesas
  { name: "Alimentação", color: "#FF5733", type: transactionType.EXPENSE },
  { name: "Transporte", color: "#33A8FF", type: transactionType.EXPENSE },
  { name: "Moradia", color: "#33FF57", type: transactionType.EXPENSE },
  { name: "Saúde", color: "#F033FF", type: transactionType.EXPENSE },
  { name: "Educação", color: "#FF3366", type: transactionType.EXPENSE },
  { name: "Lazer", color: "#FFBA33", type: transactionType.EXPENSE },
  { name: "Compras", color: "#33FFF6", type: transactionType.EXPENSE },
  { name: "Outros", color: "#B033FF", type: transactionType.EXPENSE },

  // Receitas
  { name: "Salário", color: "#33FF57", type: transactionType.INCOME },
  { name: "Freelance", color: "#33A8FF", type: transactionType.INCOME },
  { name: "Investimentos", color: "#FFBA33", type: transactionType.INCOME },
  { name: "Outros", color: "#B033FF", type: transactionType.INCOME },
];

//toda função assincrona é uma Promise
// Promise<category[]> significa que a função retorna uma Promise que resolve para um array de Category

export const inializeGlobalCategories = async (): Promise<Category[]> => {
  const createdCategories: Category[] = [];

  //for = 'para cada' item é verificado se já existe no banco de dados
  //findFirst = 'encontrar o primeiro' item que corresponde ao critério se não encontrar retorna null
  for(const category of globalCategories){
    try{
      const existing = await prisma.category.findFirst({
        where:{
          name: category.name,
          type: category.type,
        }
      })

      if(!existing){
        const newCategory = await prisma.category.create({data: category})
        console.log(`✅ Criada a ${newCategory.name}`)
        createdCategories.push(newCategory)
      }else{
        createdCategories.push(existing)
      }
    }catch (err) {
      console.error("ERRO! ao criar as categorias", err)
    }



  }
  console.log('TODAS as categorias inicializadas')
  return createdCategories
}