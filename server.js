// Local vs online
var port = 8080 // online
// var port = 3001 // local

var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var dburl = 'mongodb://user:User312@ds163182.mlab.com:63182/chatapp'
var participants = 0

// DB Model
var Message = mongoose.model('Message', {
  name: String,
  message: String
})

// Get messages
app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages) 
  })
})

// Post message
app.post('/messages', (req, res) => {
  var message = new Message(req.body)

  message.save((err) => {
    if(err)
      sendStatus(500)

    io.emit('message', req.body)
    res.sendStatus(200)
  })
})

// Dedect user
io.on('connection', (socket) => {
  participants++;
  socket.broadcast.emit('userUpdate', participants); // Tell all user the new number of total
  socket.on('newuser', function (number) { // Tell only the new user total (can't get on same emit as everone else)
    number(participants);
  });
  console.log('a user is connected');
  console.log('number of acitve users: '+ participants)
  socket.on('disconnect', function () { 
    socket.broadcast.emit('userUpdate', participants);
    console.log('a user has disconneected');
    participants--
    console.log('number of acitve users: '+ participants)
    if (participants<=0) {
      console.log('no more active people, delete all data');
      deleteAllData()
    }
  })
})

function deleteAllData() {
  Message.remove({}, (err) => {
    console.log('all messages and usernames deleted', err);
  })
}

// Conect to DB (mLab)
mongoose.connect(dburl, {useNewUrlParser: true}, (err) => {
  console.log('mongo db connection', err)
})

// Port listening at server
var server = http.listen(port, () => {
  console.log('Server is listiening on port', server.address().port);
})