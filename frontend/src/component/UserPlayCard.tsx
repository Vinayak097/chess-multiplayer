import { useIsMobile } from '@/hooks/use-mobile'
import { UserRoundArrowLeft } from 'lucide-react'
import React from 'react'


const formatTimer = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const paddedSeconds = remainingSeconds.toString().padStart(2, '0')
  return `${minutes}:${paddedSeconds}`
}

const UserPlayCard = ({yourTurn, timer , player }: {yourTurn:boolean, timer: number,player:any }) => {
    const ismobile = useIsMobile()
    console.log(yourTurn, ' yourtrun',player) 
  return (
    <div  className='border w-full lg:max-w-sm bg-black flex justify-between p-1 px-2 items-center h-12 lg:max-h-18 border-orange-500'>
        <div className='flex gap-3 items-center '>
            <UserRoundArrowLeft className='border p-1 size-4/4 border-orange-500 ' height={ismobile?30:35} width={ismobile?30:35}/>
        <div className='text-xs lg:text-md'>   
                <span className='text-orange-600'>{yourTurn && "Your Turn"}</span>
                
                <h1>CyberTal04</h1>
                
            </div>
        </div>
        <div>
            <span className='text-green-400 text-sm lg:text-md'>{formatTimer(timer)}</span>
        </div>
    </div>
  )
}

export default UserPlayCard