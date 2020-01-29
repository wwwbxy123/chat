const WebSocket = require('ws');

const wss =  new WebSocket.Server({port :8989})

const users = []

const  broadcast = (data, ws) => {
    wss.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN && client != ws){
            client.send(JSON.stringify(data))
        }
    })
}

wss.on('connection', (ws) => {  // as soon as the client connects, start listening the ADD_USER and ADD_MESSAGE events
    let index
    ws.on('message', (message) => {
        const data = JSON.parse(message)
        switch (data.type){
            case 'ADD_USER':{
                index = users.length
                users.push({name: data.name, id: index + 1}) // add this user to the server side user list
                ws.send(JSON.stringify({
                    type: 'USERS_LIST',
                    users
                }))
                broadcast({   // after add users to the server side userlist, then use broadcase to connect to all clients
                    type: 'USERS_LIST',
                    users
                }, ws)
                break
            }
            case 'ADD_MESSAGE':  // when ADD_MESSAGE event is sent to the server, broadcase this Message to all connected clients
                broadcast({
                    type: 'ADD_MESSAGE',
                    message: data.message,
                    author: data.author
                }, ws)
                break
            default:
                break
        }
    })
    ws.on('close', () => { // when the connection closed
        users.splice(index, 1) // remove the current user from UserList when a user is close the connection
        broadcast({
            type: 'USERS_LIST',
            users
        }, ws)
    })
})