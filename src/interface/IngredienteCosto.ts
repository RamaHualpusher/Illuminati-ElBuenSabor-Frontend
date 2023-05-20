import { Ingrediente } from "./Ingrediente";
export interface IngredienteCosto {
  idIngredienteCosto: number;
  costo: number;
  fecha: Date;
  Ingrediente: Ingrediente[];
}
