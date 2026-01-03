require("dotenv").config();
const connectDB = require("./configs/db");

const startServer = async () => {
    await connectDB();

    const jwt = require("jsonwebtoken");
    const onlineUsers = require("./utils/onlineUsers");

    const http = require("http");
    const { Server } = require("socket.io");
    const app = require("./app");

    //const PORT = 3000;
    const server = http.createServer(app);
    const io = new Server(server);

    // first check and verify the token attacked with request and attached with socket
    io.use((socket, next) => {
        
        console.log("socket io.use middleware hit");

        try {   
            const token = socket.handshake.auth?.token;

            if(!token){
                throw next(new Error("token is missing :" ));
            }

            console.log("handshake with token ", token );

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            socket.userId = decoded.userId;

            console.log("userId assigned to socket.user id : " , socket.userId);

            next();
        }
        catch(err) {
            console.log(" unauthorized user he ye ");
            next(new Error("unauthorized user ---"));
        }
    })



    io.on("connection", (socket) => {

        // socket.username = `User-${socket.id.slice(-4)}`;

        // socket.on("set_username", (username) => {
        //     socket.username = username;
        // });

        // socket.on("chat_message", (msg) => {
        //     io.emit("chat_message", {
        //         text: msg,
        //         id: socket.id,
        //         username: socket.username
        //     });
        // });

        const userId = socket.userId.toString();
        console.log("user connected ", userId);

        onlineUsers.set(userId, socket.id);
        console.log("user added in online map", onlineUsers);
            

        // delete offline users from online usersmap after disconnect the user

        socket.on("disconnect", () => {
            onlineUsers.delete(userId);
            console.log("user disconnected..", onlineUsers);
        });
    });



    server.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
};

startServer();
