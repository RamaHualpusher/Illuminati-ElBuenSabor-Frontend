import { IBase } from "./IBase";

export interface IDetalleFactura extends IBase {
    cantidad: number;
    subtotal: number;
    nombreProducto: string;
    precioProducto: number;
  }