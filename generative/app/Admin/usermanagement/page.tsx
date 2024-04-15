"use client"

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BiRefresh } from 'react-icons/bi';
import Sidebar from '@/components/AdminSidebar/page';
import Loaders from '@/components/Loaders/page';
import { UserData } from '@/app/type';

interface User {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
}

export default function UserManagement() {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [isLoading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/userdata`, {
        params: {
          page: currentPage,
          pageSize,
          searchTerm
        }
      });
      setUserData(response.data.users);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
 }, [baseUrl, currentPage, pageSize, searchTerm]);

 const searchUser = useCallback(async () => {
  try {
    const response = await axios.get(`${baseUrl}/searchuser/${searchTerm}`);
    if (response.data.user) {
      console.log(response.data);
      setSearchedUser(response.data.user[0]);
      setIsSearchPerformed(true);
    } else {
      setSearchedUser(null);
      setIsSearchPerformed(false);
    }
  } catch (error) {
    console.error('Error searching user:', error);
    toast.error('Failed to search user! Please try again.');
  }
}, [baseUrl, searchTerm]);

useEffect(() => {
  if (searchTerm.trim() !== '') {
    searchUser();
  } else {
    fetchUserData();
    setIsSearchPerformed(false);
  }
}, [currentPage, pageSize, searchTerm, fetchUserData, searchUser]);

  const handleButtonClick = () => {
    setLoading(true);
    fetchUserData();
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    setSearchedUser(null);
    setIsSearchPerformed(false);
  };

  const handleBlockUnblock = async (userId: string) => {
    try {
      const response = await axios.post(`${baseUrl}/blockuser/${userId}`);
      if (response.data.success) {
        toast.success('Successfully blocked the account!');
        setUserData(prevUserData =>
          prevUserData.map(user =>
            user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
          )
        );
      } else {
        toast.error('Failed to block the account! Please try again.');
      }
    } catch (error) {
      console.error('Error blocking the account:', error);
      toast.error('Failed to block the account! Please try again.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800">
              User Management Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome to the User Management section. Here you can manage and view user details.
            </p>
            <input
              type="text"
              placeholder="Search by username or email"
              className="p-2 border text-black border-gray-300 rounded-md"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="mt-4">
              {/* {searchedUser ? (
                <div className="p-4 border border-gray-300 rounded-md dark:text-black text-gray-800">
                  <h2 className="text-xl font-semibold dark:text-black text-gray-800">Searched User Details</h2>
                  <p>User ID: {searchedUser._id}</p>
                  <p>Name: {searchedUser.username}</p>
                  <p>Email: {searchedUser.email}</p>
                </div>
              ) : (
                <p className="text-gray-600">No user found</p>
              )} */}
            </div>


            {/* Table Section */}
            {/* Table Section */}
            {searchTerm.trim() !== '' && searchedUser ? (
              <section className="container px-4 mx-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  {/* Table header */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscribed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="bg-white divide-y divide-gray-200 dark:text-black">
                    {/* Render the searched user */}
                    <tr key={searchedUser._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{"false"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{searchedUser.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{searchedUser.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className={`${searchedUser.isBlocked ? 'bg-red-500' : 'bg-green-500'
                            } text-white px-4 py-2 rounded`}
                          onClick={() => handleBlockUnblock(searchedUser._id)}
                        >
                          {searchedUser.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            ) : (
              <section className="container px-4 mx-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  {/* Table header */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscribed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="bg-white divide-y divide-gray-200 dark:text-black">
                    {/* Render all users */}
                    {userData.map((row) => (
                      <tr key={row._id}>
                        <td className="px-6 py-4 whitespace-nowrap"></td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className={`${row.isBlocked ? 'bg-red-500' : 'bg-green-500'
                              } text-white px-4 py-2 rounded`}
                            onClick={() => handleBlockUnblock(row._id)}
                          >
                            {row.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* Pagination Section */}
            <div className="flex items-center justify-center mt-6 mr-2 ">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
                onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {Math.ceil(userData.length / pageSize)}
              </span>
              <button
                className="px-4  py-2 bg-blue-500 text-white rounded-md ml-2 cursor-pointer"
                onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(userData.length / pageSize)))}
                disabled={currentPage === Math.ceil(userData.length / pageSize)}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
