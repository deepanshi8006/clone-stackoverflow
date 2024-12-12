import React from 'react'
import './Rightsidebar.css'
import Widget from './Widget'
import Widgettag from './Widgettag'
import { useLocation } from 'react-router-dom';

const Rightsidebar = () => {
  const location = useLocation(); 

  if (location.pathname.startsWith('/Question/')) {
    return null; 
  }
  return (
    <aside className="right-sidebar" >
      <Widget/>
      <Widgettag/>
    </aside>
  )
}

export default Rightsidebar