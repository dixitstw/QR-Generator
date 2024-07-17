import React from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import QRCodeForm from './components/QRCodeForm';                                                                 
import CallBackHandler from './components/CallbackHandler';

const MyRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/callback" element={<CallBackHandler />} />
      <Route path="/qrcodeform" element={<QRCodeForm/>} />
      <Route path="/qrcodeform/update/:qrId" element={<QRCodeForm />} /> {/* Route for updating QR codes */}


    </Routes>
    </BrowserRouter>
  )
}

export default MyRoutes