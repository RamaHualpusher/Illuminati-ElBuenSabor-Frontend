import { Ingrediente } from './interfaces';
import { ProductoManufacturado } from './ProductoManufacturado';

export interface ProductoIngrediente{
    idProductoIngrediente: number;
    cantidad: number;
    ProductoManufacturado: ProductoManufacturado[];
    Ingrediente: Ingrediente[];
  }