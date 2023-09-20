export interface MercadoPagoDatos {
  idMercadoPagoDatos: number;
  identificadorPago: number;
  fechaCreacion: Date;
  fechaAprobacion: Date;
  formaPago: string;
  metodoPago: string;
  numTarjeta: string;
  estado: string;
}
