import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Header from './components/Layout/Navbar';
// import Sidebar from './components/Layout/SideBar';
import Layout from './components/Layout/Layout.jsx';
import Header from './components/Layout/Navbar';
import Sidebar from './components/Layout/SideBar.jsx';



const App = () => {
  return (
    
    <Router>
        <main>
          {/* <div className="text-2xl">
          <p>Hi i am sarthak</p>
          </div>
           */}
          <Routes>
            {/* Define routes for different pages */}
            <Route path="/" element={<Layout/>} />
           
          </Routes>
        </main>
    </Router>
  );
};

export default App;

