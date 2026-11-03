import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import Loader from '../../Shared/components/Loader.jsx'

const GuestOnly = ({ children }) => {

  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)

  if (loading) {
    return <Loader fullScreen label="Checking your session" />
  }

  if (user) {
    return <Navigate to={user.role === 'seller' ? '/seller/dashboard' : '/'} replace />
  }

  return children
}

export default GuestOnly