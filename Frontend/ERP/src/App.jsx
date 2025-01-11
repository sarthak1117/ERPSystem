import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Header from './components/Layout/Navbar';
// import Sidebar from './components/Layout/SideBar';
import Layout from './components/Layout/Layout.jsx';
import Header from './components/Layout/Navbar';
import Sidebar from './components/Layout/SideBar.jsx';
import Login from './pages/LoginDashboard/login.jsx';
import AddIncomeHead from './pages/Income/AddIncomeHead.jsx';



const App = () => {
  return (
    
    <Router>
        <main>
         
          <Routes>
            {/* Define routes for different pages */}
            <Route path="/" element={<Layout/>} />
            <Route path="/userlogin" element={<Login/>} />
            <Route path="/incomeHeads" element={<AddIncomeHead/>} />
           
          </Routes>
        </main>
    </Router>
  );
};

export default App;

