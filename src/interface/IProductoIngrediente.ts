import { IBase } from "./IBase";
import { IIngredientes } from "./IIngredientes";

export interface IProductoIngrediente extends IBase {
  cantidad: number;
  ingrediente: IIngredientes;
}
export interface IProductoIngredienteDto extends IBase {
  cantidad: number;
  ingrediente: IIngredientes;
}