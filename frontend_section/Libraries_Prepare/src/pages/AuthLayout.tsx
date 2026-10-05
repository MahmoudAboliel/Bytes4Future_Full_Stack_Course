import React from 'react'
import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <div className='h-screen bg-red-200'>
        <h2 className='text-4xl text-center p-6 font-medium'>Auth Page</h2>
        <Outlet />
    </div>
  )
}

export default AuthLayout