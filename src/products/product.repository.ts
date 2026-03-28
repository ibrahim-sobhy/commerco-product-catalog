import { Product } from "./product";

export interface ProductRepository {
    findById(productId: string): Product | undefined
}