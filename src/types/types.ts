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