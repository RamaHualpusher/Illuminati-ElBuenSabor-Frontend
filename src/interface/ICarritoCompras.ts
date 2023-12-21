import { CartItem } from "../context/cart/CartProvider";
import { IDetallePedido } from "./IDetallePedido";
import { IProducto } from "./IProducto";

export interface ICartIconProps {
  icon: string;
  onClick: () => void;
}

export interface ICartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
  title: string;
  Producto?: IProducto;
}

export interface ICartItemProps {
  item: CartItem & { DetallePedido: IDetallePedido };
}