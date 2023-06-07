import { BiCart } from 'react-icons/bi';
import { RiAddFill, RiSubtractFill, RiCloseFill } from 'react-icons/ri';

export function AddToCartIcon() {
  return <RiAddFill className="bi bi-cart text-white"  />;
}

export function RemoveFromCartIcon() {
  return <RiSubtractFill className="bi bi-cart text-white"  />;
}

export function ClearCartIcon() {
  return <RiCloseFill className="bi bi-cart text-white"  />;
}

export function CartIcon() {
  return <BiCart className="bi bi-cart text-white" />;
}
