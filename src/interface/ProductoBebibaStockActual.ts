import { Articulo } from "./Articulo";
export interface ProductoBebibaStockActual {
  idProductoBebibaStockActual: number;
  stockActual: number;
  fecha: Date;
  Articulo: Articulo[];
}
