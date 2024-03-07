import { IBase } from "./IBase";
import { IProducto, IProductoDto } from "./IProducto";

export interface IDetallePedido extends IBase {
  cantidad: number;
  Productos: IProducto;
}
export interface IDetallePedidoDto extends IBase {
  cantidad: number;
  producto: IProductoDto;
}