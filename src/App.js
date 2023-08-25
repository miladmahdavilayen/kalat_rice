import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet} from 'react-router-dom';
import Home from "./routes/Home"
import Info from "./routes/LayenRice"
import Contact from "./routes/contacts"
import About from "./routes/About"
import Gallery from "./routes/gallary"
import Callback from './routes/Callback_page';


import "./App.css"



const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/payment-callback" element={<Callback />} />

      </Route>
    )
  )
  

  return (
    
    <div className="App">
      <RouterProvider router={router} />
    </div>
    
   
 );   
};

const Root = () =>{
  return(
    <>
     
      <div>
        <Outlet />
      </div>
  </>
  )
};


export default App;