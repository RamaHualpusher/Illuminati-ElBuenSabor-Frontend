import { IBase } from "./IBase";

export interface IMercadoPagoDatos extends IBase {
  fechaCreacion: Date;
  estado: String;
  preferenceId: String;
}
