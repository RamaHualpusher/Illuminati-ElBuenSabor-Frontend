export interface Products {
    Imagen: string;
    Nombre: string;
    Rubro: string;
    PrecioVenta: number;
    TiempoCocina: number;
    Estado: string;
    Descripcion: string;
    Ingredients: OrderIngredient[]
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

export interface cashierOrder {
  IdPedido: number;
  FechaPedido: string;
  FormaEntrega: string;
  FormaPago: string;
  Pagado: string;
  Estado: string;
}
//agregar aca las demas interfaces para completar dentro del codigo de front