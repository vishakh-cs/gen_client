import Sidebar from '@/components/AdminSidebar/page';
import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
        
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800">
              Welcome to the Admin Dashboard!
            </h1>
            <p className="mt-2 text-gray-600">
              This is your admin dashboard content. Customize it based on your requirements.
            </p>
          
          </div>
        </main>
      </div>
    </div>
  );
}
