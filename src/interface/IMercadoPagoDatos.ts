import { IBase } from "./IBase";
import { IPedido } from "./IPedido";

export interface IMercadoPagoDatos extends IBase {
  fechaCreacion: Date;
  estado: String;
  preferenceId: String;
  pedido: IPedido
}
