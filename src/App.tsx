import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import {
  SignUpPage,
} from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
