// import React from "react";
// import Header from "./Navbar";
// import Sidebar from "./SideBar";

// const Layout = ({ children, userRole }) => {
//   return (
//     <div className="flex min-h-screen ">
//       {/* Sidebar - Fixed position and 25% width */}
//       <div className="fixed w-1/4"  style={{ position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 10, width: '17%' }}>
//         <Sidebar 
//         //   userRole={userRole}   
//         />
//       </div>
      
//       {/* Main Content Area - 75% width */}
//       <div className="flex flex-col flex-1 overflow-y-auto" >
//         {/* Header - Fixed position */}
//         <div className="move-left" style={{ position:"fixed" ,top: 0, left: '17%', right: 0, zIndex: 10, width: '83%' }} >
//           <Header/>
//         </div>
        
//         {/* Main Content - Below the Header */}
//         <div className="mt-16" style={{ position:"relative" ,top: 0, left: '17%', right: 0, zIndex: 10, width: '83%' }}>
//           <main className="flex-1 p-12">{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;


// import React, { useState } from "react";
// import Header from "./Navbar";
// import Sidebar from "./SideBar";

// const Layout = ({ children }) => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar - Fixed position and 25% width */}
//       <div
//         className={`fixed top-0 bottom-0 left-0 z-10 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}
//       >
//         <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
//       </div>

//       {/* Main Content Area */}
//       <div className={`flex flex-col flex-1 overflow-y-auto ${isCollapsed ? "ml-20" : "ml-64"} transition-all duration-300`}>
//         {/* Header - Fixed position */}
//         <div className="fixed top-0 left-0 right-0 z-10">
//           <Header isCollapsed={isCollapsed} />
//         </div>

//         {/* Main Content - Below the Header */}
//         <div className="mt-16">
//           <main className="flex-1 p-12">{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;


import React, { useState } from "react";
import Header from "./Navbar";
import Sidebar from "./SideBar";

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Fixed position */}
      <div className={`top-0 bottom-0 left-0 z-10 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className="p-2 border-b border-gray-300 ">
          <Header isCollapsed={isCollapsed} />
        </div>

        {/* Main Content - Below the Header */}
        <div className="flex-1 p-12 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
