// URL's 
const urlMessages = 'https://chatapp-217010.appspot.com/messages'
// const urlMessages = 'http://127.0.0.1:3001/messages'

var socket = io()
const divMessages= document.querySelector('#messages')
const text = document.querySelector('#text')
const activeUsers = document.querySelector('#total')

// OnLoad
const load = () => {
  // Take name and place in top
  let givename = prompt('Whats your chat name?')
  if (givename===null || givename==='')
    givename = 'anonymous'
    
  document.querySelector('#name').innerHTML = givename
  getMessages()
  document.querySelector('#send').addEventListener('click', formSubmit)  
}

socket.on('message', addMessage) // Display new message
socket.on('userUpdate', displayActiveUsers) // when new user arrive

// Socket for new user connecting
socket.on('connect', function () { // New user, tell server
  socket.emit('newuser', function (data) {
    console.log(data); // data will be number of users
    displayActiveUsers(data)
  });
});

window.onload = load;

function formSubmit() {
  var name = document.querySelector('#name')
  var message = { name: name.innerHTML, message: text.value };
  postMessage(message)
  text.value = ''
  text.focus()
}

// Display number of people in chat
function displayActiveUsers(number) {
  activeUsers.innerHTML = number
}

function getMessages() {
  fetch(urlMessages)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.log(JSON.stringify(myJson))      
      myJson.forEach(element => {
        addMessage(element)
      });
    });
}

function postMessage(message) {
  fetch(urlMessages, {
    method: 'POST',
    body: JSON.stringify(message),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(function () {
    console.log('Post is sucess');
  })
  .catch(error => console.error('Error:', error));
}

function addMessage(message) {
  divMessages.innerHTML += `<div class="wrapper"><div class="name"> ${message.name} </div><div class="text"> ${message.message }</div></div>`
}

// Prevent input enter send
text.addEventListener("keyup", function(event) {
  event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    formSubmit()
  }
});
