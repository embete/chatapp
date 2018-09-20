var socket = io()
const divMessages= document.querySelector('#messages')

// OnLoad
const load = () => {
  console.log("load event detected!")
  // Take name and place in top
  let givename = prompt('Whats your chat name?')
  document.querySelector('#name').innerHTML = givename
  getMessages()

  // OnClick send
  document.querySelector('#send').addEventListener('click', function() {
    var text = document.querySelector('#text')
    var name = document.querySelector('#name')
    var message = { name: name.innerHTML, message: text.value };
    postMessage(message)
    text.value = ''
    text.focus()
  })
}

socket.on('message', addMessage)
window.onload = load;

function getMessages() {
  fetch('http://127.0.0.1:3001/messages')
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.log(JSON.stringify(myJson))      
      myJson.forEach(element => {
        addMessage(element) // Lynda sender denne uten element som parameter, kun tom. Hvorfor funker det?
      });
    });
}

function postMessage(message) {
  fetch('http://127.0.0.1:3001/messages', {
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
  divMessages.innerHTML += `<div class="name"> ${message.name} </div><div class="text"> ${message.message }</div>`
}
