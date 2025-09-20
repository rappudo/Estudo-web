const net = require('node:net');

const conexao = net.connect({port:3000, host:'localhost'});

conexao.on('connect', (conn) => {

    conexao.write('Olá Server!');
});
