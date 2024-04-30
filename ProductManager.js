// Archivo: productManager.js
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

module.exports = ProductManager;