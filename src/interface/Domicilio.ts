import { Usuario } from "./Usuario";

export interface Domicilio {
    idDomicilio: number;
    calle: string;
    numero: number;
    localidad: string;
    Usuario: Usuario;
  }