import { Domicilio } from "./Domicilio";
import { Rol } from "./Rol";

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  clave: string;
  telefono: string;
  Rol: Rol;
  Domicilio: Domicilio;
}
