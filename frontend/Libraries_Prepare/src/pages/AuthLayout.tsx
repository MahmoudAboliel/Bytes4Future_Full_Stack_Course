import React from 'react'
import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <div className='flex flex-col items-center justify-start min-h-screen bg-gray-50'>
        <h2 className='text-3xl text-center p-2 font-medium'>Auth Page</h2>
        <Outlet />
    </div>
  )
}

export default AuthLayout