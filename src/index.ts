import { CartService } from "./cart/cart.service";
import { ProductRepository } from "./products/product-local.repository";

const cart = new CartService(new ProductRepository());

cart.addToCart({ productId: "p1", quantity: 2 });
console.log(cart.getCart());