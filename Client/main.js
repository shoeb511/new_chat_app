console.log("Client main.js loaded");

const socket = io();
// CORRECTED: Store current user's socket ID to identify own messages
let currentUserId = null;

socket.on("connect", () => {
    // CORRECTED: Capture the current user's ID for message alignment logic
    currentUserId = socket.id;
    console.log("connected to the server with id", socket.id);
});

// Set username functionality
const usernameInput = document.getElementById("username_input");
const setUsernameBtn = document.getElementById("set_username_btn");

setUsernameBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if(!username) return;

    // Emit the username to the server
    socket.emit("set_username", username);
    console.log("username set to : ", username);

    usernameInput.disabled = true;
    setUsernameBtn.disabled = true;
})

const send_button = document.getElementById("sendBtn");
const msgInput = document.getElementById("msgInput");
const messages = document.getElementById("messages");

send_button.addEventListener("click", (e) => {

    e.preventDefault();

    const msg = msgInput.value.trim();
    if(!msg) return;

    
    socket.emit("chat_message", msg);
    msgInput.value = "";
    
});

// Listen for incoming chat messages from the server

socket.on("chat_message", (data) => {
    console.log("client recieved message:", data);

    const li = document.createElement("li");
    // CORRECTED: render username provided by server; fallback kept for safety
    const username = data.username || "Anonymous";
    li.innerText = `${username}: ${data.text}`;
    // CORRECTED: Compare with stored currentUserId to determine if message is own (right-align) or other (left-align)
    if(data.id === currentUserId) {
        li.classList.add("own-message");
    }
    else {
        li.classList.add("other-message");
    }

    // CORRECTED: Append the li element to messages list and scroll to bottom
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
    
});