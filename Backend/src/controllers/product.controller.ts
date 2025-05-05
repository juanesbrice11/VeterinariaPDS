import { Request, Response } from 'express';
import { Product } from '../models/product';

export const getAllProducts = async (req: Request, res: Response) =>{
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err });
    }
}

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findOneBy({ id: Number(req.params.id) });
        if (!product)  res.status(404).json({ message: 'Product not found' });
        return
    } catch (err) {
        res.status(500).json({ message: 'Error fetching product', error: err });
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, imageUrl, stock } = req.body;
        const product = Product.create({ name, description, price, imageUrl, stock });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: 'Error creating product', error: err });
    }
}

export const updateProduct = async (req: Request, res: Response): Promise<void> => { 
    try {
        const id = Number(req.params.id);
        const product = await Product.findOneBy({ id });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        Object.assign(product, req.body);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: 'Error updating product', error: err });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await Product.delete(id);
        if (result.affected === 0) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting product', error: err });
    }
}

