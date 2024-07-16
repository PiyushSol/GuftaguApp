const socket = io();

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages');

const roomName =document.getElementById('room-name');
const userList =document.getElementById('users');


//GetUsername and Room form url
const { username , room } = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

//Join chat room
socket.emit('joinRoom',{username,room});

//get room and users
socket.on('roomUsers',({room , users})=>{
outputRoomName(room);
outputUsers(users);
})


//message from server
socket.on('message', message=>{
   

    outputMessage(message);

    //Scroll down automatically
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//Message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    //getting message text
    const msg = e.target.elements.msg.value;
   
    //emitting messsage to server
    socket.emit('chatMessage',msg);


    //Clear all inputs
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})

//Displaying messsage in the server
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`
    <p class="meta">${message.username}<span> ${message.time}</span></p>
						<p class="text">
${message.text}
						</p>
    `;

    document.querySelector('.chat-messages').appendChild(div);
}


//Add roomname to dom
function outputRoomName(room){
    roomName.innerText = room;
}

//Add users to dom
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}