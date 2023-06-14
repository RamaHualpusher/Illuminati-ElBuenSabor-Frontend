import { Rubro } from "./Rubro";
import { UnidadMedida } from "./UnidadMedida";

export interface Articulo {
    idArticulo: number;
    denominacion: string;
    precioCompra: number;
    // precioVenta: number;
    stockMinimo: number;
    stockActual: number;
    esBebida: boolean;
    UnidadMedida: UnidadMedida;
    Rubro: Rubro;
  }