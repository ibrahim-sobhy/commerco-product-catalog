import { CartItem } from "../cart/cart-item";

export interface Cart{
    items: CartItem[],
    totalPrice?: number;
}