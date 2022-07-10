const Room = require('./Room')

class Namespace{
    constructor(id, nsTitle, img, endpoint){
        this.id = id;
        this.img = img;
        this.title = nsTitle;
        this.endpoint = endpoint;
        this.rooms = [];
    }

    addRoom(id,name, privateRoom){

        const newRoom = new Room(id,name,this.title,privateRoom)

        this.rooms.push(newRoom);
    }

    findRoom(roomTitle){
        return this.rooms.find(room => roomTitle === room.roomTitle) || {}
    }

}

module.exports = Namespace;