import { IMercadoPagoDatos } from "./IMercadoPagoDatos";
import { IUsuario } from "./IUsuario";
import { IDetallePedido, IDetallePedidoDto } from "./IDetallePedido";
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
}

export interface IPedidoDto extends IBase {
  numeroPedido: number;
  horaEstimadaFin: Date;
  esDelivery: boolean;
  esEfectivo: boolean;
  estadoPedido: string;
  fechaPedido: Date;
  usuario: IUsuario;
  detallesPedidos: IDetallePedidoDto[];
  mercadoPagoDatos?: IMercadoPagoDatos;  
}
