import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import {
  SignUpPage,
  LoginPage,
  EmployeeProfilesPage,
} from './pages'
import { NavigationBar } from './components/NavigationBar'
import { Layout } from './components/Layout'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/hr/employees" 
        element={
          <Layout>
            <EmployeeProfilesPage />
          </Layout>
        } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
