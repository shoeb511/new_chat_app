const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const PORT = 3000;

const server = http.createServer(app);

const io = new Server(server);

const text = "Hello from server";
const id = "123abc";

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("chat_message", (msg) => {
    console.log("message reciewved", msg);

    const messageData = {
      text:msg,
      id:socket.id
    };

    io.emit("chat_message", messageData);
  });

  

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Server running on port 3000");
});
