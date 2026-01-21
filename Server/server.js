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

    const MessageModel = require("./models/message.model");

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

        const senderId = socket.userId.toString();
        console.log("user connected ", senderId);

        onlineUsers.set(senderId, socket.id);
        console.log("user added in online map", onlineUsers);


        // recieving live messages from users
        socket.on("private_message", async (data) => {
            try {
                const {receiverId, text} = data;

                if(!receiverId || !text){
                    return;
                }

                console.log(`meeage from : ${senderId} to : ${receiverId}`);  

                // save message to DB
                const message = await MessageModel.create({
                    senderId,
                    receiverId,
                    text,
                    status: "sent"
                });

                //check whether the reciever is online
                const receiverSocketId = onlineUsers.get(receiverId);

                if(receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", {
                        _id: message._id,
                        senderId,
                        receiverId,
                        text,
                        createdAt:message.createdAt
                    });

                    message.status = "delivered";
                    await message.save();

                    console.log("message delivered in real time ");
                }
                else{
                    console.log("reciever is offline message stored in db");
                }
            }
            catch(err) {
                console.error("private message error", err.message);
            }
        });

            

        // delete offline users from online usersmap after disconnect the user

        socket.on("disconnect", () => {
            onlineUsers.delete(senderId);
            console.log("user disconnected..", onlineUsers);
        });
    });



    server.listen(process.env.PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
};

startServer();
