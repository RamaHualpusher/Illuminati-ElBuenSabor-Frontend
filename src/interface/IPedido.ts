import { IMercadoPagoDatos } from "./IMercadoPagoDatos";
import { IUsuario } from "./IUsuario";
import { IDetallePedido } from "./IDetallePedido";
import { IBase } from "./IBase";

export interface IPedido extends IBase {
  numeroPedido: number;
  horaEstimadaFin: Date;
  esDelivery: boolean;
  esEfectivo: boolean;
  estadoPedido: string;
  fechaPedido: Date;
  Usuario: IUsuario;
  DetallePedido: IDetallePedido[];
  MercadoPagoDatos?: IMercadoPagoDatos;
  totalPedido: number; //(esto no va en al base de datos ya que es persistente)
}
