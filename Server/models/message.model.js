const mongoose = require("mongoose");
const User = require

const messageSchema = new mongoose.Schema(
    {
        senderId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        receiverId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        text : {
            type : String,
            required : true
        },

        status : {
            type : String,
            enum : ["sent", "received", "delivered"],

            default : "sent"
        }
    },
    { 
        timestamps : true
    }
);

messageSchema.index({ senderId : 1, receiverId : 1, createdAt : 1});

module.exports = mongoose.model("Message", messageSchema);