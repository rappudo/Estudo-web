const net = require('node:net');

const server = net.createServer((socket) => {

    console.log('Connection started');

    socket.write('Olá Cliente!');

    socket.on('data', (data) => {

        console.log(data);
    })
});

server.listen(3000, 'localhost', (callback) => {

    console.log("Listening on port 3000");
})