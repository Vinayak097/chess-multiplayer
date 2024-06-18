import React from 'react'

function Button({onClick}:{onClick:()=>void}) {
    
  return (
    <div>
         <button onClick={onClick} className='text-white f p-2 w-fit px-4 bg-green-500 hover:bg-green-600 rounded-sm mt-2'>play online</button>
        
    </div>
  )
}

export default Button