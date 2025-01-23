import { useEffect, useState } from "react"

export const ws_url = "ws://localhost:8080"

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket(ws_url)
    
    ws.onopen = () => {
      console.log("WebSocket connected")
      setSocket(ws)
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
      setSocket(null)
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    return () => {
      ws.close()
    }
  }, [])

  return socket
}
