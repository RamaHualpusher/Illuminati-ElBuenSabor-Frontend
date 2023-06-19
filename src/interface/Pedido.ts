import { Usuario } from "./Usuario";
import { DetallePedido } from "./DetallePedido";

export interface Pedido {
  idPedido: number;
  numeroPedido: number;
  fechaPedido: Date;
  horaEstimadaFin: Date;
  esDelivery: boolean;
  estadoPedido: string;
  esEfectivo: boolean;
  Usuario: Usuario;
  DetallePedido: DetallePedido[];
  totalPedido:number; //(esto no va en al base de datos ya que es persistente)
}