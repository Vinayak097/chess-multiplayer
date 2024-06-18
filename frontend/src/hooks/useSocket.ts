import { useEffect, useState } from "react"
export const ws_url="ws://localhost:8080"
export const useSocket=()=>{
    const [socket,setSocket]=useState<WebSocket | null > ()

    useEffect(()=>{
        const ws=new WebSocket(ws_url);
        ws.onopen=()=>{
            console.log("connected")
            setSocket(ws);
        }
        ws.onclose=()=>{
            console.log("disconnected")
        }

        return ()=>{
            ws.close();
        }
        
    },[])

    return socket;
}
