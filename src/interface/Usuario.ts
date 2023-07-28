import { Domicilio } from "./Domicilio";
import { Rol } from "./Rol";

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  clave: string;
  telefono: string;
  estado: boolean;
  Domicilio: Domicilio;
  Rol: Rol;
}

export interface EditUsuarioFromCliente {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  clave: string;
  telefono: string;
  Domicilio?: Domicilio;
}

export interface EditUsuarioFromAdmin {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  estado: boolean;
  Rol: Rol;
}

export interface UsuarioCompleto {
  idUsuarioCompleto: number;
  nombre: string;
  apellido: string;
  email: string;
  clave: string;
  telefono: string;
  estado: boolean;
  idDomicilio: number;
  calle: string;
  numero: number;
  localidad: string;
  idRol: number;
  nombreRol: string;
}

export interface AddEmpleadoModalProps {
  show: boolean;
  handleClose: () => void;
  handleEmpleadoAdd: (empleado: Usuario) => void;
}

export interface EditEmpleadoModalProps {
  show: boolean;
  handleClose: () => void;
  handleEmpleadoEdit: (empleado: EditUsuarioFromAdmin) => void;
  selectedEmpleado: EditUsuarioFromAdmin | null;
}
