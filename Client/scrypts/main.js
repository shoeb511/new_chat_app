

// // Set username functionality
// const usernameInput = document.getElementById("username_input");
// const setUsernameBtn = document.getElementById("set_username_btn");

// setUsernameBtn.addEventListener("click", () => {
//     const username = usernameInput.value.trim();
//     if(!username) return;

//     // Emit the username to the server
//     socket.emit("set_username", username);
//     console.log("username set to : ", username);

//     usernameInput.disabled = true;
//     setUsernameBtn.disabled = true;
// })

// const send_button = document.getElementById("sendBtn");
// const msgInput = document.getElementById("msgInput");
// const messages = document.getElementById("messages");

// send_button.addEventListener("click", (e) => {

//     e.preventDefault();

//     const msg = msgInput.value.trim();
//     if(!msg) return;

    
//     socket.emit("chat_message", msg);
//     msgInput.value = "";
    
// });

// // Listen for incoming chat messages from the server

// socket.on("chat_message", (data) => {
//     console.log("client recieved message:", data);

//     const li = document.createElement("li");
//     // CORRECTED: render username provided by server; fallback kept for safety
//     const username = data.username || "Anonymous";
//     li.innerText = `${username}: ${data.text}`;
//     // CORRECTED: Compare with stored currentUserId to determine if message is own (right-align) or other (left-align)
//     if(data.id === currentUserId) {
//         li.classList.add("own-message");
//     }
//     else {
//         li.classList.add("other-message");
//     }

//     // CORRECTED: Append the li element to messages list and scroll to bottom
//     messages.appendChild(li);
//     messages.scrollTop = messages.scrollHeight;
    
// });

//  ----------------socket code ------------------
console.log("Client main.js loaded");

let authToken = localStorage.getItem("jwtToken");
let currentUsername = localStorage.getItem("currentUsername");
let currentUserId = localStorage.getItem("currentUserId");
let socket = null;
let currentChatUserId = null;
let currentChatUsername = null;
let userListElement = null;

const chatCache = {};

function getConversationId(userA, userB){
    const key = [userA, userB].sort().join("_");
    console.log("key conversation key generated : ", key);
    return key;
}



