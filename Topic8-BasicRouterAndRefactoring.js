const fs = require("node:fs/promises");
const tls = require('node:tls');

async function handleApiUser(socket) {
    const user = { nome: "nomelegal", id: "1"};
    const body = JSON.stringify(user);
    const response =
        "HTTP/1.1 200 OK\r\n" +
        "Content-Type: application/json; charset=UTF-8\r\n" +
        "Content-Length: " +
        body.length +
        "\r\n\r\n" +
        body;
    socket.end(response);
}

async function handleStaticFile(socket, path) {

    try {
        const fileContent = await fs.readFile('.' + path, "utf8");

        const response =
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: text/html; charset=UTF-8\r\n" +
            "Content-Length: " +
            fileContent.length +
            "\r\n\r\n" +
            fileContent.toString();
        socket.end(response);

    } catch (error) {
        handleNotFound(socket);
    }

}

async function handleNotFound(socket) {
    const response = "HTTP/1.1 404 Not Found\r\n" +
        "Content-Type: text/html; charset=UTF-8\r\n" +
        "Content-Length: 39\r\n\r\n" +
        "<!doctype html><h1>404: Não Encontrado</h1>";
    socket.end(response);
}

function parseHeaders(requestString) {
    const requestLines = requestString.toString().split('\r\n');
    const firstLineParts = requestLines[0].split(' ');

    const parsedRequest = {
        method: '',
        path: '',
        headers: {}
    };
    parsedRequest.method = firstLineParts[0].trim();
    parsedRequest.path = firstLineParts[1].trim();

    for (let i = 1; i < requestLines.length; i++) {
        const currentLine = requestLines[i];
        if (currentLine == '') {
            break;
        } else {
            const temp = currentLine.split(':');
            const key = temp[0];
            const value = temp.slice(1).join(':');
            parsedRequest.headers[key] = value.trim();
        }
    }

    return parsedRequest;
}

const startServer = async () => {

    const options = {
        key: await fs.readFile('./key.pem', 'utf8'),
        cert: await fs.readFile('./cert.pem', 'utf8'),
    };

    const tslServer = tls.createServer(options, (socket) => {
        console.log("Connection Established!");

        socket.on('data', async (data) => {

            const request = parseHeaders(data.toString());

            console.log(request);

            if (request.path === '/') {
                handleStaticFile(socket, '/index.html');
            } else if (request.path === '/api/user') {
                handleApiUser(socket);
            } else {
                handleStaticFile(socket, request.path);
            }

        });
    });

    tslServer.listen(3000, "localhost", (callback) => {
        console.log("Listening on port 3000");
    });

};

startServer();