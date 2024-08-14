// import { useState } from 'react'
// import reactLogo from './assets/react.svg'

import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Signup from './component/Signup.jsx'
import Admin from './component/Admin.jsx'
import Tp from "./component/Tp.jsx"
import Ps from "./component/Ps.jsx"
import ELCC from "./component/ELCC.jsx"
import SD from "./component/SD.jsx"
import Editintern from "./component/Editintern.jsx"
import AddIntern from "./component/Addintern.jsx"
function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup/>}></Route>
      <Route path="/signup/admin" element={<Admin/>}></Route>
      <Route path="/signup/admin/tp" element={<Tp />}></Route>
                        <Route path="/signup/admin/SD" element={<SD/>}></Route>
                        <Route path="/signup/admin/ELCC" element={<ELCC />}></Route>
                        <Route path="/signup/admin/Ps" element={<Ps />}></Route>
                        <Route path="/signup/admin/addintern" element={<AddIntern />}></Route>
                        <Route path="/signup/admin/editintern" element={<Editintern />}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
