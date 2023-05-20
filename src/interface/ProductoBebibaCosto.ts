import { Articulo } from "./Articulo";
export interface ProductoBebibaCosto {
  idProductoBebibaCosto: number;
  costo: number;
  fecha: Date;
  Articulo: Articulo[];
}
