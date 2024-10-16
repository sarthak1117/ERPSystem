// import { useState } from "react";
// import { Link } from "react-router-dom";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import { useDispatch } from "react-redux";

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dispatch = useDispatch();

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   // You can uncomment this function when needed
//   // const handleSignout = async () => {
//   //   try {
//   //     const res = await fetch("/api/v1/user/logout", {
//   //       method: "POST",
//   //     });
//   //     const data = await res.json();
//   //     if (!res.ok) {
//   //       console.log(data.message);
//   //     } else {
//   //       dispatch(logoutSuccess());
//   //     }
//   //   } catch (error) {
//   //     console.log(error.message);
//   //   }
//   // };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="container-fluid">
//         {/* Navbar Toggler */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           onClick={toggleDropdown}
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Navbar Links */}
//         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//             <li className="nav-item">
//               <Link className="nav-link text-white" to="/dashboard">
//                 Dashboard
//               </Link>
//             </li>
//           </ul>
//         </div>

//         {/* Search Form */}
//         <form className="d-flex me-3" role="search">
//           <input
//             className="form-control me-2"
//             type="search"
//             placeholder="Search"
//             aria-label="Search"
//           />
//           <button className="btn btn-outline-success" type="submit">
//             Search
//           </button>
//         </form>

//         {/* Profile Dropdown */}
//         <div className="dropdown">
//           <button
//             className="dropdown-toggle d-flex align-items-center text-white"
//             type="button"
//             id="navbarDropdownMenuAvatar"
//             onClick={toggleDropdown}
//           >
//             <AccountCircleIcon />
//           </button>
//           <ul
//             className={`dropdown-menu dropdown-menu-end ${isOpen ? "show" : ""}`}
//             aria-labelledby="navbarDropdownMenuAvatar"
//           >
//             <li>
//               <Link className="dropdown-item" to="/profile">
//                 My profile
//               </Link>
//             </li>
//             <li>
//               <Link className="dropdown-item" to="/settings">
//                 Change password
//               </Link>
//             </li>
//             <li>
//               <Link className="dropdown-item" to="/login">
//                 Logout
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Header;

// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// const Header = ({ isCollapsed }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <nav className={`bg-gray-800 p-2 transition-all duration-300 ${isCollapsed ? 'pl-5 pr-5' : 'pl-20 pr-20'}`}>
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Left Section: Brand Logo */}
//         <div className="flex items-center">
//           <Link to="/" className="text-white text-xl font-bold ml-4">
//             School Name
//           </Link>
//         </div>

//         {/* Right Section: Search and Profile */}
//         <div className="flex items-center space-x-4">
//           <form className={`hidden md:flex ${isCollapsed ? 'hidden' : 'flex'}`}>
//             <input
//               type="text"
//               className="px-2 py-1 rounded bg-gray-700 text-white"
//               placeholder="Search"
//             />
//             <button
//               className="ml-2 px-3 py-1 text-sm bg-green-500 text-white rounded"
//               type="submit"
//             >
//               Search
//             </button>
//           </form>

//           <div className="relative">
//             <button
//               className="flex items-center text-white"
//               onClick={toggleDropdown}
//             >
//               <AccountCircleIcon />
//             </button>

//             {isOpen && (
//               <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg py-2">
//                 <li className="hover:bg-gray-100">
//                   <Link to="/profile" className="block px-4 py-2">
//                     My Profile
//                   </Link>
//                 </li>
//                 <li className="hover:bg-gray-100">
//                   <Link to="/settings" className="block px-4 py-2">
//                     Change Password
//                   </Link>
//                 </li>
//                 <li className="hover:bg-gray-100">
//                   <Link to="/login" className="block px-4 py-2">
//                     Logout
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       {isCollapsed && (
//         <div className="md:hidden mt-4">
//           <Link className="block text-white mb-2" to="/dashboard">
//             Dashboard
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Header;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = ({ isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`bg-gray-800 p-2 transition-all duration-300 ${isCollapsed ? 'pl-5 pr-5' : 'pl-20 pr-20'}`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: Brand Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-white text-xl font-bold ml-4">
            School Name
          </Link>
        </div>

        {/* Right Section: Search and Profile */}
        <div className="flex items-center space-x-4">
          <form className={`hidden md:flex ${isCollapsed ? 'hidden' : 'flex'}`}>
            <input
              type="text"
              className="px-2 py-1 rounded bg-gray-700 text-white"
              placeholder="Search"
            />
            <button
              className="ml-2 px-3 py-1 text-sm bg-green-500 text-white rounded"
              type="submit"
            >
              Search
            </button>
          </form>

          <div className="relative">
            <button
              className="flex items-center text-white"
              onClick={toggleDropdown}
            >
              <AccountCircleIcon />
            </button>

            {isOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg py-2">
                <li className="hover:bg-gray-100">
                  <Link to="/profile" className="block px-4 py-2">
                    My Profile
                  </Link>
                </li>
                <li className="hover:bg-gray-100">
                  <Link to="/settings" className="block px-4 py-2">
                    Change Password
                  </Link>
                </li>
                <li className="hover:bg-gray-100">
                  <Link to="/login" className="block px-4 py-2">
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isCollapsed && (
        <div className="md:hidden mt-4">
          <Link className="block text-white mb-2" to="/dashboard">
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;
