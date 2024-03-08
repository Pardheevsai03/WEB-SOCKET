const express = require("express");
const app = express();
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql");


const corsOptions = {
  origin: "http://127.0.0.1:5500", 
  methods: ['POST', 'GET', 'PUT'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};


app.use(cors(corsOptions));


app.options('*', cors(corsOptions));


const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "newuser",
  password: "Hello1234",
  database: "test1"
});


db.connect(err => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions
});


server.listen(5500, () => console.log('Server started at port 5500'));


app.use(express.static("public"));


app.get('/', (req, res) => {
  return res.sendFile(__dirname + "/public/form.html");
});


io.on('connection', (socket) => {
  console.log("ID of", socket.id, "is connected");
  socket.on('chatMessage', (message) => {
    const sql = 'INSERT INTO messages (message) VALUES (?)';
    db.query(sql, [message], (err, result) => {
      if (err) throw err;
      console.log("Message saved to database");
    });
    
    io.emit('message', message);
  });
});
