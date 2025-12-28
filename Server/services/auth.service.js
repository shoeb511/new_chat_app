// //const authStore = require("../store/auth.store");
// const dbUser = require("../models/db_user");

// exports.signup =  async (username, password) => {
//     //const existingUser = authStore.getAuth(username);
//     const existingUser = await dbUser.findOne({username});
//     if (existingUser) {
//         throw new Error("Username already exists");
//     }

//     // const newUserId = username + Date.now();
//     // const newUser = new User(newUserId, password);
//     //authStore.setAuth(newUser);
//     const newUser = await dbUser.create({username, password});
//     return newUser;
// }

    
// exports.login =  async (username, password) => {

//     console.log("auth service login called");
    
//     //const user = authStore.getAuth(username);
//     const user = await dbUser.findOne({username});
//     if (!user || user.password !== password) {
//         throw new Error("Invalid username or password");
//     }
//     //console.log("user found in auth store:", user);
//     console.log("user found in db:", user); 
//     return user;
// }

// Authentication service with jwt and bcrypt

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dbUser = require("../models/db_user");
 
exports.signup = async (username, password) => {
    
    // check whether the user is already exists
    const existingUser = await dbUser.findOne({username});
    if(existingUser){
        throw new Error("User already exists");
    }

    // create and store new user with hshed password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await dbUser.create(
        {username,
        password: hashedPassword
        }
    );

    console.log("user created successfully");

    return {
        id: newUser._id,
        username: newUser.username
    };
};

exports.login = async (username, password) => {

    // chech wheter the username exist in the database
    const user = await dbUser.findOne({username});

    if(!user) {
        throw new Error("User not found error");
    }

    // check whether the password is correct using bcrypt.comapre

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error("Invalid password");
    }

    // creating jwt token
    const token = jwt.sign(
        {userId:user._id},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES}
    );

    return {
        token,
        user: {
            userId: user._id,
            username: user.username
        }
    };

};