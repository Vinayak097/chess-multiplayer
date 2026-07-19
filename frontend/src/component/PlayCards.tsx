import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/component/ui/card"
import { socket } from "@/socket";
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom";

interface PlaycardProp{
  icon: IconProp;
  title: string;
  time: string;
  players: string;
  description: string;
}

const PlayCards = ({ icon, title, time, players,description }: PlaycardProp) => {
  const navigate=useNavigate()
  return (
    <Card  onClick={()=>{socket.emit('join-game',{id:crypto.randomUUID(),type:title}) 
    navigate(`/game?waiting`)}} className="border cursor-pointer hover:opacity-50 transition-all bg-black w-54 h-48">
      <CardHeader>
        <CardTitle>
          <FontAwesomeIcon
            className="border-orange-500 bg-gray-900 h-8 w-8 size-4 text-orange-500 py-2 px-1 border"
            icon={icon}
          />
        </CardTitle>        
        <CardAction className="text-blue-500 border py-1 text-xs font-bold border-gray-400 px-2">{time}</CardAction>
      </CardHeader>
      
      <CardContent className="text-white" >
        <CardTitle className=" ">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>

      <CardFooter className="text-orange-500">
        <span className="p-1 bg-orange-500 border mr-1"></span>
        {players}
      </CardFooter>
    </Card>
  )
}

export default PlayCards
