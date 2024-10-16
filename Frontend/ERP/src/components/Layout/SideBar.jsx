// import React from "react";
// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   return (
//     <div className="flex">
//       {/* <div
//         className="flex-shrink-0 p-3 bg-dark-purple text-white"
//         style={{ width: "250px" }}
//       > */}
//     <div
//         className={` ${
//           open ? "w-72" : "w-20 "
//         } bg-dark-purple h-screen p-5  pt-8 relative duration-300`}
//       >
//         <Link className="navbar-brand mt-1 mt-lg-0 " to="">  
//             <img
//                 src="/download 2.png"
//                 style={{ height: "50px", width: "150px" }}
//                 alt="ERP Logo"
//                 loading="lazy"
//               />
//          </Link>
//         <Link
//           to="/"
//           className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom"
//         >
//           <svg className="bi me-2" width="30" height="24"></svg>
//           <span className="fs-5 fw-semibold text-white">Current Session</span>
//         </Link>
//         <ul className="list-unstyled ps-0">
//           {/* Student Information Section */}
//           <li className="mb-1">
//             <button
//               className="btn btn-toggle align-items-center rounded collapsed text-white"
//               data-bs-toggle="collapse"
//               data-bs-target="#student-info-collapse"
//               aria-expanded="false"
//             >
//               Student Information
//             </button>
//             <div className="collapse" id="student-info-collapse">
//               <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Student Details
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Student Admission
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Disable Student
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Multi Course Student
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Bulk Delete
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Student Categories
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </li>
          
//           {/* Attendance Section */}
//           <li className="border-top my-3"></li>
//           <li className="mb-1">
//             <button
//               className="btn btn-toggle align-items-center rounded collapsed text-white"
//               data-bs-toggle="collapse"
//               data-bs-target="#attendance-collapse"
//               aria-expanded="false"
//             >
//               Attendance
//             </button>
//             <div className="collapse" id="attendance-collapse">
//               <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Student Attendance
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Attendance By Date
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Approve Leave
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </li>
          
//           {/* Examination Section */}
//           <li className="border-top my-3"></li>
//           <li className="mb-1">
//             <button
//               className="btn btn-toggle align-items-center rounded collapsed text-white"
//               data-bs-toggle="collapse"
//               data-bs-target="#exam-collapse"
//               aria-expanded="false"
//             >
//               Examination
//             </button>
//             <div className="collapse" id="exam-collapse">
//               <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Exam Group
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Exam Schedule
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Exam Result
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Design Admit Card
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Print Admit Card
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Design Marksheet
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Print Marksheet
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-light rounded text-white">
//                     Marks Grade
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </li>
//           <li className="border-top my-3"></li>
//           <li className="mb-1">
//             <button
//               className="btn btn-toggle align-items-center rounded collapsed  text-white"
//               data-bs-toggle="collapse"
//               data-bs-target="#account-collapse"
//               aria-expanded="false"
//             >
//                 Online Examinations
//             </button>
//             <div className="collapse" id="account-collapse">
//               <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                    Online Exam
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Question Bank
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </li>
//           <li className="border-top my-3"></li>
//           <li className="mb-1">
//             <button
//               className="btn btn-toggle align-items-center rounded collapsed  text-white"
//               data-bs-toggle="collapse"
//               data-bs-target="#account-collapse"
//               aria-expanded="false"
//             >
//                 Academics
//             </button>
//             <div className="collapse" id="account-collapse">
//               <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                    Course Timetable
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Teacher Timetable
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Assign Course Teacher
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Promote Student
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Subject Group 
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Subjects
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Course
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Batchs
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </li>
//           <li className="border-top my-3"></li>
//           <li className="mb-1">
//             <button
//               className="btn btn-toggle align-items-center rounded collapsed  text-white"
//               data-bs-toggle="collapse"
//               data-bs-target="#account-collapse"
//               aria-expanded="false"
//             >
//                 Fees Collection
//             </button>
//             <div className="collapse" id="account-collapse">
//               <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                    Collect Fees 
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Search Fees Payemnt
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     view Fee Report 
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Fees Master
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Fees Group
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Fees Type
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Fees Discount
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Fees Carry Forward 
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Fees Reminder
//                   </Link>
//                 </li>
            
