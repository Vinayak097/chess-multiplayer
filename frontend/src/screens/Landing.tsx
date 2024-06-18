import React from 'react'
import { useNavigate } from 'react-router-dom'

export const  Landing=()=> {
  const navigate=useNavigate()
  return (
    <div className='flex p-8  bg-slate-900 md:flex-row flex-col items-center md:justify-center gap-4'>

        <div className='' >
            <img className='w-64' src="images/ChessBoard2.jpg" alt="" />
        </div>
        <div className=''>
          <div className='flex flex-col  items-center justify-center'>
          <div className=' text-3xl text-slate-600'>play chess online oht #2 site</div>
          <button onClick={()=>{navigate("/game")}} className=' text-white f p-2 w-fit px-4 bg-green-500 hover:bg-green-600 rounded-sm mt-2'>play online</button>
          </div>
            
        </div>
        
        
    </div>
  )
}

