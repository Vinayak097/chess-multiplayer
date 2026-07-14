import React from 'react'
import Button from './Button'

const SidePannel = ({onGameStart}: any) => {
  console.log("onGameStart", typeof onGameStart)
  return (
    <div>
        <Button label='play' onClick={() => { onGameStart() }}></Button>
    </div>
  )
}

export default SidePannel
