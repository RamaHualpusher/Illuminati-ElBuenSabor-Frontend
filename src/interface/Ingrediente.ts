import { Rubro } from "./Rubro";
import { UnidadMedida } from "./UnidadMedida";
export interface Ingrediente {
  idIngrediente: number;
  nombre: string;
  estado: boolean;
  stockMinimo: number;
  stockActual: number;
  Rubro: Rubro;
  UnidadMedida: UnidadMedida;
}
