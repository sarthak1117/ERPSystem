import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Header from './components/Layout/Navbar';
// import Sidebar from './components/Layout/SideBar';
import Layout from './components/Layout/Layout.jsx';
import Header from './components/Layout/Navbar';
import Sidebar from './components/Layout/SideBar.jsx';
import Login from './pages/LoginDashboard/login.jsx';
import AddIncomeHead from './pages/Income/AddIncomeHead.jsx';
import AddIncome from './pages/Income/AddIncome.jsx';


const App = () => {
  return (
    
    <Router>
        <main>
         
          <Routes>
            {/* Define routes for different pages */}
            <Route path="/" element={<Layout/>} />
            <Route path="/userlogin" element={<Login/>} />
            <Route path="/AddIncome" element={<AddIncome/>} />
            <Route path="/incomeHeads" element={<AddIncomeHead/>} />
           
          </Routes>
        </main>
    </Router>
  );
};

export default App;

