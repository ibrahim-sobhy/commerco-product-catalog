import { CartCalculator } from "../src/cart/cart-calculator";
import { CartService } from "../src/cart/cart.service";
import { ProductRepository } from "../src/products/product.repository";

describe("CartCalculator", () => {

    const createRepoMock = (): jest.Mocked<ProductRepository> => ({
        findById: jest.fn()
    });

    it("should return total price without discount", () => {
        const repoMock = createRepoMock();

        repoMock.findById.mockReturnValue({
            id: "p1",
            name: "Item",
            price: 100,
            stock: 10
        });

        const cartService = new CartService(repoMock);
        const calculator = new CartCalculator(cartService);

        cartService.addToCart({ productId: "p1", quantity: 1 });

        expect(calculator.getTotalPrice()).toBe(100);
    });

    it("should apply discount when total is over 200", () => {
        const repoMock = createRepoMock();

        repoMock.findById.mockReturnValue({
            id: "p1",
            name: "Item",
            price: 300,
            stock: 10
        });

        const cartService = new CartService(repoMock);
        const calculator = new CartCalculator(cartService);

        cartService.addToCart({ productId: "p1", quantity: 1 });

        expect(calculator.getTotalPrice()).toBe(270);
    });

});