import { IBase } from "./IBase";
import { IProducto } from "./IProducto";

export interface IDetallePedido extends IBase {
  cantidad: number;
  Productos: IProducto;
}
