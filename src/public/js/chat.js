
const socket = io();
console.log("Hola desde Chat JS!")

let inputMessage = document.getElementById('message');
let messageDiv = document.getElementById('messages');
let sendButton = document.getElementById('sendButton')

socket.on ('connect', () => { 
  console.log('Emitiendo desde cliente')
})

Swal.fire({
  title: "Login to chat",
  input: "text",
  text: "Please enter your nickname",
  inputValidator: (value) => {
    return !value && "Please enter a value!"
  },
  allowOutsideClick: false,
}).then (res => {

  socket.emit('login', res.value) //We emit the nickname the user entered back to the server

  inputMessage.focus();
  document.title = res.value; //Set the title of the website to the username
  inputMessage.addEventListener('keyup', (e)=>{
    console.log(e.code);
    if (e.code ==="Enter" && e.target.value.trim().length >0){ //If the user presses enter AND the message input is not empty (the trim function removes whitespaces )
      let message = (e.target.value)
      console.log(message)
      socket.emit('message', {sender:res.value, message:message}) //We send the message to the server
      e.target.value = '';
    }
  })

  sendButton.addEventListener('click', (e)=>{
    let message = inputMessage.value.trim(); // Trim to remove whitespace
    if (message.length > 0) { // Check if the message is not empty
      console.log(message);
      socket.emit('message', { sender: res.value, message: message }); // Send the message
      inputMessage.value = ''; // Clear the input field
    }
  })
  
  socket.on('newMessage', (messageObj)=>{
    let paragraph = document.createElement('p');
    paragraph.innerHTML=`<p>-<strong>${messageObj.sender}<strong>: ${messageObj.message} </p>`;
    let hr = document.createElement('hr')
    messageDiv.append(paragraph, hr);
    messageDiv.scrollTop=messageDiv.scrollHeight;
  })
  
  socket.on('newUser', (userName)=>{ //Alert users that a new person has logged in 
    alert("New user has logged in: " + userName)
  })

})


