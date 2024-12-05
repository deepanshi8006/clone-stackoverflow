import React from 'react'
import './Rightsidebar.css'
import Widget from './Widget'
import Widgettag from './Widgettag'
import { useLocation } from 'react-router-dom';

const Rightsidebar = () => {
  const location = useLocation(); // Get the current route

  // Do not render Rightsidebar on Questiondetails.jsx page
  if (location.pathname.startsWith('/Question/')) {
    return null; // Don't render Rightsidebar for Question pages
  }
  return (
    <aside className="right-sidebar" >
      <Widget/>
      <Widgettag/>
    </aside>
  )
}

export default Rightsidebar