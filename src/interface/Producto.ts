import { Rubro } from "./Rubro";
import { DetallePedido } from "./DetallePedido";
import { ProductoIngrediente } from "./ProductoIngrediente";

export interface Producto {
  idProducto: number;
  nombre: string;
  tiempoEstimadoCocina: number;
  denominacion: string;
  imagen: string;
  stockActual: number;
  stockMinimo: number;
  preparacion: string;
  precio: number;
  esBebida: boolean;
  estado : boolean;
  Rubro: Rubro;
  DetallePedido: DetallePedido[];
  ProductoIngrediente: ProductoIngrediente[];
}
export interface EditProductoModalProps {
  show: boolean;
  handleClose: () => void;
  handleProductoEdit: (producto: Producto) => void;
  selectedProducto: Producto | null;
}
export interface AddProductoModalProps {
  show: boolean;
  handleClose: () => void;
  handleProductoAdd: (producto: Producto) => void;
}


///Rubros

export interface EditRubroProductoModalProps {
  show: boolean;
  handleClose: () => void;
  handleRubroEdit: (rubro: Rubro) => void;
  selectedRubro: Rubro | null;
}

export interface AddRubroProductoModalProps {
  show: boolean;
  handleClose: () => void;
  handleRubroAdd: (rubro: Rubro) => void;
}