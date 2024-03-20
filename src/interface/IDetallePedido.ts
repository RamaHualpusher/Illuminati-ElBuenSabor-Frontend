import { IBase } from "./IBase";
import { IProducto, IProductoDto } from "./IProducto";

export interface IDetallePedido extends IBase {
  cantidad: number;
  subTotal: number;
  producto: IProducto;
  maxCantidadProducto: number;
}
export interface IDetallePedidoDto extends IBase {
  cantidad: number;
  producto: IProductoDto;
}