const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const mysql = require("mysql");

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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

server.listen(3000, () => console.log('Server started at port 3000'));

app.use(express.static("./form.html"));

app.get('/', (req, res) => {
  return res.sendFile(__dirname + "./form.html");
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
