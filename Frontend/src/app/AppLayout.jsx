import React from 'react'
import Nav from '../features/Shared/components/Nav'
import { Outlet } from 'react-router'

const Applayout = () => {
    return (
        <>
            <Nav />
            <Outlet />
        </>
    )
}

export default Applayout
