import { Usuario } from "./Usuario";
import { DetallePedido } from "./DetallePedido";
import { MercadoPagoDatos } from './MercadoPagoDatos';

export interface Pedido {
  idPedido: number;
  numeroPedido: number;
  horaEstimadaFin: Date;
  esDelivery: boolean;
  esEfectivo: boolean;
  estadoPedido: string;
  fechaPedido: Date;
  Usuario: Usuario;
  DetallePedido: DetallePedido[];
  MercadoPagoDatos?: MercadoPagoDatos; //cambio 20/9/23
  totalPedido: number; //(esto no va en al base de datos ya que es persistente)
}
