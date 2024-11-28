import React from 'react'
import Leftsidebar from "../../component/Leftsidebar/Leftsidebar"
import Rightsidebar from '../../component/Rightsidebar/Rightsidebar'
import Homemainbar from '../../component/Homemainbar/Homemainbar'
import '../../App.css'

const Question = ({slidein}) => {
  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein}/>
      <div className="home-container-2">
        <Homemainbar/>
        <Rightsidebar/>
      </div>
    </div>
  )
}

export default Question