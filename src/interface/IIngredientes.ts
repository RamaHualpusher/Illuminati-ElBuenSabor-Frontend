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

export interface IIngredientesDto extends IBase {
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

export interface IEditCompraIngredientesModalProps {
  show: boolean;
  handleClose: () => void;
  handleIngredientesEdit: (ingredientes: IIngredientes) => void;
  selectedIngredientes: IIngredientes | null;
}