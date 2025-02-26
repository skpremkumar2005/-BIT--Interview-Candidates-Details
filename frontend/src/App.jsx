import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Adminpage from './Admin/Adminpage'
import Userpage from './User/Userpage'
import TP from './Admin/components/TP'
import Iqac from './Admin/components/Iqac'
import Ps from './Admin/components/Ps'
import Rp from './Admin/components/Rp'
import Sl from './Admin/components/Sl'
import TPu from './User/components/TP'
import Iqacu from './User/components/Iqac'
import Psu from './User/components/Ps'
import Rpu from './User/components/Rp'
import Slu from './User/components/Sl'
import Login from './Login'
import TPud from './User/Userdetail/TP'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'
import TPAud from './Admin/Userdetail/TP'

import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          
          {/* Admin protected routes */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path='/admin' element={<Adminpage />} />
            <Route path='/admin/tp' element={<TP />} />
            <Route path='/admin/iqac' element={<Iqac />} />
            <Route path='/admin/ps' element={<Ps />} />
            <Route path='/admin/sl' element={<Sl />} />
            <Route path='/admin/rp' element={<Rp />} />
            <Route path='/admin/tp/:id' element={<TPAud/>}/>

          </Route>

          {/* User protected routes */}
          <Route element={<ProtectedRoute requiredRole="user" />}>
            <Route path='/user' element={<Userpage />} />
            <Route path='/user/tp' element={<TPu />} />
            <Route path='/user/iqac' element={<Iqacu />} />
            <Route path='/user/ps' element={<Psu />} />
            <Route path='/user/sl' element={<Slu />} />
            <Route path='/user/rp' element={<Rpu />} />
            <Route path='/user/tp/:id' element={<TPud/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
