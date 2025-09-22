const net = require("node:net");
const fs = require("node:fs/promises");

const server = net.createServer((socket) => {
  console.log("Connection started");

  socket.on("data", async (data) => {
    const requestLines = data.toString().split("\r\n");
    const firstLineParts = requestLines[0].split(" ");

    const method = firstLineParts[0];
    const path = firstLineParts[1];

    console.log("Método:", method);
    console.log("Caminho:", path);

    if (path == "/index.html") {
      const fileContent = await fs.readFile("./index.html", "utf8");
      const response =
        "HTTP/1.1 200 OK\r\n" +
        "Content-Type: text/html; charset=UTF-8\r\n" +
        "Content-Length: " +
        fileContent.length +
        "\r\n\r\n" +
        fileContent.toString();
      socket.write(response);
    }
  });
});

server.listen(3000, "localhost", (callback) => {
  console.log("Listening on port 3000");
});
