import { IBase } from "./IBase";

export interface IMercadoPagoDatos extends IBase {
  identificadorPago: number;
  fechaCreacion: Date;
  fechaAprobacion: Date;
  formaPago: string;
  metodoPago: string;  
}
