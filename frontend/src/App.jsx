
import Adminpage from './Admin/Adminpage'
import Userpage from './User/Userpage'
import Details from './Admin/Details'
import Login from './Login'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import InternDashboard from './Admin/InternDashboard'
import InternForm from './Admin/Internform'
import './App.css'
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
            <Route path='/details/:id' element={<Details />} />
            <Route path='/internDashBoard' element={<InternDashboard/>} />
            <Route path='/internform' element={<InternForm/>} />
             

          </Route>

          {/* User protected routes */}
          <Route element={<ProtectedRoute requiredRole="user" />}>
            <Route path='/user' element={<Userpage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
