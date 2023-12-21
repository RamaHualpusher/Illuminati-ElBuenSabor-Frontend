import { IRubro } from "./IRubro";
import { IProductoIngrediente } from "./IProductoIngrediente";
import { IBase } from "./IBase";

export interface IProducto extends IBase {
  nombre: string;
  tiempoEstimadoCocina: number;
  denominacion: string;
  imagen: string;
  stockMinimo: number;
  stockActual: number;
  preparacion: string;
  precio: number;
  esBebida: boolean;
  Rubro: IRubro;
  ProductoIngrediente?: IProductoIngrediente[];
}

export interface IEditProductoModalProps {
  show: boolean;
  handleClose: () => void;
  handleProductoEdit: (producto: IProducto) => void;
  selectedProducto: IProducto | null;
}
export interface IAddProductoModalProps {
  show: boolean;
  handleClose: () => void;
  handleProductoAdd: (producto: IProducto) => void;
}

///Rubros

export interface IEditRubroProductoModalProps {
  show: boolean;
  handleClose: () => void;
  handleRubroEdit: (rubro: IRubro) => void;
  selectedRubro: IRubro | null;
}

export interface IAddRubroProductoModalProps {
  show: boolean;
  handleClose: () => void;
  handleRubroAdd: (rubro: IRubro) => void;
}
