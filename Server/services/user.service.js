const userDB = require("../models/db_user");

exports.getAllUsers = async () => {
    
    usersList = await userDB.find({}, "_id username");

    if(!usersList || usersList.length === 0){
        throw new Error("no users available...");
    }

    return usersList;
}