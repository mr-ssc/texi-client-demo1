
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './component/Navbar';
import Home from './component/Home'
import Hero from "./component/Hero"
import BookingForm from './component/BookingForm';
import About from './component/About';
import Contact from './component/Contact';
import Footer from './component/Footer';





function App() {
  return (
    <>

      <Routes>

        <Route path='/' element={<Home />}></Route>
        <Route path='/Navbar' element={<Navbar />}></Route>
        <Route path='/Hero' element={<Hero />}></Route>
        <Route path='/BookingForm' element={<BookingForm />}></Route>
        <Route path='/About' element={<About />}></Route>
        <Route path='/Contact' element={<Contact />}></Route>
        <Route path='/Footer' element={<Footer />}></Route>


      </Routes>




    </>

  );
}

export default App
