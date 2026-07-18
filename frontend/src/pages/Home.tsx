import React from 'react'
import PlayCards from '../component/PlayCards'
import { faZap, faClock, faBolt } from '@fortawesome/free-solid-svg-icons';
import EnterArenaCard from '@/component/EnterArenaCard';
import { MoveLeft } from 'lucide-react';
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
  return (
    <div className='border  h-screen flex  flex-col items-center justify-center p-'>
      
        <div className='w-xl'>
          <EnterArenaCard></EnterArenaCard>
        </div>
      <div className='grid grid-cols-2 gap-2 pt-2 w-xl'>
        {gameModes.map(gamemode=><PlayCards {...gamemode}></PlayCards>)}
      </div>
    </div>
  )
}

export default Home
