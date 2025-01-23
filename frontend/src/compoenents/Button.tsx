import React from 'react'

function Button({onClick,label}:{onClick:()=>void,label:string}) {
    
  return (
    <div>
         <button onClick={onClick} className='text-white f p-2 w-fit px-4 bg-green-500 hover:bg-green-600 rounded-sm mt-2'>{label}</button>
        
    </div>
  )
}

export default Button