import React, { useEffect, useState } from 'react'
import Footer from '../Footer/Footer'
import AdminHeader from '../Header/AdminHeader'
import axios from '../../../utils/axios'
import './users.css'
import { adminDeleteUser, admingetAllusers, adminSearchUser } from '../../../utils/Constants'
import { useNavigate } from 'react-router-dom';
import './userManagement.css'
import Swal from 'sweetalert2'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'; 
import SideNavbar from '../SideNav/SideNavbar'


function Usermanagement() {
      
    const navigate=useNavigate()
    const [users,setUsers]=useState([])

    useEffect((key)=>{
        getUserLists();
    },[])

    const getUserLists = ()=>{
            axios.get(admingetAllusers).then((response)=>{
                setUsers(response.data.users)
            }).catch((err)=>{
                console.log("oops user catch client");

            })
    }


    const userSearch=(e)=>{
        let userr=e.target.value;
        console.log(userr);
        if(!userr){
            getUserLists();
        }else{
            axios.get(`${adminSearchUser}/${userr}`).then((res)=>{
                setUsers(res.data.users)
            })
        }
    }


    const deleteUser=(id)=>{
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes,delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${adminDeleteUser}/${id}`).then((res)=>{
                    getUserLists();
                    
                })
              Swal.fire(
                'Deleted!',
                'User has been deleted.',
                'success'
              )
            }
          })
    }


    return (
      <>
         <AdminHeader  />
      <div className="horizontal-one">
        
            <input class="form-control mb-3 w-25 searchadmin" onChange={userSearch} name="query" type="search" placeholder="Search" aria-label="Search"/>
            
                <button class=" addButtonAdmin" onClick={()=>navigate('/adminAddUser')} >add</button>
          
                <TableContainer component={Paper}>
             
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="w-5">No</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((obj, index) => (
            <TableRow key={obj._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{obj.userName}</TableCell>
              <TableCell>{obj.email}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" onClick={() => navigate(`/updateUser/${obj._id}`)}>
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="error" onClick={() => deleteUser(obj._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
            <Footer />
        </div>
        
        
        </>
    )
}

export default Usermanagement