//const authStore = require("../store/auth.store");
const dbUser = require("../models/db_user");

exports.signup =  async (username, password) => {
    //const existingUser = authStore.getAuth(username);
    const existingUser = await dbUser.findOne({username});
    if (existingUser) {
        throw new Error("Username already exists");
    }

    // const newUserId = username + Date.now();
    // const newUser = new User(newUserId, password);
    //authStore.setAuth(newUser);
    const newUser = await dbUser.create({username, password});
    return newUser;
}

    
exports.login =  async (username, password) => {

    console.log("auth service login called");
    
    //const user = authStore.getAuth(username);
    const user = await dbUser.findOne({username});
    if (!user || user.password !== password) {
        throw new Error("Invalid username or password");
    }
    //console.log("user found in auth store:", user);
    console.log("user found in db:", user); 
    return user;
}
