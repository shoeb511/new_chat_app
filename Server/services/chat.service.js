// const Message = require("../models/message.model");


// exports.getchats = async (currentUserId, otherUserId) => {

//     try {
//         const messages = await Message.find({
//             $or: [
//                 {senderId: currentUserId, receiverId: otherUserId},
//                 {senderId: otherUserId, receiverId: currentUserId}
//             ]
//         }).sort({createdAt: 1});

//         return messages;
//     } catch(err){
//         throw new Error("failed to fetch the chats... : ", err.message);
//     }
// }
const Message = require("../models/message.model");

exports.getchats = async (currentUserId, otherUserId) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId } // ✅ FIXED
            ]
        }).sort({ createdAt: 1 });

        return messages;
    } catch (err) {
        throw new Error("failed to fetch the chats... " + err.message);
    }
};
