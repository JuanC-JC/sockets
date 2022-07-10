
const username = prompt("What is your username?")

const uid = localStorage.getItem('uidChat') || new Date().getTime()

localStorage.setItem('uidChat',uid)

const url = 'https://c010-191-107-194-94.ngrok.io'
// const socket = io('http://https://052d-191-107-194-94.ngrok.io'); // the / namespace/endpoint
const socket = io(url,{
    query: {
        username,
        uid
    }
});

let nsSocket = null

console.log('trying to connect')

socket.on('connect',()=>{
    console.log(socket)
    console.log(socket)
})

// listen for nsList, which is a list of all the namespaces.
socket.on('nameSpaceList',(nsData)=>{
    console.log("The list of .rooms has arrived!!", nsData)
    // console.log(nsData)
    let namespacesDiv = document.querySelector('.namespaces');

    namespacesDiv.innerHTML = "";

    nsData.forEach((ns)=>{
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint} ><img src="${ns.img}" /></div>`
    })

    // Add a clicklistener for each NS
    console.log(document.getElementsByClassName('namespace'))

    Array.from(document.getElementsByClassName('namespace')).forEach((elem)=>{
        // console.log(elem)
        elem.addEventListener('click',(e)=>{
            const nsEndpoint = elem.getAttribute('ns');
            console.log(`${nsEndpoint} I should go to now`)
            joinNs(nsEndpoint)
        })
    })
    joinNs();

})  

function joinNs(namespace = '/wiki'){

    if(socket) socket.close()
    if(nsSocket) nsSocket.close()

    const urlConecction = `${url}${namespace}`

    nsSocket = io(urlConecction)

    nsSocket.on('connect',()=>{
        console.log('connection to ', namespace)
    })
    
    nsSocket.on('nsRoomLoad', (nsRooms)=>{
        console.log(`getting ${namespace}`, nsRooms)

        let roomListDiv = document.querySelector('.room-list')
        roomListDiv.innerHTML = ''

        nsRooms.forEach(room=>{

            let glyph
            
            if(room.privateRoom) glyph = 'lock'
            else glyph = 'globe'

            roomListDiv.innerHTML += `<li class='room'><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`
        })

        Array.from(document.querySelectorAll('.room')).forEach(roomElement => {

            roomElement.addEventListener('click',(e)=>{

                const roomTitle = e.target.textContent

                joinRoom(roomTitle)


            })


        })

        joinRoom(nsRooms[0].roomTitle)
        
    })

    nsSocket.on('syncHistoryFromServer',(room)=>{
        console.log('syncHistoryFromServer', room)
        const messagesContainer = document.querySelector('#messages')

        messagesContainer.innerHTML = ''

        room.history.forEach(message=>{
            renderMessage(message)
        })
    })

    nsSocket.on('newUserConnectedToRoom',(quantity)=>{
        console.log(`we are ${quantity} idiots on this room`, nsSocket)

        document.querySelector('.curr-room-num-users>span').textContent = `${quantity} Users`
    })

    //render when a new user is connected         
    nsSocket.on('newMessageFromServer',(data)=>{
        console.log('message from server', data)
        renderMessage(data)
    })

}


//como esto se ejecuta por cada ejecucion los ON QUE SE COLOQUEN SE EJECUTARAN MULTIPLES VECES
//es como un event listeners, se acumulan
//we cannot join to room from client
function joinRoom(room){
    //we have a callback when a emit is sucesfull, we dont need other emit to verify this

    const activeRoom = document.querySelector('.room.active') 

    if(activeRoom && activeRoom.textContent === room) return 

    const roomElementsHtml = [...document.querySelectorAll('.room')]

    roomElementsHtml.forEach(roomElement => {
        if(roomElement.textContent === room) roomElement.classList.add('active')
        else roomElement.classList.remove('active')
    })


    console.log('conectandome a', room)
    document.querySelector('.curr-room-text').textContent = room
    nsSocket.emit('joinRoom',room)



    document.querySelector('.message-form').onsubmit = (event)=>{
        event.preventDefault()
        const textMessage = document.querySelector('#user-message')
        const newMessage = {
            text: textMessage.value,
            img: "https://via.placeholder.com/30",
            date: new Date().toLocaleTimeString(),
            username,
            room,
            uidDevice: uid,
        }
        textMessage.value = ''
        nsSocket.emit('newMessageToServer',newMessage)
        console.log('sending message', newMessage)
        renderMessage(newMessage)
    }

}

function renderMessage(data){
    const message = document.createElement('li')
    const messagesContainer = document.querySelector('#messages')

    console.log(data,uid)
    data.uidDevice === uid && message.classList.add('mine')

    message.innerHTML = `
        <div class="user-image">
            <img src="https://via.placeholder.com/30"/>
        </div>
        <div class="user-message">
            <div class="user-name-time">${data.username} <span>${data.date}</span></div>
            <div class="message-text">${data.text}</div>
        </div>
    `

    messagesContainer.appendChild(message)
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}