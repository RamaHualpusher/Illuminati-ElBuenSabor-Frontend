import { Ingredientes } from "./Ingredientes";

export interface IngredienteStockActual {
  idIngredienteActual: number;
  stockActual: number;
  fecha: Date;
  Ingrediente: Ingredientes[];
}
