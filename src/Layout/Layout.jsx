import React from 'react'
import Header from '../GlobalFolder/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../GlobalFolder/Footer'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  return (
    <div>
      <Header/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
      <ToastContainer/>
    </div>
  )
}

export default Layout
