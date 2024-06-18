import React from 'react'
import Chessboard from '../compoenents/chessboard'
function Game() {
  return (
    <div>

    
    <div className='flex justify-center border'>
      <div className='pt-8 max-w-screen-lg w-full '>
        <div className='grid grid-cols-6 gap-4  '>
        <div className='col-span-4  bg-red-200 w-full'>
          <Chessboard></Chessboard>
        </div>
        <div className='col-span-2 bg-green-200 w-full' >
          <button>Play </button>
          
        </div>
        </div>

        </div>
     </div>
    </div>
  )
}

export default Game