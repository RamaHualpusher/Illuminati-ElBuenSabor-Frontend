import { IRubroNew } from "./IRubro";
import { IProductoIngrediente, IProductoIngredienteDto } from "./IProductoIngrediente";
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
  rubro: IRubroNew;
  productosIngredientes?: IProductoIngrediente[];
}

export interface IProductoDto extends IBase { 
  nombre: string;
  tiempoEstimadoCocina: number;
  denominacion: string;
  imagen: string;
  stockMinimo: number;
  stockActual: number;
  preparacion: string;
  precio: number;
  esBebida: boolean;
  rubro: IRubroNew;
  productosIngredientes?: IProductoIngredienteDto[];
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



