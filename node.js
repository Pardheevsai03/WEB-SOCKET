//importing the required modules and libraries
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const tedious = require('tedious');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const config = {
    authentication: {
        type: 'default',
        options: {
            userName: 'newuser',
            password: 'Hello1234'
        }
    },
    server: 'Test1',
    options: {
        database: 'Test1',
        encrypt: true
    }
};

const connection = new tedious.Connection(config);

connection.on('connect', function(err) {
    if (err) {
        console.error('Error connecting to SQL Server:', err);
    } else {
        console.log('Connected to SQL Server');
    }
});

io.on('connection', function(socket) {
    console.log('Client connected');

    socket.on('chatMessage', function(message) {
        connection.execSql(new tedious.Request(`INSERT INTO ChatMessages (message) VALUES ('${message}')`, function(err) {
            if (err) {
                console.error('Error inserting message into SQL Server:', err);
            } else {
                console.log('Message inserted into SQL Server');
                io.emit('chatMessage', message);
            }
        }));
    });
});

const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