function connectSocket(authToken){
    socket = io({
        auth : {
            token : authToken
        }
    });

    socket.on("connect", () => {
        console.log("user connected : ", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.log("socket auth failed : ", err.message);

        // remove jwt token from local storage , token maybe expired
        localStorage.removeItem("jwtToken");
        authToken = null;

        // show login modal 
        loginModal.style.display = "flex";
        signupModal.style.display = "none";
        chatApp.style.display = "none";
    });

    // ====== socket for received message rendering============
    socket.on("receive_message", (message) => {

        // const partnerId = 
        //     message.senderId === currentUserId ? message.receiverId : message.senderId;

        // conversation id instead of using partner id would be more rigid aproach to store the conversation in memory cache
        const conversationId = getConversationId(message.senderId, message.receiverId);
        console.log("conversation key generated in the socket.on receive message : ", conversationId);

        if(!chatCache[conversationId]) {
            chatCache[conversationId] = [];
        }

        chatCache[conversationId].push(message);

        if(message.senderId === currentChatUserId || message.receiverId === currentChatUserId){ 
  
            messageRender({
                text: message.text,
                isOwn: message.senderId === currentUserId
                //isOwn: String(msg.senderId) === String(currentUserId)

            });
        } 
    });
}




// login and signup initial functionality

//let authToken = localStorage.getItem("jwtToken");

const loginModal = document.getElementById("login_modal");
const signupModal = document.getElementById("signup_modal");
const show_signup_modal = document.getElementById("show_signup_modal");
const show_login_modal = document.getElementById("show_login");

const loginUsername = document.getElementById("login_input_username");
const loginPassword = document.getElementById("login_input_password");

const signupUsername = document.getElementById("signup_input_username");
const signupPassword = document.getElementById("signup_input_password");

const signup_button = document.getElementById("signup_button");
const loginButton = document.getElementById("login_button");
const logoutButton = document.getElementById("logout");

const messages = document.getElementById("messages");

const chatApp = document.getElementById("chat_app");
const newChatButton = document.getElementById("new_chat");
const backButton = document.getElementById("back_to_users");

// code to switch from login to signup and vice versa
// if the already have a token -> already have a token then chat area will load initially
if(authToken){
    loginModal.style.display = "none";
    signupModal.style.display = "none";
    chatApp.style.display = "flex";
    console.log("retrieved token from local storage")
    connectSocket(authToken);
    loadAllUsers();
}
else{
    // show login modal initially
    loginModal.style.display = "flex";
    signupModal.style.display = "none";
    chatApp.style.display = "none";
}




// switch from login to signup by signup link
show_signup_modal.addEventListener("click", () => {
    loginModal.style.display = "none";
    signupModal.style.display = "flex";
})

show_login_modal.addEventListener("click", () => {
    signupModal.style.display = "none";
    loginModal.style.display = "flex";
})


// login authentication handler code
// add eventlistener to login button which will call the login api through auth.js
loginButton.addEventListener("click", async () => {
    const username = loginUsername.value;
    const password = loginPassword.value;

    if(!username || !password){
        alert("username and password required");
    }

    try {
        const loginData = await loginUser(username, password);

        authToken = loginData.token;
        currentUserId = loginData.userId;
        currentUsername = loginData.username;

        localStorage.setItem("jwtToken", authToken);
        localStorage.setItem("username", currentUsername);
        localStorage.setItem("currentUserId", currentUserId);

        onloginSuccess();
        
    }
    catch(err) {
        alert(err.message);
    }

});

// ------------------------sign up code------------------------
signup_button.addEventListener("click", () => {
    const username = signupUsername.value;
    const password = signupPassword.value;
    
    if(!username || !password){
        alert("please enter username and password");
    }

    try {
        signupUser(username, password);
        alert("sign up successfully. go to login...");
        signupModal.style.display = "none";
        loginModal.style.display = "flex";
    }
    catch(err){
        alert(err.message);
    }
});

//=============logout event listener and logut function================
logoutButton.addEventListener("click", logout);



// -------after successfully login-------------------------------------
async function onloginSuccess(){
    loginModal.style.display = "none";
    signupModal.style.display = "none";
    chatApp.style.display = "block";

    console.log("jwt token recieved. ", authToken);
    connectSocket(authToken);
    loadAllUsers(authToken);
}


// function to render all the users from backend to the UI


userListElement = document.getElementById("users");

function renderUsers(users){
    userListElement.innerHTML = "";

    for(let i=0; i<users.length; i++){
        const user = users[i];

        const li = document.createElement("li");

        li.innerText = user.username;

        li.setAttribute("data-user-id", user._id);

        li.onclick = function () {
            setActiveChatUser(user);
        }

        userListElement.appendChild(li);
    }
}


// functionality for behavior of UI in mobile devices
// const chatApp = document.getElementById("chat_app");
// const newChatButton = document.getElementById("new_chat");
// const backButton = document.getElementById("back_to_users");


function openChat(){
    chatApp.classList.add("chat-active");

    if(window.innerWidth <= 768){
        backButton.style.display = "block";
    }
}

function closeChat(){
    chatApp.classList.remove("chat-active");
    backButton.style.display = "none";
}


// ====set active chat user 



function setActiveChatUser(user){
    currentChatUserId = String(user._id);
    openChat();
    console.log("type of user._id is : ",typeof(user._id));
    currentChatUsername = user.username;
    console.log("type of user.username is : ", user.username);
    console.log("current chat userId and current chat Username : ", currentChatUserId, " ", currentChatUsername);

    document.querySelectorAll("#users li").forEach(li => {
        li.classList.remove("active");
    });

    const selectedLi = document.querySelector(
        `#users li[data-user-id="${currentChatUserId}"]`
    );

    if(selectedLi) {
        selectedLi.classList.add("active");
    }

    // clear the message area
    messages.innerHTML = "";
    console.log(selectedLi.attributes);

    // here we are going to load the older messages if any, 
    // between the currentUser and selected user

    // generate conversationId to render messages from cache or DB on page refresh or user switch

    const conversationId = getConversationId(currentUserId, currentChatUserId);

    if(chatCache[conversationId]){
        console.log("message mil gae cache me : ", chatCache[conversationId]);
        renderMessages(conversationId);
    }
    else{
        loadChatHistory(authToken, currentChatUserId).then((dbMessages) => {
            chatCache[conversationId] = dbMessages;
            console.log("cache me nhi mile . db se uthakar cache me dale : ", chatCache[conversationId]);
            renderMessages(conversationId); 
        });
    }

    console.log("chating with : ", user.username);
}

// back to users button eventlistner for the mobile users

backButton.addEventListener("click", () => {
    closeChat();
})

// chat messages rendering code ============================================

function renderMessages(conversationId){

    messages.innerHTML = "";

    const msgs = chatCache[conversationId] || [];

    // msgs.forEach(msg => {
    //     messageRender({
    //         text: msg.text,
    //         isOwn: msg.senderId === currentUserId
    //     });
    // });

    msgs.forEach(msg => {
    console.log("type of msg.senderId is : ", typeof(msg.senderId));
    console.log("type of msg.currentUserId  is : ", typeof(currentUserId));
    const isOwn = msg.senderId === currentUserId;

        messageRender({
            text: msg.text,
            isOwn
        });
    });


    messages.scrollTop = messages.scrollHeight;

}



//load all users from database function

async function loadAllUsers(authToken){
    try {
        const response = await fetch("/user/allusers", {
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        });

        const users = await response.json();
        console.log("fetched users", users);

        renderUsers(users);

    } catch(error) {
        throw new Error("failed to load users. : ", error.message );
    }
}


// ===========send button event listener it will trigger the socket private
//  message in the server ==========
const sendButton = document.getElementById("send_button");
const msgInput = document.getElementById("msg_input");


sendButton.addEventListener("click", () => {
    const text = msgInput.value.trim();
    //const receiverId = currentChatUserId;

    if(!text || !currentChatUserId) return ;

    socket.emit("private_message", {
        receiverId: currentChatUserId,
        text
    });

    const conversationId = getConversationId(currentUserId, currentChatUserId);

    // cache own messages
    if(!chatCache[conversationId]){
        chatCache[conversationId] = [];
    }

    chatCache[conversationId].push({
        senderId: currentUserId,
        receiverId: currentChatUserId,
        text
    });

    // render own message immediately
    messageRender({text, isOwn : true});
    msgInput.value = "";
})




//===========message rendering function to UI ====

function messageRender({text, isOwn}){
    const li = document.createElement("li");

    li.className = isOwn ? "own-message" : "other-message";

    li.textContent = text;

    messages.appendChild(li);
}



//========private message server testing demo function ==============

// window.sendTestMessage = (receiverId) => {
//     socket.emit({"private_message", {
//         receiverId:receiverId,
//         text: "this is a test message , hi all!"
//     });
// };

window.sendTestMessage = (receiverId) => {
  socket.emit("private_message", {
    receiverId: receiverId,
    text: "this is a test message, hi all!"
  });
};


//=========implementation of userlist related code

// fetching all the users from server




// chats rendering and frontend integration

function logout(){
    // disconnect socket first
    if(socket){
        socket.disconnect();
        socket = null;
    }

    // delete user related data from local storage
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("username");

    // reset all the attributes
    authToken = null;
    currentUsername = null;
    currentUserid = null;
    currentChatUserId = null;
    currentChatUsername = null;
    
    // clear cache
    Object.keys(chatCache).forEach(key => delete chatCache[key]);
    
    // messages.innerHTML = null;
    // userListElement.innerHTML = null;

    chatApp.style.display = "none";
    signupModal.style.display = "none";
    loginModal.style.display = "flex";

    console.log("User logged out successfully");


}