const socketIO = require('socket.io');

let io;

const init = (server) => {
    io = socketIO(server, {
        cors: {
            origin: "*", // Adjust in production
            methods: ["GET", "POST"]
        }
    });

    console.log('✅ Socket.io initialized.');

    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        socket.on('join_cart', (userId) => {
            socket.join(`cart_${userId}`);
            console.log(`👤 User ${userId} joined their cart room.`);
        });

        socket.on('disconnect', () => {
            console.log('❌ Client disconnected');
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized. Call init(server) first.');
    }
    return io;
};

const emitToUser = (userId, event, data) => {
    if (io) {
        io.to(`cart_${userId}`).emit(event, data);
    }
};

const broadcast = (event, data) => {
    if (io) {
        io.emit(event, data);
    }
};

module.exports = {
    init,
    getIO,
    emitToUser,
    broadcast
};
