"use client"
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';

const AdminSidebar = () => {
  const  pathname = usePathname();
  const router = useRouter();

  const routes = [
    { path: '/Admin/adminDashboard', index: 0 },
    { path: '/Admin/usermanagement', index: 1 },
    
  ];


  // Find the index of the current route
  const selectedIndex = routes.findIndex((route) => pathname.startsWith(route.path));

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-black border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
      <Image className='ml-9 object-contain w-32'
        src="/Assets/White logo - no background.png"
        alt=""
        width={100}
        height={100}
      />

      <div className="flex flex-col items-center mt-6 -mx-2">
        <Avatar>
          <AvatarImage src="https://i.pinimg.com/originals/c1/05/df/c105dfc584feb1327285309aeda91a58.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h4 className="mx-2 mt-2 font-medium text-white dark:text-gray-200">Admin </h4>
        <p className="mx-2 mt-1 text-sm font-medium text-gray-200 dark:text-gray-400">admin@gmail.com</p>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          <button  onClick={() => router.replace('/Admin/adminDashboard')}
            className={`flex items-center px-4 py-2 mt-5 w-full text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 ${
              selectedIndex === 0 ? 'bg-blue-500 w-full text-white' : '' 
            }`}
            
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span className="mx-4 font-medium">Dashboard</span>
          </button>

          <button
            className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 ${
              selectedIndex === 1 ? 'bg-blue-500 text-white' : '' // Add selected styles
            }`}
            onClick={() => router.replace('/Admin/usermanagement')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span className="mx-4 font-medium">User Management</span>
          </button>

        </nav>
        <button type='button' className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 15H5C3.89543 15 3 14.1046 3 13V5C3 3.89543 3.89543 3 5 3H18M16 8L21 13L16 18" />
            <path d="M21 13H9" />
          </svg>
          <span 
          onClick={()=>router.replace('/Admin/AdminLogin')}
          className="mx-4 text-gray-500 hover:text-gray-700 font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
