import { Rubro } from "./Rubro";
import { ProductoIngrediente } from "./ProductoIngrediente";

export interface Ingredientes {
  idIngredientes: number;
  nombre: string;
  estado: boolean;
  stockMinimo: number;
  stockActual: number;
  precioCosto: number;
  Rubro: Rubro;
  unidadMedida: string;
  ProductoIngrediente: ProductoIngrediente[];
}

export interface AddIngredienteModalProps {
  show: boolean;
  handleClose: () => void;
  handleIngredienteAdd: (ingrediente: Ingredientes) => void;
}

export interface EditIngredientesModalProps {
  show: boolean;
  handleClose: () => void;
  handleIngredientesEdit: (ingredientes: Ingredientes) => void;
  selectedIngredientes: Ingredientes | null;
}
