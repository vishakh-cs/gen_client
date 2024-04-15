// components/AlertBox/page.tsx
"use client"
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useStore from '@/Stores/store';
import { useSession } from 'next-auth/react';
import Loaders from '../Loaders/page';

interface AlertBoxProps {}

const AlertBox: React.FC<AlertBoxProps> = () => {

  const imgPaths = [
    "/Assets/workspace1.jpg",
    "/Assets/workspace2.jpg",
    "/Assets/workspace3.jpg",
    "/Assets/workspace4.jpg",
    "/Assets/briefcase_439354.png",
    "/Assets/workspace5.webp",
    "/Assets/workspace6.png",
    "/Assets/workspace7.webp",
    "/Assets/workspace8.png",
    "/Assets/workspace9.webp",
    "/Assets/workspace10.png",
    "/Assets/workspace11.png",
    "/Assets/workspace12.png",
    "/Assets/workspace13.jpg",
    "/Assets/workspace14.png",
  ];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { status, data: session } = useSession();


  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

 
  const handleOpenModal = () => {
    if (selectedImageIndex !== null) {
      setIsModalOpen(true);
      setErrorMessage(null);
    } else {
      setErrorMessage('Please select a logo before creating a workspace.');
    }
  };

  const handleCreateWorkspace = async () => {
  if (selectedImageIndex !== null) {
    const workspaceName = inputRef.current ?.value??'';

    try {

      setLoading(true); 
      setErrorMessage(null);

      if (status === 'authenticated' && session?.user) {
        setLoading(true); 
        // If the user is authenticated, use the session information
        const response = await axios.post(`${baseUrl}/new-workspace`, {
          imageIndex: selectedImageIndex,
          workspaceName: workspaceName,
          user: session.user, 
        });
        console.log("Server response:", response.data);
        const userid = response.data.userId

        const workspaceId = response.data.workspace.workspaceId;
        console.log("my workspace",workspaceId);

        useStore.getState().setWorkspaceName(workspaceName);
        
        router.replace(`/home/${userid}/${workspaceId}`);
        setLoading(false);
        setIsModalOpen(false);
      } else {
        setLoading(true); 
        // If not authenticated, use the token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
        const response = await axios.post(`${baseUrl}/new-workspace`, {
          imageIndex: selectedImageIndex,
          workspaceName: workspaceName,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Server response:", response.data);
        const userid = response.data.userId
        const workspaceId = response.data.workspace.workspaceId;
        console.log("my workspace",workspaceId);

        useStore.getState().setWorkspaceName(workspaceName);

        router.replace(`/home/${userid}/${workspaceId}`);
        setLoading(false); 
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating workspace:', error);
    } finally {
      setLoading(false);
    }
  }
};

if(loading){
  return <Loaders />
}


  return (
    <div className="flex items-center justify-center h-full">
      <div className="box-container flex flex-col max-w-2xl gap-2 p-6 rounded-md shadow-md bg-white dark:bg-gray-900 dark:text-gray-100">
      {loading && <Loaders />}
        <h2 className="text-xl font-semibold leading-tight">Welcome to Generative</h2>
        <p className="flex dark:text-violet-400">
          Transform your collaborative efforts with our dynamic workspace, providing a seamless environment for real-time collaboration and efficient documentation.
        </p>
        <h4 className='opacity-55 font-sans'> By default, your Workspace will be private and only accessible by you.</h4>
        <h2 className='font-sans'>Choose a Workspace Logo</h2>
        {errorMessage && (
          <p className="text-red-500 mt-2">{errorMessage}</p>
        )}
        <div className="flex flex-wrap justify-center gap-2 mt-6 sm:flex-row">
          {imgPaths.map((imgPath, index) => (
            <div key={index} className={`mb-2 cursor-pointer ${selectedImageIndex === index ? 'border-4 border-violet-600' : ''}`} onClick={() => { setSelectedImageIndex(index); setErrorMessage(null); }}>
              <div
                key={index}
                className="mb-2"
                style={{ width: '100px', height: '100px', position: 'relative' }}
              >
                <Image
                  src={imgPath}
                  alt={`Workspace ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleOpenModal}
          className="px-6 py-2 rounded-sm shadow-sm bg-violet-400 text-white-900 dark:bg-violet-400 mt-4 transition-transform transform hover:scale-105"
        >
          Create Workspace
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity " aria-hidden="true"></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen " aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white  px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Create Workspace
                  </h3>
                  {selectedImageIndex !== null && (
                    <span className="ml-2">
                      <Image
                        src={imgPaths[selectedImageIndex]}
                        alt={`Selected Workspace`}
                        width={35}
                        height={20}
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <input
                    ref={inputRef}
                    type='text'
                    name='workspaceName'
                    className="shadow-sm dark:text-black text-black block w-3/4 ml-5 h-10 sm:text-sm border border-gray-900 rounded-md px-2 transition-all duration-300 "
                    placeholder="Workspace Name"
                  />
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-400 text-base font-medium text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCreateWorkspace}
                  >
                    Create workspace
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
       {/* Loading Screen */}
       {loading && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="spinner-border text-violet-500" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertBox;