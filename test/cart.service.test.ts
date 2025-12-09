import { CartService } from "../src/cart/cart.service";
import { IProductRepository } from "../src/interfaces/product.repository";

describe("CartService", () => {
    it("should add items to the cart", () => {
        const repoMock: jest.Mocked<IProductRepository> = {
            findById: jest.fn()
        };
        repoMock.findById.mockReturnValue({ id: "p1", name: "Laptop", price: 1200, stock: 5});
        const cart = new CartService(repoMock);

        cart.addToCart({ productId: "p1", quantity: 2 });

        expect(cart.getCart().length).toBe(1);
        expect(cart.getCart()[0].quantity).toBe(2);
    });

    it("should validate product stock is greater than 0", () => {
        const repoMock: jest.Mocked<IProductRepository> = {
            findById: jest.fn()
        };
        repoMock.findById.mockReturnValue({ id: "p1", name: "Laptop", price: 1200, stock: 5});
        const cart = new CartService(repoMock);

        expect(() => {
            cart.addToCart({ productId: "outOfStockProduct", quantity: 10 });
        }).toThrow("Insufficient stock")
    });

    it("should return total price of cart with 10% discount", async () => {
        const repoMock: jest.Mocked<IProductRepository> = {
            findById: jest.fn()
        };
        repoMock.findById.mockReturnValue({ id: "p1", name: "Laptop", price: 1200, stock: 5});
        const cart = new CartService(repoMock);

        cart.addToCart({ productId: "p1", quantity: 2 });

        expect(await cart.getCalculatedTotalPrice()).toBe(2160);
    });
});