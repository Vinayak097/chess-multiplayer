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
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === "init_game") {
                if (this.pendingUser) {
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === message_1.Move) {
                console.log(message.type);
                const game = this.games.find(game => game.player1 == socket || game.player2 == socket);
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
