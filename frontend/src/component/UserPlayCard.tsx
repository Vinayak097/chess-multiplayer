import { UserRound } from 'lucide-react'


const formatTimer = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const paddedSeconds = remainingSeconds.toString().padStart(2, '0')
  return `${minutes}:${paddedSeconds}`
}

type Player = { color?: string; name?: string };

const UserPlayCard = ({yourTurn, timer , player }: {yourTurn:boolean, timer: number,player?: Player }) => {
    const displayName = player?.name || (player?.color === 'b' ? 'Black player' : 'White player')
  return (
    <div className={`player-card ${yourTurn ? 'player-card-active' : ''}`}>
        <div className='flex gap-3 items-center '>
        <UserRound className='player-icon' />
        <div className='text-xs lg:text-md'>   
          <span className='turn-label'>{yourTurn ? "Your turn" : ""}</span>
                
          <h1>{displayName}</h1>
              
            </div>
        </div>
        <div>
            <div className="clock-wrap">
              <span className="clock-label">{yourTurn ? "PLAYING" : "CLOCK"}</span>
              <span className={`timer ${timer <= 10 ? "timer-danger" : ""}`}>{formatTimer(timer)}</span>
            </div>
        </div>
    </div>
  )
}

export default UserPlayCard