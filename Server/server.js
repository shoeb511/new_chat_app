const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const PORT = 3000;

const server = http.createServer(app);

const io = new Server(server);

const text = "Hello from server";
const id = "123abc";
const usernamefromsocket = "annonymous";

io.on("connection", (socket) => {
  // CORRECTED: give every socket a default username so messages never show as anonymous
  socket.username = `User-${socket.id.slice(-4)}`;
  console.log("user connected:", socket.id, "as", socket.username);

  socket.on("set_username", (username) => {
    // CORRECTED: update socket username when client provides one
    socket.username = username;
    console.log(`user ${socket.id} set username to ${username}`);
  });

  socket.on("chat_message", (msg) => {
    console.log("message reciewved", msg);

    const messageData = {
      text: msg,
      id: socket.id,
      username: socket.username // CORRECTED: always include username sent to clients
    };
    console.log("username attached to message:", socket.username);

    io.emit("chat_message", messageData);
  });

  

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Server running on port 3000");
});
