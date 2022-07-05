


// const userName = localStorage.getItem('userName') || prompt('Registra tu nombre')
const userName = prompt('Registra tu nombre')
// localStorage.setItem('userName',userName)

const randomColor = Math.floor(Math.random()*16777215).toString(16);
const socket = io('http://192.168.1.10:3001')


const form = document.querySelector('form')
const inputMessage = document.querySelector('.message>input')
const userNameLabel = document.querySelector('.userName')

userNameLabel.textContent = `${userName} `

form.addEventListener('submit',(e)=>{

  e.preventDefault()

  sendMessage({
    userName,
    color: randomColor,
    message: inputMessage.value
  })

  inputMessage.value = ''
})

socket.on('connect', () => {
  console.log('connection :# stablish')
})

socket.on('userConnection',(data)=>{
    console.log('userConnection verify by server ->', data.message)
})

socket.on('messageFromServer', (data) => {
  console.log('message > >', data)
  renderMessage(data)
})


function sendMessage(data){

  if(!data.message) return

  console.log(socket)
  socket.emit('messageToServer',data)
  renderMessage(data)
}

function renderMessage(data){

  console.log('mandaron a renderizar esto >>', data)
  
  const messages = document.querySelector('.messages')
  const messageElement = document.createElement('div')
  messageElement.className = 'message'

  const template = `
    <div class='name'>${data.userName} :</div>
    <div>${data.message}</div>
  `

  // messageElement.textContent = `${data.userName}: ${data.message}`

  messageElement.innerHTML = template

  const name = messageElement.querySelector('.name')
  
  name.style.color = `#${data.color}`

  messages.appendChild(messageElement)

  messages.scrollTop = messages.scrollHeight;

}

