import React from 'react'
import {useSelector} from 'react-redux' 
import {Navigate} from "react-router"
import Loader from '../../Shared/components/Loader.jsx'

const Protected = ({children , role = "buyer"}) => {

  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)

  if (loading) {
    
    return <Loader fullScreen label="Checking your session" />

  }if (!user) {

    return <Navigate to='/login'/>

  }

  if (user.role !== role) {
    
    return <Navigate to='/' />

  }

  return children
}

export default Protected
