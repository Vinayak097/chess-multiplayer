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
            console.log("message unparseddata messaage.type , ", data);
            const message = JSON.parse(data.toString());
            if (message.type === "init_game") {
                if (this.pendingUser) {
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    if (game.player1) {
                    }
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === message_1.Move) {
                const game = this.games.find(game => game.player1 == socket || game.player1 == socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
