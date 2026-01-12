async function loadChatHistory(authToken, otherUserId){
    
    try {
        const response = await fetch(`/chat/loadChats/${otherUserId}`, {
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        });

        const messages = await response.json();

        console.log("fetched messages : ", messages);

        // store messages in cache
        chatCache[otherUserId] = messages;

        return messages;
    
    }
    catch(err) {
        throw new Error("failed to fetch messages : ", err.messages);
    }
}