import { MercadoPagoDatos } from './MercadoPagoDatos';

export interface TipoPago {
    idTipoPago: number;
    descripcion: string;
    MercadoPagoDatos: MercadoPagoDatos;
  }