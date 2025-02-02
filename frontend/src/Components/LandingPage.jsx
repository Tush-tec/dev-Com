import React from 'react';
import Carausel from './Carausel';
import HeaderPage from './HeaderPage';
import Footer from './Footer';
import Products from './Products';

const LandingPage = () => {
  return (
    <>
    <HeaderPage/>
    <br />
    <Carausel/>
    <Products/>
    <br />
    <Footer/>
    </>
  )
}

export default LandingPage