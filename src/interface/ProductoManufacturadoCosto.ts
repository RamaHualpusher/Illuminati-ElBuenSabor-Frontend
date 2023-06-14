import { ProductoManufacturado } from "./ProductoManufacturado";

export interface ProductoManufacturadoCosto {
    idProductoManufacturadoCosto: number;
    precioCosto: number;
    cantidad: number;
    fecha: Date;
    ProductoManufacturado: ProductoManufacturado[];
  }