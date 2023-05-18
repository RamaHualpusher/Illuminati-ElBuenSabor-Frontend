export interface Products {
  Imagen: string;
  Nombre: string;
  Rubro: string;
  PrecioVenta: number;
  TiempoCocina: number;
  Estado: string;
  Descripcion: string;
  Ingredients: OrderIngredient[];
}

export interface OrderIngredient {
  Ingredient: string;
  Cuantity: string;
  UMedida: string;
}
export interface Articulo {
  idArticulo: number;
  denominacion: string;
  precioCompra: number;
  precioVenta: number;
  stockMinimo: number;
  stockActual: number;
  esInsumo: boolean;
  UnidadMedida: UnidadMedida;
  Pedido: Pedido;
}
export interface UnidadMedida {
  idUnidadMedida: number;
  denominacion: string;
}

export interface Pedido {
  idPedido: number;
  numeroPedido: number;
  fechaPedido: Date;
  horaEstimadaFin: Date;
  tipoEnvio: string;
  TipoEntregaPedido: TipoEntregaPedido;
  EstadoPedido: EstadoPedido;
  TipoPago: TipoPago;
  Usuario: Usuario;
  Articulo: Articulo;
}
export interface TipoPago {
  idTipoPago: number;
  descripcion: string;
  MercadoPagoData: MercadoPagoDatos;
}
export interface MercadoPagoDatos {
  idMercadoPagoData: number;
  identificadorPago: number;
  fechaCreacion: Date;
  fechaAprobacion: Date;
  formaPago: string;
  metodoPago: string;
  numTarjeta: string;
  estado: string;
}
export interface EstadoPedido {
  idOrderStatus: number;
  descripcion: string;
  tiempo: string;
}

export interface TipoEntregaPedido {
  idTipoEntregaPedido: number;
  descripcion: string;
}

export interface Empleado {
  Id: number;
  Nombre: string;
  Apellido: string;
  Email: string;
  Rol: string;
  Estado: number;
}

export interface Rubro {
  id: number;
  nombre: string;
}

export interface Ingrediente {
  id: number;
  nombre: string;
  rubro: string;
  minStock: number;
  stockActual: number;
  precio: number;
  um: string;
}

export interface Producto {
  id: number;
  nombre: string;
  rubro: string;
  tiempo: number;
  precio: number;
}

export interface RubrosIngredientes {
  id: number;
  nombre: string;
  rubro: string;
}
export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  clave: string;
  telefono: string;
  Rol: Rol;
  Domicilio: Domicilio;
}
export interface Rol {
  idRol: number;
  nombreRol: string;
}

export interface Domicilio {
  idDomicilio: number;
  calle: string;
  numero: number;
  localidad: string;
}
//agregar aca las demas interfaces para completar dentro del codigo de front
