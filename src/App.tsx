import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import {
  SignUpPage,
  LoginPage,
  EmployeeProfilesPage,
} from './pages'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      <Routes>
        <Route path="/hr/employees" element={<EmployeeProfilesPage />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
