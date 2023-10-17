import { Ingredientes } from "./Ingredientes";
import { Producto } from "./Producto";

export interface ProductoIngrediente {
  idProductoIngrediente: number;
  cantidad: number;
  // Producto: Producto; cambio 20/9/23
  Ingredientes: Ingredientes;
}
