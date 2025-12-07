import { Product } from "../products/product";

export interface IProductRepository{
    findById(id: string) : Product | undefined;
}