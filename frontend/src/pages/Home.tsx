import React from 'react'
import PlayCards from '../component/PlayCards'
import { faZap, faClock, faBolt } from '@fortawesome/free-solid-svg-icons';
import EnterArenaCard from '@/component/EnterArenaCard';
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
const Home = () => {
  return (
    <div className='border  h-screen'>
      <PlayCards {...gameModes[0]} />
      <EnterArenaCard></EnterArenaCard>
    </div>
  )
}

export default Home
