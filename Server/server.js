require("dotenv").config();
const connectDB = require("./configs/db");

const startServer = async () => {
    await connectDB();

    const http = require("http");
    const { Server } = require("socket.io");
    const app = require("./app");

    //const PORT = 3000;
    const server = http.createServer(app);
    const io = new Server(server);

    io.on("connection", (socket) => {
        socket.username = `User-${socket.id.slice(-4)}`;

        socket.on("set_username", (username) => {
            socket.username = username;
        });

        socket.on("chat_message", (msg) => {
            io.emit("chat_message", {
                text: msg,
                id: socket.id,
                username: socket.username
            });
        });
    });

    server.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
};

startServer();