//               </ul>
//             </div>
//           </li>
//           <li className="border-top my-3"></li>
//           <li className="mb-1">
//             <button
//               className="btn btn-toggle align-items-center rounded collapsed  text-white"
//               data-bs-toggle="collapse"
//               data-bs-target="#account-collapse"
//               aria-expanded="false"
//             >
//                 Income
//             </button>
//             <div className="collapse" id="account-collapse">
//               <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                    Add Income
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Search Income
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Search Income
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </li>
//           <li className="border-top my-3"></li>
//           <li className="mb-1">
//             <button
//               className="btn btn-toggle align-items-center rounded collapsed  text-white"
//               data-bs-toggle="collapse"
//               data-bs-target="#account-collapse"
//               aria-expanded="false"
//             >
//                 Online Examinations
//             </button>
//             <div className="collapse" id="account-collapse">
//               <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                    Online Exam
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Question Bank
//                   </Link>
//                 </li>
                
    
//               </ul>
//             </div>
//           </li>
//           <li className="border-top my-3"></li>
//           <li className="mb-1">
//             <button
//               className="btn btn-toggle align-items-center rounded collapsed  text-white"
//               data-bs-toggle="collapse"
//               data-bs-target="#account-collapse"
//               aria-expanded="false"
//             >
//                 Online Examinations
//             </button>
//             <div className="collapse" id="account-collapse">
//               <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                    Online Exam
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Question Bank
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </li>
//           <li className="border-top my-3"></li>
//           <li className="mb-1">
//             <button
//               className="btn btn-toggle align-items-center rounded collapsed  text-white"
//               data-bs-toggle="collapse"
//               data-bs-target="#account-collapse"
//               aria-expanded="false"
//             >
//                 Online Examinations
//             </button>
//             <div className="collapse" id="account-collapse">
//               <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                    Online Exam
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Question Bank
//                   </Link>
//                 </li>
                
    
//               </ul>
//             </div>
//           </li>
//           <li className="border-top my-3"></li>
//           <li className="mb-1">
//             <button
//               className="btn btn-toggle align-items-center rounded collapsed  text-white"
//               data-bs-toggle="collapse"
//               data-bs-target="#account-collapse"
//               aria-expanded="false"
//             >
//                 Online Examinations
//             </button>
//             <div className="collapse" id="account-collapse">
//               <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                    Online Exam
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Question Bank
//                   </Link>
//                 </li>
                
    
//               </ul>
//             </div>
//           </li>
//           <li className="border-top my-3"></li>
//           <li className="mb-1">
//             <button
//               className="btn btn-toggle align-items-center rounded collapsed  text-white"
//               data-bs-toggle="collapse"
//               data-bs-target="#account-collapse"
//               aria-expanded="false"
//             >
//                 Online Examinations
//             </button>
//             <div className="collapse" id="account-collapse">
//               <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                    Online Exam
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="#" className="link-dark rounded">
//                     Question Bank
//                   </Link>
//                 </li>
                
    
//               </ul>
//             </div>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight, FaChevronDown, FaUserGraduate, FaCalendarAlt, FaFileAlt } from "react-icons/fa";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section],
    });
  };

  const menus = [
    {
      title: "Student Information",
      icon: <FaUserGraduate />,
      submenus: [
        "Student Details",
        "Student Admission",
        "Disable Student",
        "Multi Course Student",
        "Bulk Delete",
        "Student Categories",
      ],
    },
    {
      title: "Attendance",
      icon: <FaCalendarAlt />,
      submenus: [
        "Student Attendance",
        "Attendance By Date",
        "Approve Leave",
      ],
    },
    {
      title: "Examination",
      icon: <FaFileAlt />,
      submenus: [
        "Exam Group",
        "Exam Schedule",
        "Exam Result",
        "Design Admit Card",
        "Print Admit Card",
        "Design Marksheet",
        "Print Marksheet",
        "Marks Grade",
      ],
    },
  ];

  return (
    <div className={`flex flex-col h-screen bg-gray-800 text-white ${isCollapsed ? "w-20" : "w-64"} transition-all duration-300`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Link to="/" className="navbar-brand mt-1">
          <img
            src="/download 2.png"
            alt="ERP Logo"
            style={{ height: "70px", width: "180px" }}
            className={`rounded-lg border-gray-500 transition-all duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}
            loading="lazy"
          />
        </Link>
        <button onClick={toggleSidebar} className="mt-4 ml-6 text-white">
          {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
        </button>
      </div>

      {/* Sidebar Menus */}
      <div className="flex-1 overflow-y-auto">
        {menus.map((menu, index) => (
          <div key={index}>
            {/* Main Heading */}
            <button
              className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-700"
              onClick={() => toggleSection(menu.title)}
            >
              {menu.icon}
              {!isCollapsed && (
                <>
                  <span className="flex-1 ml-3">{menu.title}</span>
                  <span>{openSections[menu.title] ? <FaChevronDown /> : <FaChevronRight />}</span>
                </>
              )}
            </button>
            {/* Submenus */}
            {!isCollapsed && openSections[menu.title] && (
              <ul className="pl-12">
                {menu.submenus.map((submenu, subIndex) => (
                  <li key={subIndex} className="py-2">
                    <Link to="#" className="hover:text-gray-400">
                      {submenu}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t border-gray-700"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
