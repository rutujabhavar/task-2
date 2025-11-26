const socket = io();

// Prompt user for a name
let username = "";
while (!username) {
  username = prompt("Enter your username:");
}

// Send a join event to server
socket.emit("join", username);

const form = document.getElementById("chatForm");
const input = document.getElementById("msgInput");
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    // Send message along with username
    socket.emit("chatMessage", { username: username, text: input.value });
    input.value = "";
  }
});

socket.on("chatMessage", (data) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<strong>${data.username}:</strong> ${data.text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});


