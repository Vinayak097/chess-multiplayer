import React from 'react'
import PlayCards from '../component/PlayCards'
import { faZap, faClock, faBolt } from '@fortawesome/free-solid-svg-icons';
import EnterArenaCard from '@/component/EnterArenaCard';
import { MoveLeft } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { socket } from '@/socket';
import { useNavigate } from 'react-router-dom';

const gameModes = [
  {
    icon: faZap,
    title: "Bullet",
    description: "Blink and you lose.",
    time: "1 + 0",
    players: "12,481",
  },
  {
    icon: faClock,
    title: "Blitz",
    description: "Fast, punchy, ruthless.",
    time: "3 + 2",
    players: "24,902",
  },
  {
    icon: faBolt,
    title: "Rapid",
    description: "Think before moving.",
    time: "10 + 0",
    players: "8,451",
  },
];
interface GameType{
   
}
const Home = () => {
  const navigate=useNavigate()
  const playerId=crypto.randomUUID()
  function quickPlay(gametype:string){
    socket.emit('join-game',{
      id: playerId,
      
      type:gametype
    })
    navigate(`/game?s=waiting&&playerId=${playerId}`)
  }

  return (
    <div className='border  h-screen flex  flex-col items-center justify-center p-'>
      
        <div className='w-md'>
          <EnterArenaCard quickPlay={quickPlay}></EnterArenaCard>
        </div>
        <div className='w-md '>
          <div className='grid grid-cols-[auto_auto] gap-2 justify-between pt-2 w-full'>
        {gameModes.map(gamemode=><PlayCards {...gamemode}></PlayCards>)}
      </div>

        </div>
      
    </div>
  )
}

export default Home
