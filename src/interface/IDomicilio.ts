import { IBase } from "./IBase";

export interface IDomicilio extends IBase {
  calle: string;
  numero: number;
  localidad: string;
}

export interface IAddDireccionModalProps {
  show: boolean;
  handleClose: () => void;
  handleDireccionAdd: (domicilio: IDomicilio) => void;
}

export interface IEditDireccionModalProps {
  show: boolean;
  handleClose: () => void;
  handleDireccionEdit: (domicilio: IDomicilio) => void;
  selectedDireccion: IDomicilio | null;
}
