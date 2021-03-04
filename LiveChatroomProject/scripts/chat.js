class Chatroom {
    constructor(room, username){
        this.room = room;
        this.username = username;
        this.chats= db.collection('chats');
        this.unsubscribe;
    }

    //Add a new chat
    async addChat(message) {
        const now = new Date();
        const chat = {
            message,
            username: this.username,
            room: this.room,
            createdAt: firebase.firestore.Timestamp.fromDate(now)
        }

        const response = await this.chats.add(chat);
        return response;
    }

    //Add a real time listener
    getChats(callback){
        console.log("Listener initialization...")
        this.unsubscribe = this.chats
        .where('room','==',this.room)
        .orderBy('createdAt')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if(change.type === 'added')
                    callback(change.doc.data());
            })
        })
    }

    //Update name
    updateName(name){
        this.username = name;
        localStorage.setItem('username', name);
    }

    //Update room
    updateRoom(room){
        this.room = room;
        console.log("Room updated...");
        if(this.unsubscribe)
            this.unsubscribe();
    }
}

