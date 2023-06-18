import { Domicilio } from "./Domicilio";
import { Rol } from "./Rol";

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  clave: string;
  telefono: string;
  Domicilio: Domicilio;
  Rol: Rol;
}

export interface EditUsuarioFromAdmin {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  Rol: Rol;
}

export interface UsuarioCompleto {
  idUsuarioCompleto: number;
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
