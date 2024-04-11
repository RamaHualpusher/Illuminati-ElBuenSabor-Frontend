import { IBase } from "./IBase";
import { IProductoFactura } from "./IProducto";

export interface IDetalleFactura extends IBase {
    cantidad: number;
    subtotal: number;
    productos: IProductoFactura[];
  }