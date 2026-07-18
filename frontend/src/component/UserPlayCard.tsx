import { UserRoundArrowLeft } from 'lucide-react'
import React from 'react'


const UserPlayCard = () => {
  return (
    <div  className='border w-md flex justify-between p-2 items-center h-18'>
        <div className='flex gap-3 '>
            <UserRoundArrowLeft className='border p-1 size-4/4'/>
            <div>
                <h1>CyberTal04</h1>
                
            </div>
        </div>
        <div>
            <span className='text-green-400 text-xl'>04:42</span>
        </div>
    </div>
  )
}

export default UserPlayCard