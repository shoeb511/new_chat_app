const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        senderid : {
            type : mongoose.Schema.Types.ObjectId,
            ref : db_uder,
            required : true
        },

        recieverid : {
            type : mongoose.Schema.Types.ObjectId,
            ref : db_user,
            required : true
        },

        content : {
            type : String,
            required : true
        },

        status : {
            type : String,
            enum : ["sent", "recieved", "deliverd"],
            default : "sent"
        }
    },
    { 
        timestamps : true
    }
);

messageSchema.index({ senderId : 1, recieverId : 1, createdAt : 1});

module.exports = mongoose.model("Message", messageSchema);