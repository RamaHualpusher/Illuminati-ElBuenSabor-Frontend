import { IBase } from "./IBase";
import { IDetalleFactura } from "./IDetalleFactura";
import { IPedidoDto } from "./IPedido";
import { IUsuario } from "./IUsuario";

export interface IFactura extends IBase {
  fechaPedido: Date;
  fechaFactura: Date;
  esDelivery: boolean;
  esEfectivo: boolean;
  usuario: IUsuario;
  total: number; // este no deberia ir
  detalleFactura: IDetalleFactura[];
  pedido: IPedidoDto;
}
