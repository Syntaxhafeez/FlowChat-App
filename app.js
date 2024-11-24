const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.getElementById('messageContainer');

// Notification sound that plays on receiving messages
const audio = new Audio('ding.mp3.mp3');

// Function to append messages to the chat container
const appendMessage = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to the bottom

    //Notification sound only plays when a left side user sends a message
    if (position === 'left') {
        audio.play();
    }
};

// Prompt user for their name and notify the server
const userName = prompt("Enter your name to join");
socket.emit('new-user-joined', userName);

// Receive message when a new user joins the chat
socket.on('user-joined', name => {
    appendMessage(`${name} joined the chat`, 'right');
});

// Receive messages from the server
socket.on('receive', data => {
    appendMessage(`${data.name}: ${data.message}`, 'left');
});

// Notify when a user leaves the chat
socket.on('leave', name => {
    appendMessage(`${name} left the chat`, 'right');
});

// Send messages on form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        appendMessage(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});
