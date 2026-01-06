

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
let socket = null;

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

const chatApp = document.getElementById("chat_app");

// code to switch from login to signup and vice versa
// if the already have a token -> already have a token then chat area will load initially
if(authToken){
    loginModal.style.display = "none";
    signupModal.style.display = "none";
    chatApp.style.display = "flex";
    console.log("retrieved token from local storage")
    connectSocket(authToken);
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
        authToken = await loginUser(username, password);
        localStorage.setItem("jwtToken", authToken);
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

// -------after successfully login-------------------------------------
function onloginSuccess(){
    loginModal.style.display = "none";
    signupModal.style.display = "none";
    chatApp.style.display = "block";

    console.log("jwt token recieved. ", authToken);
    connectSocket(authToken);
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



