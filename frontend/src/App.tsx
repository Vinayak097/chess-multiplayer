
import './App.css'
import { Routes,Route} from 'react-router-dom'

import Game from './screens/Game'
import Home from './pages/Home'
function App() {
  return (
    <>
     

   
     <Routes>
      
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='/game' element={<Game></Game>} ></Route>
     </Routes>
     
    </>
  )
}

export default App
