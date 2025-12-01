import { Product } from "./product";

export interface IProductRepository{
    findById(productId: string): Product | undefined
}