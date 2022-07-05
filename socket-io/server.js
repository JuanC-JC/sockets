// const http = require('http').
const express = require('express')
const app = express()
const socketio = require('socket.io')

app.use(express.static(`${__dirname}/public/`))


const expressServer = app.listen(3001, () => {
	console.log('http server run in http://192.168.1.10:3001')
})


const io = socketio(expressServer)

io.on('connection', (socket) => {

	socket.emit('userConnection', {
		message: 'Welcome to socketio server'
	})

 	socket.on('messageToServer',(dataFromClient)=>{
		socket.broadcast.emit('messageFromServer',dataFromClient)
	})
})