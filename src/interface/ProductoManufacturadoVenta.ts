import { ProductoManufacturado } from "./ProductoManufacturado";

export interface ProductoManufacturadoVenta {
  idProductoManufacturadoVenta: number;
  precioVenta: number;
  cantidad: number;
  fecha: Date;
  ProductoManufacturado: ProductoManufacturado[];
}
