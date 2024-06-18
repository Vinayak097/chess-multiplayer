
import './App.css'
import { Routes,Route} from 'react-router-dom'
import {Landing} from './screens/Landing'
import Game from './screens/Game'
function App() {
  return (
    <>
     

   
     <Routes>
      <Route path='/' element={<Landing></Landing>}></Route>
      <Route path='/game' element={<Game></Game>} ></Route>
     </Routes>
     
    </>
  )
}

export default App
