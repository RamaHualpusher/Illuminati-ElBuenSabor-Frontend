import { Articulo } from "./Articulo";
export interface ProductoBebibaVenta {
  idProductoBebibaStockVenta: number;
  cantidad: number;
  fecha: Date;
  precioVenta: number;
  Articulo: Articulo[];
}
