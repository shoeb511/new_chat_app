console.log("Client main.js loaded");

const socket = io();
// CORRECTED: Store current user's socket ID to identify own messages
let currentUserId = null;

socket.on("connect", () => {
    // CORRECTED: Capture the current user's ID for message alignment logic
    currentUserId = socket.id;
    console.log("connected to the server with id", socket.id);
});

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
    // CORRECTED: Properly access message text from the data object sent by server
    li.innerText = data.text;

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