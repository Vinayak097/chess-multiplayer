"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const uuid_1 = require("uuid");
class GameManager {
    constructor() {
        this.game = [];
    }
    createGame(player1, gametype) {
        const id = (0, uuid_1.v4)();
        const game = new Game_1.Game(id, player1, gametype);
        return game;
    }
    getGame(id) {
        console.log("gameds ", this.game);
        const game = this.game.find((game) => game.id === id);
        console.log("game id  ", id, " , game found :", game);
        return game;
    }
    removeGame(id) {
        this.game = this.game.filter((game) => game.id !== id);
    }
    isPlayerinGame(player, game) {
        var _a, _b;
        if (game == undefined) {
            return undefined;
        }
        if (((_a = game.player1) === null || _a === void 0 ? void 0 : _a.id) == player) {
            return true;
        }
        if (((_b = game.player2) === null || _b === void 0 ? void 0 : _b.id) == player) {
            return true;
        }
        return false;
    }
    joinGame(player, gametype) {
        var _a;
        let game = this.game.find((game) => game.status === Game_1.GameStatus.waiting);
        const isingame = this.isPlayerinGame(player.id, game != undefined ? game : undefined);
        if (isingame) {
            console.log("already in game");
            return null;
        }
        game = this.game.find((game) => game.status == Game_1.GameStatus.waiting && game.gametype == gametype);
        if (!game) {
            const id = (0, uuid_1.v4)();
            const game = new Game_1.Game(id, player, gametype);
            console.log("game created ", game.timer, game.timer.whiteTime);
            this.game.push(game);
            return {
                game,
            };
        }
        else {
            if (((_a = game.player1) === null || _a === void 0 ? void 0 : _a.socket) === player.socket) {
                return { game };
            }
            player.color = "b";
            game.addPlayer(player);
        }
        return {
            game,
        };
    }
}
exports.GameManager = GameManager;
