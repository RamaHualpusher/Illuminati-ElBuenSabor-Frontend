import { IRubro } from "./IRubro";
import { IBase } from "./IBase";

export interface IIngredientes extends IBase{
  nombre: string;
  stockMinimo: number;
  stockActual: number;
  precioCosto: number;
  unidadMedida: string;
  rubro: IRubro;
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
  handleRubroEdit: (rubro: IRubro) => void;
  selectedRubro: IRubro | null;
}

export interface IAddRubroIngredienteModalProps {
  show: boolean;
  handleClose: () => void;
  handleRubroAdd: (rubro: IRubro) => void;
}

export interface IEditCompraIngredientesModalProps {
  show: boolean;
  handleClose: () => void;
  handleIngredientesEdit: (ingredientes: IIngredientes) => void;
  selectedIngredientes: IIngredientes | null;
}
