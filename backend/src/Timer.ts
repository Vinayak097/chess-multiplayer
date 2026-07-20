export class Timer{
    gameId:string;
    blackTime:number;
    whiteTime:number;
    currentplayer:'w'|'b';
    ontimeouts:(gameId:string,loser:string)=>void;
    interval?:NodeJS.Timeout;
    gameTick:(whiteTimer:number , blackTimer:number,gameId:string)=>void;

    constructor(gameId:string,whiteTime:number,blackTime:number,currentplayer:'w'|'b',ontimeouts:(gameId:string,loser:string)=>void ,gameTick:(whiteTimer:number , blackTimer:number,gameId:string)=>void){
        this.gameId=gameId
        this.blackTime=blackTime
        this.currentplayer=currentplayer
        this.whiteTime=whiteTime
        this.ontimeouts=ontimeouts
        this.gameTick=gameTick
    }

    start(){
        this.interval = setInterval(()=>{
            if(this.currentplayer=='w'){
                this.whiteTime-=1
                this.gameTick(this.whiteTime,this.blackTime,this.gameId)
                if(this.whiteTime<=0){
                    this.ontimeouts(this.gameId,'w')
                    this.stop();
                }
            }else{
                this.blackTime-=1
                 this.gameTick(this.whiteTime,this.blackTime,this.gameId)
                if(this.blackTime<=0){
                    this.ontimeouts(this.gameId,'b')
                    this.stop()
                }
            }
        },1000)
    }

    switchTurn(p:'w'|'b'){
        this.currentplayer=p
    }
    stop(){
        clearInterval(this.interval)

    }
}