const fs = require("node:fs/promises");
const tls = require('node:tls');

const startServer = async () => {

    const options = {
        key: await fs.readFile('./key.pem', 'utf8'),
        cert: await fs.readFile('./cert.pem', 'utf8'),
    };

    const tslServer = tls.createServer(options, (socket) => {
        console.log("Server Connect!");
    });

    tslServer.listen(3000, "localhost", (callback) => {
        console.log("Listening on port 3000");
    });

};

startServer();

