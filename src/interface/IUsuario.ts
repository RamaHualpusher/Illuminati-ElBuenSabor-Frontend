import { IDomicilio } from "./IDomicilio";
import { IRol } from "./IRol";
import { IBase } from "./IBase";

export interface IUsuario extends IBase {
  nombre: string;
  apellido: string;
  email: string;
  clave: string;
  claveConfirm: string;
  telefono: string;
  domicilio: IDomicilio;
  rol: IRol;
}

export interface IEditUsuarioFromCliente extends IBase {
  nombre: string;
  apellido: string;
  email: string;
  clave: string;
  telefono: string;
  Domicilio?: IDomicilio;
}

export interface IEditUsuarioFromAdmin extends IBase {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: IRol;
  domicilio: IDomicilio;
}

export interface IUsuarioCompleto extends IBase {
  nombre: string;
  apellido: string;
  email: string;
  clave: string;
  telefono: string;
  idDomicilio: number;
  calle: string;
  numero: number;
  localidad: string;
  idRol: number;
  nombreRol: string;
}

export interface IAddEmpleadoModalProps {
  show: boolean;
  handleClose: () => void;
  handleEmpleadoAdd: (empleado: IUsuario) => void;
}

export interface IEditEmpleadoModalProps {
  show: boolean;
  handleClose: () => void;
  handleEmpleadoEdit: (empleado: IEditUsuarioFromAdmin) => void;
  selectedEmpleado: IEditUsuarioFromAdmin | null;
}
