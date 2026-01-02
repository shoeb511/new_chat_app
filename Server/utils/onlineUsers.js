const userIdMap = new Map();

exports.onlineusersMap = (userId, socketId) => {
    userIdMap.set(userId, socketId);
}

exports.getOnlineUserSocketId = (userId) => {
    return userIdMap.get(userId);
}

exports.removeOfflineUser = (userId) => {
    userIdMap.delete(userId);
}

