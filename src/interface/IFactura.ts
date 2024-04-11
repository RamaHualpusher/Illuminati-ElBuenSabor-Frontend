import { IBase } from "./IBase";
import { IDetalleFactura } from "./IDetalleFactura";
import { IUsuario } from "./IUsuario";

export interface IFactura extends IBase {  
  fechaPedido: Date;
  esEfectivo: boolean;
  total: number;
  usuario: IUsuario;
  detalleFactura: IDetalleFactura[];
}
