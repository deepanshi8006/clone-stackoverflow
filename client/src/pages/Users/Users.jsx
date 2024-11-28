import React from 'react'
import Leftsidebar from '../../component/Leftsidebar/Leftsidebar'
import Userslist from "./Userslist"
import './Users.css'

const Users = ({slidein}) => {
  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein}/>
      <div className="home-container-2" style={{marginTop:"30px"}}>
        <h1 style={{fontWeight:"400"}}>Users</h1>
        <Userslist/>
      </div>
    </div>
  )
}

export default Users