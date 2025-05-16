import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Product } from '../models/product';

// Obtener todos los productos
export const getAllProducts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const productRepo = AppDataSource.getRepository(Product);
        const products = await productRepo.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Obtener producto por ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const productRepo = AppDataSource.getRepository(Product);
        const product = await productRepo.findOne({ where: { id: parseInt(id) } });

        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Crear producto
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, imageUrl, stock } = req.body;

        if (!name || !description || price == null) {
            res.status(400).json({ message: 'Nombre, descripción y precio son requeridos' });
            return;
        }

        const productRepo = AppDataSource.getRepository(Product);
        const newProduct = productRepo.create({ name, description, price, imageUrl, stock });

        await productRepo.save(newProduct);
        res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Actualizar producto
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, price, imageUrl, stock, isActive } = req.body;

        const productRepo = AppDataSource.getRepository(Product);
        const product = await productRepo.findOne({ where: { id: parseInt(id) } });

        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.imageUrl = imageUrl ?? product.imageUrl;
        product.stock = stock ?? product.stock;
        product.isActive = isActive ?? product.isActive;

        await productRepo.save(product);
        res.status(200).json({ message: 'Producto actualizado', product });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Eliminar producto
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const productRepo = AppDataSource.getRepository(Product);
        const result = await productRepo.delete(parseInt(id));

        if (result.affected === 0) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
