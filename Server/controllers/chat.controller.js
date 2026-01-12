const chatService = require("../services/chat.service");

exports.getAllChatsOfUsertoUser = async (req, res) => {

    try {
        const currentUserId = req.userId;
        const otherUserId = req.params.userId;

        const messages = await chatService.getchats(currentUserId, otherUserId);

        res.status(201).json(messages);
    }
    catch(err){
        res.status(500).json({message: "Failed to fetch messages."});
    }
} 