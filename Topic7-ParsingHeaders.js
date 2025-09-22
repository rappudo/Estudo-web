const fs = require("node:fs/promises");
const tls = require('node:tls');

const startServer = async () => {

    const options = {
        key: await fs.readFile('./key.pem', 'utf8'),
        cert: await fs.readFile('./cert.pem', 'utf8'),
    };

    const tslServer = tls.createServer(options, (socket) => {
        console.log("Server Connect!");

        socket.on('data', async (data) => {

            const requestLines = data.toString().split('\r\n');
            const firstLineParts = requestLines[0].split(' ');

            const method = firstLineParts[0];
            const path = firstLineParts[1];

            const headers = {};

            for (let i = 1; i < requestLines.length; i++) {
                const currentLine = requestLines[i];
                if (currentLine == '') {
                    break;
                } else {
                    const temp = currentLine.split(':');
                    const key = temp[0];
                    const value = temp.slice(1).join(':');
                    headers[key] = value.trim();
                }
            }

            console.log(headers);
            console.log('Método:', method);
            console.log("Caminho:", path);

            try {
                const fileContent = await fs.readFile('.' + path, "utf8");

                const response =
                    "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: text/html; charset=UTF-8\r\n" +
                    "Content-Length: " +
                    fileContent.length +
                    "\r\n\r\n" +
                    fileContent.toString();
                socket.write(response);

            } catch (error)  {
                const response = "HTTP/1.1 404 Not Found\r\n" +
                    "Content-Type: text/html; charset=UTF-8\r\n" +
                    "Content-Length: 1234\r\n\r\n" +
                    "<!doctype html><h1>404: Não Encontrado</h1>";
                socket.write(response);
            }
        });

    });

    tslServer.listen(3000, "localhost", (callback) => {
        console.log("Listening on port 3000");
    });

};

startServer();

