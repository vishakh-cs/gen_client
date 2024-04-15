"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { destroyCookie, parseCookies } from 'nookies';
import { signOut } from 'next-auth/react';
import useStore from '@/Stores/store';


export default function Navbar() {

  const router = useRouter();
  const cookies = parseCookies();
  const isLoggedIn = !!cookies.token;

  const [loading, setLoading] = useState(true);

  
  const darkMode = useStore(state => state.darkMode);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSignup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push('/signup');
  };

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push('/login');
  };


  if (loading) {
    return null;
  }
  
  return (
    <header className="p-2 dark:bg-opacity-40 bg-gray-700/45 dark:bg-gray-700 text-gray-100 dark:text-gray-100 fixed w-full top-0 z-50" style={{ backdropFilter: 'blur(20px)' }}>
      <div className="container flex justify-between h-16 mx-auto">
        <button type='button' onClick={()=>router.push('/')} rel="noopener noreferrer"  aria-label="Back to homepage" className="flex items-center p-2 transition duration-300 ease-in-out transform hover:scale-105">
          <Image className='h-full object-contain w-32'
             src={darkMode ? "/Assets/White logo - no background.png" :'/Assets/Black logo - no background.png'}
            alt="generative"
            width={200}
            height={500}
          />
        </button>
        <ul className="items-stretch hidden space-x-3 lg:flex">
          <li className="flex">
            <a rel="noopener noreferrer" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:dark:text-violet-400 hover:dark:border-violet-400 transition duration-300 ease-in-out transform hover:scale-105">Product</a>
          </li>
          <li className="flex">
            <a rel="noopener noreferrer" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:dark:text-violet-400 hover:dark:border-violet-400 transition duration-300 ease-in-out transform hover:scale-105">Pricing</a>
          </li>
          <li className="flex">
            <a rel="noopener noreferrer" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:dark:text-violet-400 hover:dark:border-violet-400 transition duration-300 ease-in-out transform hover:scale-105">About</a>
          </li>
          <li className="flex">
            <a rel="noopener noreferrer" className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent hover:dark:text-violet-400 hover:dark:border-violet-400 transition duration-300 ease-in-out transform hover:scale-105">Resources</a>
          </li>
        </ul>
        <div className="items-center flex-shrink-0 hidden lg:flex">
            
              <button onClick={handleLogin} className="self-center px-8 py-3 transition duration-300 ease-in-out transform hover:scale-105">{isLoggedIn? "Dashboard ➡️" :"Login"}</button>
              {isLoggedIn? "" : <button type='button' onClick={handleSignup} className="self-center px-8 py-3 font-semibold rounded-md dark:bg-purple-800 dark:text-white transition duration-300 ease-in-out transform hover:scale-105">Sign up</button>}
        </div>
        <button className="p-4 lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 dark:text-gray-100">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}

