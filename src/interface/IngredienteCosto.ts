import { Ingredientes } from "./Ingredientes";

export interface IngredienteCosto {
  idIngredienteCosto: number;
  costo: number;
  fecha: Date;
  Ingrediente: Ingredientes[];
}
