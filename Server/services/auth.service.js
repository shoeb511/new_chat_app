const authStore = require("../store/auth.store");
const User = require("../models/user");



exports.signup = (username, password) => {
    const existingUser = authStore.getAuth(username);
    if (existingUser) {
        throw new Error("Username already exists");
    }

    const newUserId = username + Date.now();
    const newUser = new User(newUserId, password);
    authStore.setAuth(newUser);
    return newUser;
}

    
exports.login = (username, password) => {
    console.log("auth service login called");
    const user = authStore.getAuth(username);
    if (!user || user.password !== password) {
        throw new Error("Invalid username or password");
    }
    console.log("user found in auth store:", user);
    return user;
}
