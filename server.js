const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')

const port = 3000;


const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  // allowRequest: (req, callback) => {
    // console.log('asd' + req.headers.getHeaders())
    // const noOriginHeader = req.headers.origin === undefined;
    // callback(null, noOriginHeader);
  // },
  cors: {
    origin: 'http://localhost:' + port,
    methods: ['POST', 'GET']
  }
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// app.get('/js/oyun.js', (req, res) => {
//   res.sendFile(__dirname + '/public/js/oyun.js');
// });
// app.get('/css/style.css', (req, res) => {
//   res.sendFile(__dirname + '/public/css/style.css');
// });

io.on('connection', (socket) => {
  console.log('user is connected: ' + socket.id);

  socket.on('join_room', data => {
    // get objects
    const {room_list, room} = data;
    room_list.forEach(rooms => {
      // if room equal to rooms. dont leave
      if (rooms == room) {
          return;
      }
      socket.leave(rooms);
      console.log('leave room:' + rooms);
    });
    //
    socket.join(room);
    console.log('join: ' + room);
  });
  // Send objects
  socket.on('send_server', data => {
    console.log(data);
    io.to(data.room).emit('client', data.name, data.msg);
  });
  socket.on('disconnect', () => {
    console.log('user is disconnected: ' + socket.id);
  });
});

server.listen(port, () => {
  console.log('Socket.IO server running at http://localhost:${port}/');
});