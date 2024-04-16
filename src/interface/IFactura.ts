import { IBase } from "./IBase";
import { IPedidoDto } from "./IPedido";

export interface IFactura extends IBase {
  fechaFactura: Date;
  pedido: IPedidoDto;
}
