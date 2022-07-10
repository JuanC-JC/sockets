// const http = require('http').
const express = require('express')
const app = express()
const socketio = require('socket.io')
const nameSpaces = require('./data/index.js')

app.use(express.static(`${__dirname}/public/`))

const expressServer = app.listen(5500, () => {
	console.log('http server run in http://localhost:5500')
})

const io = socketio(expressServer)

//when connection is sucessfull send nameSpace basic information
io.on('connection',(socket)=>{
	let nsData = nameSpaces.map(ns=>{
		return {
			img: ns.img,
			endpoint: ns.endpoint
		}
	})

	socket.emit('nameSpaceList', nsData)
})


nameSpaces.forEach(nameSpace => {

	const ns = io.of(nameSpace.endpoint)

	ns.on('connection',(nsSocket)=>{

		console.log(`nsSocket ${nsSocket.id} has join to ${nameSpace.title}`)

		nsSocket.emit('nsRoomLoad', nameSpace.rooms)
		
		//alguien se conecta a un room y por ende abandona un room
		nsSocket.on('joinRoom',(roomToJoin)=>{
			
			console.log('join to room >>>>>>>>>>', nsSocket.id, roomToJoin, nsSocket.rooms)
			
			//solo puede estar conectado a un room, si borro ese room paila

			const lastRoom = [...nsSocket.rooms][1]

			if(lastRoom){
			nsSocket.leave(lastRoom)
				notifyUpdatedQuantityUsersOnRoom(ns,lastRoom)	
			}


			nsSocket.join(roomToJoin)
			notifyUpdatedQuantityUsersOnRoom(ns,roomToJoin)	
			
			const dataRoom = nameSpace.findRoom(roomToJoin)

			nsSocket.emit('syncHistoryFromServer', dataRoom)

		})

		// send everyone on room to update number of people connected to a room
		nsSocket.on('newMessageToServer',(data)=>{

			const room = data.room
			const socketRoom = nsSocket.to(room)
			const dataRoom = nameSpace.findRoom(room)

			data.uidDevice = nsSocket.handshake.query.uid
			dataRoom.addMessage(data)
			
			socketRoom.emit('newMessageFromServer',data)

		})

	})

})

function notifyUpdatedQuantityUsersOnRoom(nameSpace, room){

	console.log('cositas >>>>>>>>>><',nameSpace.adapter.rooms,room)
	const usersOnRoom = nameSpace.adapter.rooms.get(room)

	if(usersOnRoom && usersOnRoom.size){

		const socketRoom = nameSpace.to(room)
	
		socketRoom.emit('newUserConnectedToRoom',usersOnRoom.size)
	}
	console.log('finded >>>>>>>>', usersOnRoom)

}

