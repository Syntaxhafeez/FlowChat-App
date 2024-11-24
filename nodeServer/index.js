const io = require('socket.io')(8000, {cors: {origin: "*",  methods: ['GET', 'POST']},});

const users = {};

// Handle socket connections
io.on('connection', socket => {
    // New user joins
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // User sends a message
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // User disconnects
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('leave', users[socket.id]);
            delete users[socket.id];
        }
    });
});

const PORT = process.env.PORT || 8000; // Use Render's provided PORT or fallback to 8000 for local
io.listen(PORT, () => console.log(`Server running on port ${PORT}`));
