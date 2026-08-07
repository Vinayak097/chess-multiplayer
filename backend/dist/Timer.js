"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
class Timer {
    constructor(gameId, whiteTime, blackTime, currentplayer, ontimeouts, gameTick) {
        this.gameId = gameId;
        this.blackTime = blackTime;
        this.currentplayer = currentplayer;
        this.whiteTime = whiteTime;
        this.ontimeouts = ontimeouts;
        this.gameTick = gameTick;
    }
    start() {
        this.interval = setInterval(() => {
            if (this.currentplayer == 'w') {
                this.whiteTime -= 1;
                this.gameTick(this.whiteTime, this.blackTime, this.gameId);
                if (this.whiteTime <= 0) {
                    this.ontimeouts(this.gameId, 'w');
                    this.stop();
                }
            }
            else {
                this.blackTime -= 1;
                this.gameTick(this.whiteTime, this.blackTime, this.gameId);
                if (this.blackTime <= 0) {
                    this.ontimeouts(this.gameId, 'b');
                    this.stop();
                }
            }
        }, 1000);
    }
    incrementTime(color, time) {
        if (color == 'w') {
            this.whiteTime += time;
        }
        else {
            this.blackTime += time;
        }
        this.gameTick(this.whiteTime, this.blackTime, this.gameId);
    }
    decrementTime(gameId, playerId, time) {
    }
    switchTurn(p) {
        this.currentplayer = p;
    }
    stop() {
        clearInterval(this.interval);
    }
}
exports.Timer = Timer;
