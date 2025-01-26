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
import PayrollForm  from './pages/payroll/payrollForm.jsx';

// import Department from './pages/DepartmentAndDesignation/Department.jsx';
// import Designation from './pages/DepartmentAndDesignation/Designation.jsx';


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
            <Route path="/payrollForm" element={<PayrollForm/>} />
            {/* <Route path="/Department" element={<Department/>} />
            <Route path="/Designation" element={<Designation/>} /> */}
          </Routes>
        </main>
    </Router>
  );
};

export default App;

