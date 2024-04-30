const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const ProductManager = require('./ProductManager');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('createProduct', (product) => {        
        console.log('Producto creado:', product);
        io.emit('updateProducts', product);
    });

   
    socket.on('deleteProduct', (productId) => {
        console.log('Producto eliminado:', productId);
        io.emit('updateProducts');
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});


app.get('/', (req, res) => {
    res.render('home', { products: ProductManager });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: ProductManager});
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});