"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const game_1 = require("./game");
const uuid_1 = require("uuid");
class GameManager {
    constructor() {
        this.game = [];
    }
    createGame(player1) {
        const id = (0, uuid_1.v4)();
        const game = new game_1.Game(id, player1);
        return game;
    }
    getGame(id) {
        console.log("gameds ", this.game);
        const game = this.game.find(game => game.id == id);
        return game;
    }
    removeGame(id) {
        const filter = this.game.filter(game => game.id == id);
    }
    isPlayerinGame(player) {
        const foundgame = this.game.filter(game => { var _a; return ((_a = game.player1) === null || _a === void 0 ? void 0 : _a.id) == player; });
        console.log(foundgame, "aleradhy in game ", player);
        if (foundgame.length > 1)
            return true;
        return false;
    }
    joinGame(player) {
        var _a;
        const game = this.game.find(game => game.status == game_1.GameStatus.waiting);
        const isingame = this.isPlayerinGame(player.id);
        if (isingame)
            throw new Error("alerady in game");
        if (!game) {
            const id = (0, uuid_1.v4)();
            const game = new game_1.Game(id, player);
            this.game.push(game);
            return {
                game
            };
        }
        else {
            if (((_a = game.player1) === null || _a === void 0 ? void 0 : _a.socket) == player.socket) {
                return { game };
            }
            game.addPlayer(player);
        }
        return {
            game
        };
    }
}
exports.GameManager = GameManager;
