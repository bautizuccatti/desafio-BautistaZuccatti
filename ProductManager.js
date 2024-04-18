const express = require('express');
const fs = require('fs').promises;

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];
        this.productIdCounter = 1;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.products = JSON.parse(data);
            this.productIdCounter = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error al guardar productos:", error);
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        // Validar que todos los campos sean proporcionados
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            console.error("Ya existe un producto con el mismo código.");
            return;
        }

        const newProduct = {
            id: this.productIdCounter++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.products.push(newProduct);
        await this.saveProducts();
    }

    async updateProduct(id, title, description, price, thumbnail, code, stock) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            console.error("Producto no encontrado.");
            return;
        }

        const updatedProduct = {
            ...this.products[index],
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        const codeAlreadyExists = this.products.some(product => product.code === code && product.id !== id);
        if (codeAlreadyExists) {
            console.error("Ya existe un producto con el mismo código.");
            return;
        }

        this.products[index] = updatedProduct;
        await this.saveProducts();
    }

    getProducts(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        } else {
            return this.products;
        }
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado.");
        }
    }
}

const app = express();
const port = 3000;

const manager = new ProductManager('products.json');

app.get('/products', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const products = manager.getProducts(limit);
    res.json({ products });
});

app.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = manager.getProductById(productId);
    if (product) {
        res.json({ product });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});