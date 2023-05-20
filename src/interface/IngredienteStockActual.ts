import { Ingrediente } from "./Ingrediente";
export interface IngredienteStockActual {
  idIngredienteActual: number;
  stockActual: number;
  fecha: Date;
  Ingrediente: Ingrediente[];
}
