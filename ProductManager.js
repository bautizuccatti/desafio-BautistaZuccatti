const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.productIdCounter = 1;
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                const lastProduct = this.products[this.products.length - 1];
                this.productIdCounter = lastProduct.id + 1;
            }
        } catch (err) {
            console.error("Error al cargar los productos:", err.message);
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (err) {
            console.error("Error al guardar los productos:", err.message);
        }
    }

    addProduct(productData) {
        const { title, description, price, thumbnail, code, stock } = productData;
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
        this.saveProducts();
        console.log("Producto añadido correctamente:", newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado.");
        }
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            this.saveProducts();
            console.log("Producto actualizado correctamente.");
        } else {
            console.error("Producto no encontrado.");
        }
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            console.log("Producto eliminado correctamente.");
        } else {
            console.error("Producto no encontrado.");
        }
    }
}

const manager = new ProductManager('productos.json');

manager.addProduct({
    title: "Producto 1",
    description: "Descripción del producto 1",
    price: 10,
    thumbnail: "ruta1",
    code: "ABC123",
    stock: 20
});
manager.addProduct({
    title: "Producto 2",
    description: "Descripción del producto 2",
    price: 20,
    thumbnail: "ruta2",
    code: "DEF456",
    stock: 15
});

console.log(manager.getProducts());

console.log(manager.getProductById(1));
console.log(manager.getProductById(3));

manager.updateProduct(1, { price: 15, stock: 25 });
console.log(manager.getProducts());

manager.deleteProduct(2);
console.log(manager.getProducts());