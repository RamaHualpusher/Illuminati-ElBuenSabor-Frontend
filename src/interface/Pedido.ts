import { Usuario } from "./Usuario";
import { DetallePedido } from "./DetallePedido";

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
  totalPedido: number; //(esto no va en al base de datos ya que es persistente)
}
