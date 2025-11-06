import { Routes, Route } from "react-router-dom"

import Home from "@/pages/home/page"
import Login from "@/pages/login/page"
import Register from "@/pages/register/page"

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
  )
}

export default App
