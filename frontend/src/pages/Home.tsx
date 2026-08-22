import PlayCards from '../component/PlayCards'
import { faZap, faClock, faBolt } from '@fortawesome/free-solid-svg-icons';
import EnterArenaCard from '@/component/EnterArenaCard';
import { socket } from '@/socket';
import { useNavigate } from 'react-router-dom';

const gameModes = [
  {
    icon: faZap,
    title: "Bullet" as GameType,
    description: "Blink and you lose.",
    time: "1 + 0",
    players: "12,481",
  },
  {
    icon: faClock,
    title: "Blitz" as GameType,
    description: "Fast, punchy, ruthless.",
    time: "3 + 2",
    players: "24,902",
  },
  {
    icon: faBolt,
    title: "Rapid" as GameType,
    description: "Think before moving.",
    time: "10 + 0",
    players: "8,451",
  },
];
export type GameType = "Rapid" | "Blitz" | "Bullet";

const Home = () => {
  const navigate=useNavigate()
  function quickPlay(gametype:GameType){
    const playerId = crypto.randomUUID()
    socket.emit('join-game',{
      id: playerId,
      gametype:gametype
    })
    navigate(`/game?s=waiting&&playerId=${playerId}`)
  }

  return (
    <main className='home-shell'>
      <div className="home-grid">
        <section className="home-intro">
          <div className="eyebrow"><span className="status-dot" /> NODE // 07 ONLINE</div>
          <h1>Find your<br /><em>next move.</em></h1>
          <p>Competitive chess for sharp minds. Pick a clock, enter the queue, and make the board yours.</p>
          <div className="intro-meta"><span>LIVE QUEUE</span><strong>2,431</strong><span>PLAYERS ACTIVE</span></div>
        </section>
        <section className="home-controls">
          <div className="w-full">
  <EnterArenaCard quickPlay={quickPlay} />
</div>
<div className="w-full">
  <div className="mode-grid">
    {gameModes.map((gamemode,index) => (
      <PlayCards key={index} {...gamemode} />
    ))}
  </div>
</div>
        </section>
      </div>
      <footer className="home-footer"><span>CHESS / MULTIPLAYER</span><span>EST. 2026</span><span>BUILT FOR THE BOLD</span></footer>
    </main>
  )
}

export default Home
