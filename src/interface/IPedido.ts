import { IMercadoPagoDatos } from "./IMercadoPagoDatos";
import { IUsuario } from "./IUsuario";
import { IDetallePedido } from "./IDetallePedido";
import { IBase } from "./IBase";

export interface IPedido extends IBase {
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
  horaEstimadaFin: Date;
  esDelivery: boolean;
  esEfectivo: boolean;
  estadoPedido: string;
  fechaPedido: Date;
  usuario: IUsuario;
  total: number; // este no deberia ir
  detallesPedidos: IDetallePedido[];
  mercadoPagoDatos?: IMercadoPagoDatos;   
}
export interface IPedidoDtoVuelto extends IBase {
  horaEstimadaFin: Date;
  esDelivery: boolean;
  esEfectivo: boolean;
  estadoPedido: string;
  devuelto?: boolean;
  fechaPedido: Date;
  usuario: IUsuario;
  total: number; // este no deberia ir
  detallesPedidos: IDetallePedido[];
  mercadoPagoDatos?: IMercadoPagoDatos;   
}