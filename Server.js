"use strict"

const Express = require("express");
const { Server } = require("ws");


let HOST = location.origin.replace(/^http/, 'ws')
let ws = new WebSocket(HOST);

let Port = 3000;

let Server_ = Express().use((req, res) => {}).listen(Port => console.log("Listening on port: " + Port));
let WebSocketServer = new Server(Server_);


// Chat variables
let LiveChats = [];
let PrivateMessages = {};


WebSocketServer.addListener("connection", (WebSock) =>{
    WebSock.on("message", (Message) => {
        let MS = JSON.parse(Message);


        // If not live chat in chats list, add it and send a notification to team's members that a new live chat has started
        // Otherwise send the incoming messages to all team's members and continue the chat progress
        if ( MS["Type"] === "LiveChat" ) {
            if ( MS["Team"] in LiveChats === false ) {
                LiveChats.push(LiveChats);

                WebSocketServer.clients.forEach(client => {
                    WebSock.send(JSON.stringify(
                        {"Action": "NewLiveChat", "ChatName": MS["Team"]}
                    ))
                });
            }
        } else {
            WebSocketServer.clients.forEach(client => {
                WebSock.send(JSON.stringify(
                    {"Action": "LiveChatMessage", "ChatName": MS["Team"]}
                ))
            })
        }


        // In private messages, messages will be saved in PrivateMessages list for a while and after 20minutes they will be
        // saved on cloud
        if ( MS["Type"] === "Private" ) {
        }
    })
})
