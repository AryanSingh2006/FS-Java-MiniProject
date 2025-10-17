import React from 'react'
import Hero from '../Components/Hero.jsx'
import Feature from '../Components/Feature.jsx' 
import Info from '../Components/Info.jsx'
import Footer from '../Components/Footer.jsx' 

const Home = () => {
  return (
    < div className='overflow-x-hidden'>
    <Hero/>
    <Feature/>
    <Info/>
    <Footer/>
    </div>
  )
}

export default Home
