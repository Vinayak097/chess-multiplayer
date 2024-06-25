import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../compoenents/Button'
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
          <Button label='play online' onClick={()=>{navigate("/game")}}></Button>
          </div>
            
        </div>
        
        
    </div>
  )
}

