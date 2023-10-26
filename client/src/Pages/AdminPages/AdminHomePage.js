import React from 'react'
import AdminDash from '../../Components/AdminComponents/Dashboard/AdminDash'
import AdminHeader from '../../Components/AdminComponents/Header/AdminHeader'
import SideNavbar from '../../Components/AdminComponents/SideNav/SideNavbar'


function AdminHomePage() {
  return (
    <div>
      
        <AdminDash />
        <SideNavbar />
    </div>
  )
}

export default AdminHomePage