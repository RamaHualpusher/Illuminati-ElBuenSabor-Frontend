export interface Products {
  Imagen: string;
  Nombre: string;
  Rubro: string;
  PrecioVenta: number;
  TiempoCocina: number;
  Estado: string;
  Descripcion: string;
  Ingredients: OrderIngredient[];
}

export interface OrderIngredient {
  Ingredient: string;
  Cuantity: string;
  UMedida: string;
}

export interface cashierOrder {
  IdPedido: number;
  FechaPedido: string;
  FormaEntrega: string;
  FormaPago: string;
  Pagado: string;
  Estado: string;
}

export interface Empleado {
  Id: number;
  Nombre: string;
  Apellido: string;
  Email: string;
  Rol: string ;
  Estado: number;
}

export interface Rubro {
  id: number;
  nombre: string;
}

export interface Ingrediente {
  id: number;
  nombre: string;
  rubro: string;
  minStock: number;
  stockActual: number;
  precio: number;
  um: string;
}

export interface Producto {
  id: number;
  nombre: string;
  rubro: string;
  tiempo: number;
  precio: number;
}

export interface RubrosIngredientes{
  id: number;
  nombre: string;
  rubro: string;
}
//agregar aca las demas interfaces para completar dentro del codigo de front
