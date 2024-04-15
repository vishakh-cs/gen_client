"use client"
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { FormEvent } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const AdminLogin = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    const router = useRouter();

    const handleAdminLogin = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const email = formData.get('Email') as string;
      const password = formData.get('password') as string;
     
      try {
         const response = await axios.post(`${baseUrl}/admin-login`, { email, password });
     
         if (response.data.success) {
           document.cookie = `token=${response.data.token}; path=/`;
           toast.success("Logged in Successfully!");
           router.push('/Admin/adminDashboard');
         } else {
           toast.error(response.data.msg || 'Invalid Credentials!');
         }
      } catch (error:any) {
         console.error(error);
         if (error.response && error.response.status === 404) {
           toast.error('The requested resource was not found. Please check the URL and try again.');
         } else {
           toast.error('An error occurred. Please try again later.');
         }
      }
     };
     
     
  return (
    <div className="bg-black text-white flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
     
        <div className="text-foreground font-semibold text-2xl tracking-tighter mx-auto flex items-center gap-2">
          <div>
          <Image className='h-full object-contain w-32'
            src="/Assets/White logo - no background.png"
            alt=""
            width={200}
            height={500}
          />
          </div>
        
        </div>
      <div className="relative mt-12 w-full max-w-lg sm:mt-10">
        <div className="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
        <div className="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none">
          <div className="flex flex-col p-6">
            <h3 className="text-xl font-semibold leading-6 tracking-tighter">Admin Login</h3>
            <p className="mt-1.5 text-sm font-medium text-white/50">Welcome to the Admin-Side.</p>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={handleAdminLogin}>
              <div>
                <div>
                  <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">Username</label>
                      <div className="absolute right-3 translate-y-2 text-green-200">

                      </div>
                    </div>
                    <input type="text" name="Email" placeholder="email" autoComplete="off" className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground" />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div>
                  <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">Password</label>
                    </div>
                    <div className="flex items-center">
                      <input type="password" name="password" placeholder='password' className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-x-2">
                <button className="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2" type="submit">Log in</button>
              </div>
            </form>
          </div>
          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
