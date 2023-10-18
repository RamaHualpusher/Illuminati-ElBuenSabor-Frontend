import { CartItem } from "../context/cart/CartProvider";
import { DetallePedido } from "./DetallePedido";
import { Producto } from "./Producto";

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
  Producto?: Producto;
}

export interface ICartItemProps {
  item: CartItem & { DetallePedido: DetallePedido };
}
