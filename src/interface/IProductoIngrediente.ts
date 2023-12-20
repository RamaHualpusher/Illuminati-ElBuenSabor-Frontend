import { IBase } from "./IBase";
import { IIngredientes } from "./IIngredientes";

export interface IProductoIngrediente extends IBase {
  cantidad: number;
  Ingredientes: IIngredientes;
}
