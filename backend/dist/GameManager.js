"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const message_1 = require("./message");
class GameManager {
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }
    addUser(socket) {
        this.users.push(socket);
        console.log("user added");
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
    }
    addHandler(socket) {
        console.log("user gone add handler");
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === "init_game") {
                console.log(message);
                if (this.pendingUser) {
                    if (this.pendingUser != socket) {
                        const game = new Game_1.Game(this.pendingUser, socket);
                        this.games.push(game);
                        this.pendingUser = null;
                    }
                    else {
                        socket.send(JSON.stringify({ type: "error", message: "You are already in a game." }));
                    }
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === message_1.Move) {
                console.log(message.type);
                const game = this.games.find(game => game.player1 == socket || game.player2 == socket);
                console.log(this.games);
                if (game) {
                    console.log("function call");
                    game.makeMove(socket, message.move);
                }
                else {
                    console.log("not found game");
                }
            }
        });
    }
}
exports.GameManager = GameManager;
