import { CartService } from "./cart/cart.service";
import { ProductRepository } from "./products/product-local.repository";

const storage = new ProductRepository;
const cart = new CartService(storage);

cart.addToCart({ productId: "p1", quantity: 2 });

( async () => {
    console.log(await cart.getCalculatedTotalPrice());
})();