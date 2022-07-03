const express = require('express')
const websocket = require('ws')

//express is a framework, allow many functionalities and configurations
const app = express()
const server = require('http').Server(app)

const wss = new websocket.Server({server})

const PORT = 3000

app.get('/', (req,res) => {
    res.send('all fine')
})

// wss.on('headers',(headers,request)=>{
//     console.log('socket listening headers',headers)
// })

// wss.on('connection',(socket, request)=>{
//     console.log('succesfull conection')
//     socket.send('welcome to the websocket server')

//     socket.on('message',(msg)=>{
//         //the msg come with buffer format we need, to convert to 
//         console.log(msg.toString())

//     })
// })

const rooms = {}

wss.on('connection', function connection(ws) {
    console.log('algun bastardo se connecto')

    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === websocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        }); 
    });
  });

server.listen(8000,()=>{
    console.log('app listening http://localhost:3000')
})