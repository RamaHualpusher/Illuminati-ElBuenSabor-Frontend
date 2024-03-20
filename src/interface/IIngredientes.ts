import { IRubroNew } from "./IRubro";
import { IBase } from "./IBase";

export interface IIngredientes extends IBase {
  nombre: string;
  stockMinimo: number;
  stockActual: number;
  precioCosto: number;
  unidadMedida: string;
  rubro: IRubroNew;
}

export interface IIngredientesDto extends IBase{
  nombre: string;
  precioCosto: number;  
  rubro: IRubroNew;
}

export interface IAddIngredienteModalProps {
  show: boolean;
  handleClose: () => void;
  handleIngredienteAdd: (ingrediente: IIngredientes) => void;
}

export interface IEditIngredientesModalProps {
  show: boolean;
  handleClose: () => void;
  handleIngredientesEdit: (ingredientes: IIngredientes) => void;
  selectedIngredientes: IIngredientes | null;
}

///Rubros
export interface IEditRubroIngredientesModalProps {
  show: boolean;
  handleClose: () => void;
  handleRubroEdit: (rubro: IRubroNew) => void;
  selectedRubro: IRubroNew | null;
}

export interface IAddRubroIngredienteModalProps {
  show: boolean;
  handleClose: () => void;
  handleRubroAdd: (rubro: IRubroNew) => void;
}

export interface IEditCompraIngredientesModalProps {
  show: boolean;
  handleClose: () => void;
  handleIngredientesEdit: (
    cantidad: number,
    ingrediente: IIngredientes
  ) => Promise<void>;
  ingredientesBajoStock: IIngredientes[];
}
