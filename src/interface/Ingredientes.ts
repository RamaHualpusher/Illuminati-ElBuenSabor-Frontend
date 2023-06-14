import { Rubro } from "./Rubro";
import { UnidadMedida } from "./UnidadMedida";

export interface Ingredientes {
  idIngredientes: number;
  nombre: string;
  estado: boolean;
  stockMinimo: number;
  stockActual: number;
  Rubro: Rubro;
  UnidadMedida: UnidadMedida;
}
