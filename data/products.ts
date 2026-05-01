export type Category = "Todos" | "Lanches" | "Bebidas" | "Saudaveis";

export type Product = {
  id: string;
  name: string;
  description: string;
  category: Exclude<Category, "Todos">;
  price: number;
  prepTime: string;
  highlight?: boolean;
};

export const categories: Category[] = ["Todos", "Lanches", "Bebidas", "Saudaveis"];

export const products: Product[] = [
  {
    id: "1",
    name: "Wrap Frango Tech",
    description: "Frango grelhado, queijo branco, alface e molho da casa.",
    category: "Lanches",
    price: 18.9,
    prepTime: "8 min",
    highlight: true
  },
  {
    id: "2",
    name: "Bowl Sprint",
    description: "Arroz integral, grao-de-bico, legumes e proteina do dia.",
    category: "Saudaveis",
    price: 24.5,
    prepTime: "10 min"
  },
  {
    id: "3",
    name: "Suco Deploy",
    description: "Laranja, cenoura e gengibre batidos na hora.",
    category: "Bebidas",
    price: 9.9,
    prepTime: "4 min"
  },
  {
    id: "4",
    name: "Pao de Queijo Stack",
    description: "Porcao com seis unidades assadas no periodo.",
    category: "Lanches",
    price: 12,
    prepTime: "5 min"
  },
  {
    id: "5",
    name: "Salada Cloud",
    description: "Mix de folhas, tomate cereja, croutons e molho leve.",
    category: "Saudaveis",
    price: 19.9,
    prepTime: "7 min"
  }
];
