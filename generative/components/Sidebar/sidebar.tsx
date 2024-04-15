//Sidebar/sidebar.tsx
// @ts-nocheck
"use client"
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState, useContext, createContext, ReactNode, MouseEvent } from 'react';
import { twMerge } from 'tailwind-merge';
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { HiOutlineLogout } from "react-icons/hi";
import useStore from '@/Stores/store';
import { IoMdAdd } from "react-icons/io";
import PageNameModal from './PageNameModal';
import { CiFileOn } from "react-icons/ci";
import ProfileSlider from './ProfileSlider/page';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { MdOutlineSettingsSuggest } from "react-icons/md";
import './sidebar.css';
import { SettingsSlider } from './SettingsSlider/page';
import { FaRegTrashAlt } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import dynamic from 'next/dynamic';
import { FaArrowLeftLong } from "react-icons/fa6";
import { io, Socket } from 'socket.io-client';
import { Spinner } from '../Loaders/Spinner';


const DynamicTrashBar = dynamic(() => import('./TrashBar/page'), { ssr: false });

interface SidebarContextProps {
  expanded: boolean;
}

interface SidebarProps {
  children: ReactNode;
  params: any;
}

interface Workspace {
  pageIds: any;
  id: string;
  
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export default function Sidebar({ children, params }: SidebarProps) {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [expanded, setExpanded] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [collabWorkspaces, setCollabWorkspaces] = useState<any[]>([]);
  const [pages, setPages] = useState<string[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [Page_id, setPage_id] = useState<string[] | null>(null!);
  const [PageData, setPageData] = useState<string[] | null>(null!);
  const [selectedPage, setSelectedPage] = useState<null | string>(null);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [workspaceid, setWorkspaceId] = useState('');
  const [loading, setLoading] = useState(false);
  const setIsPageClick = useStore((state)=>state.setIsPageClick);

  const setIsLogoutClicked = useStore((state) => state.setLogoutClicked);
  const workspaceName = useStore((state) => state.workspaceName);
  const isPageRestored = useStore((state) => state.isPageRestored);
  const isWorkspaceNameChanged = useStore((state) => state.isWorkspaceNameChanged)

  const [isProfileChange, setIsProfileChange] = useState(false);

  console.log("collabWorkspaces,collaboratorWorkspaceLogo", collabWorkspaces);

  const socket = io(`${baseUrl}`);

  const router = useRouter();

  const toggleSidebar = () => {
    setExpanded((curr) => !curr);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const addNewPage = () => {
    openModal();
  };



  // fetch user and workspace data
  const fetchData = async () => {
    try {
      if (!params.workspaceid) {
        return;
      }

      const response = await axios.post(`${baseUrl}/sidebar_data`, {
        workspaceId: params.workspaceid,
      });

      const { data, workspaces, pages: pageIds, pageNames, pageId, collaboratorWorkspace: collabWs } = response.data;
      console.log("workspaces1234567", workspaces)
      const workspacePageIds = workspaces.map((workspace: Workspace) => workspace.pageIds).flat(); // Extract all page IDs and flatten the array
      setPage_id(workspacePageIds);
      setPages(pageNames)
      setWorkspaceId(params.workspaceid)
      setUserData(data);
      setWorkspaces(workspaces);
      setCollabWorkspaces(collabWs);
      const selectedWorkspace = workspaces.find((w: { id: any; }) => w.id === params.workspaceid);

    } catch (error: any) {
      console.error('Error fetching user data:', error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.workspaceId, isPageRestored, isWorkspaceNameChanged, isProfileChange]);

  const userId = userData ? userData.id : null;
  localStorage.setItem('userId', userId);


  const createWorkspace = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
   
    try {
      router.push(`/home/CreateWorkspace?email=${userData.email}`);
    } catch (error: any) {
      console.error('Error creating new workspace:', error.message);
    }
  };
  const handleLogout = () => {
    setIsLogoutClicked(true);
  };

  // page click
  const handleProfileClick = (pageId: string, workspaceId: string) => {
    console.log("pageIdpageId", pageId)
    if (Page_id) {
      setLoading(true);
      setIsPageClick(true);
      router.replace(`/home/${userData.id}/${workspaceId}/${pageId}`);
      setLoading(false)
      setIsPageClick(false);
      setSelectedPage(pageId);
    } else {
      console.error('Invalid pageId:', pageId);
    }
  };


  // handle workspace click

  const handleWorkspaceClick = (workspaceId: string) => {
    if (!workspaceId) {
      console.error('Invalid workspace ID:', workspaceId);
      return;
    }
  
    // Check if the clicked workspace ID exists in collabWorkspaces
    const collabWorkspace = collabWorkspaces;
    if (collabWorkspace && collabWorkspace.id === workspaceId) {
      // Handle collaboration workspace click
      if (collabWorkspace.pages && collabWorkspace.pages.length > 0) {
        router.replace(`/home/${userData.id}/${workspaceId}/${collabWorkspace.pages[0]._id}`);
        setSelectedPage(collabWorkspace.pages[0]._id);
      } else {
        router.replace(`/home/${userData.id}/${workspaceId}`);
        setSelectedPage(null);
      }
    } else {
      // Handle local workspace click
      const workspace = workspaces.find(w => w.id === workspaceId);
      if (!workspace) {
        console.error('Workspace not found:', workspaceId);
        return;
      }
  
      if (workspace.pageIds.length > 0) {
        router.replace(`/home/${userData.id}/${workspaceId}/${workspace.pageIds[0]}`);
        setSelectedPage(workspace.pageIds[0]);
      } else {
        router.replace(`/home/${userData.id}/${workspaceId}`);
        setSelectedPage(null);
      }
    }
  };
  
  // page click
  const handleCollabClick = (pageId: string) => {
    if (Page_id) {
      router.replace(`/home/${userData.id}/${params.workspaceid}/${pageId}`);
      setSelectedPage(pageId);
    } else {
      console.error('Invalid pageId:', pageId);
    }
  };

  const handleModalSubmit = async (pageName: string) => {
    try {
      const newPage = pageName.trim() || `Page ${pages.length + 1}`;
      setPages((prevPages = []) => [...prevPages, newPage]);

      console.log(`Added a new page: ${newPage}`);

      const response = await axios.post(`${baseUrl}/add_page`, {
        workspaceId: params.workspaceid,
        pageName: newPage,
        pageContent: '',
      });

      const { pageId } = response.data;

      // Update Page_id state with the new pageId
      setPage_id((prevPageIds) => [...(prevPageIds || []), pageId]);

      toast.success(`Page "${newPage}" created successfully!`);
      fetchData();

      closeModal();
    } catch (error) {
      console.error('Error updating workspace with new page:', (error as Error).message);
      toast.error('Error creating new page');
    }
  };

  const moveToTrash = async (pageId: string, pageName: string) => {
    try {
      const response = await axios.post(`${baseUrl}/add_to_trash`, {
        selectedPage: pageId,
      });

      toast.success('Page moved to trash successfully.');
      fetchData();
      
      if (pages && pages.length > 0) {
        // Remove the trashed page from the pages array
        setPages(prevPages => prevPages.filter(p => p !== pageName));

        // Check if the trashed page was the last one
        if (pages.length === 1) {
          router.replace(`/home/${userData.id}/${params.workspaceid}`);
          setSelectedPage(null);
          return;
        }

        // Switch to the next or previous page
        const currentIndex = pages.findIndex(p => p === pageName);
        if (currentIndex !== -1) {
          const nextIndex = currentIndex + 1;
          const prevIndex = currentIndex - 1;
          if (nextIndex < pages.length) {
            router.replace(`/home/${userData.id}/${params.workspaceid}/${Page_id[nextIndex]}`);
            setSelectedPage(Page_id[nextIndex]);
          } else if (prevIndex >= 0) {
            router.replace(`/home/${userData.id}/${params.workspaceid}/${Page_id[prevIndex]}`);
            setSelectedPage(Page_id[prevIndex]);
          }
        }
      } else {
        // Handle the case where pages array is empty
        router.replace(`/home/${userData.id}/${params.workspaceid}`);
        setSelectedPage(null);
      }
    } catch (error) {
      console.error('Error moving page to trash:', error);
      toast.error('Failed to move page to trash.');
    }
  };


  useEffect(() => {
    socket.on('addpage', () => {
      fetchData();
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  
    return () => {
      socket.off('addpage');
      socket.off('disconnect');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    socket.on('collabRemoved', () => {
      fetchData();
      toast.success('You have been removed from the workspace.');
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  
    return () => {
      socket.off('collabRemoved');
      socket.off('disconnect');
    
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on('CollabEmailSuccess', () => {
      fetchData();
      toast.success('You have been Added to an Workspace.');
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  
    return () => {
      socket.off('collabRemoved');
      socket.off('disconnect');
    
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  const expandedSidebarClass = 'w-32';
  const collapsedSidebarClass = 'w-0';
  const transitionClass = 'transition-all duration-300 ease-in-out';
  const buttonBaseClass = 'border-t flex p-3 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700';
  const selectedPageClass = 'bg-indigo-200 text-indigo-800 dark:bg-gray-700 dark:text-white';


  // leave workspace 

  const handleLeaveCollab = async () => {
    try {
      if (!collabWorkspaces || !collabWorkspaces.id) {
        console.error('Collaborator workspace ID not found');
        return;
      }

      const response = await axios.post(`${baseUrl}/leave_collaboration`, {
        workspaceId: collabWorkspaces.id,
        userId: userData.id
      });

      toast.success('Left collaboration successfully');
      fetchData();
      console.log('Left collaboration successfully');

    } catch (error) {
      console.error('Error leaving collaboration:', error);
      toast.error('Failed to leave collaboration.');
    }
  };

  if(loading){
    return <Spinner />
  }

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


  return (
    <aside className={twMerge('h-screen')}>
      <nav className={twMerge('h-full flex flex-col bg-white dark:bg-sidebar border-r shadow-sm')}>
        <div className={twMerge('p-4 pb-2 flex justify-between items-center')}>
          <Image
            className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
            src="/Assets/White logo - no background.png"
            alt="logo"
            width={400}
            height={500}
          />
          <button
            onClick={toggleSidebar}
            className={twMerge('p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600')}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        {expanded && (
          <>
            <button
              type='button'
              onClick={createWorkspace}
              className={twMerge('border-t flex p-3 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700')}
            >
              <span className={twMerge('text-gray-600 dark:text-gray-300')}>Create New Workspace +</span>
            </button>

            <DynamicTrashBar workspaceId={workspaceid} />


            {workspaces.map((workspace, index) => (
              <div key={workspace.id}>
                {/* Render workspace button */}
                <button
                  onClick={() => handleWorkspaceClick(workspace.id)}
                  className={twMerge('border-t flex p-3 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700')}
                >
                  {workspace.logo && (
                    <Image
                      src={imgPaths[workspace.logo]}
                      alt={`Workspace Logo ${index}`}
                      width={20}
                      height={20}
                      loading="lazy"
                    />
                  )}
                  {/* Workspace name */}
                  <span className={twMerge('flex justify-between items-center w-full')}>
                    <span className={twMerge('text-gray-600 dark:text-gray-300 ml-4')}>
                      {workspace.name}
                    </span>
                    {/* Workspace actions: settings and add new page */}
                    <span className='flex justify-between'>
                      <SettingsSlider workspaceId={workspace.id} workspaceName={workspace.name}
                        workspaceLogoIndex={workspace.logo}
                        workspaceType={workspace.type} />

                      <IoMdAdd
                        onClick={addNewPage}
                        size={16}
                        className='ml-4 mt-1' />
                    </span>
                  </span>
                </button>

                {/* Render pages for this workspace */}
                {workspace.pageNames.map((pageName, pageIndex) => (
                  <button
                    key={pageIndex}
                    className={twMerge(`
                     ${buttonBaseClass}
                     ${transitionClass}
                     ${selectedPage === workspace.pageIds[pageIndex] ? selectedPageClass : ''}
                    `)}
                    onClick={() => handleProfileClick(workspace.pageIds[pageIndex], workspace.id)}
                  >
                    <CiFileOn size={20} className="ml-3" />
                    <span className={twMerge('text-gray-600 dark:text-gray-300 ml-7')}>
                      {pageName}
                    </span>
                    {/* Include trash functionality for pages */}
                    <FaRegTrashAlt size={20} className="opacity-60 ml-auto" onClick={() => moveToTrash(workspace.pageIds[pageIndex], pageName)} />
                  </button>
                ))}
              </div>
            ))}

            <div className="sidebar-content overflow-y-auto max-h-96">
              {loading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="spinner-border text-indigo-500"></div>
                </div>
              ) : (
                <>
                  {/* Render collaborative workspace if available */}
                  {collabWorkspaces?.pages?.length > 0 && (
                    <div className="collaborator-pages">
                      {/* Collab workspace header */}
                      <h3 className="flex justify-center text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text mt-4 ml-4">Collaborator Workspace</h3>
                      {/* Collab workspace details */}
                      <div className="ml-4 px-1 mb-2 flex items-center">
                        {collabWorkspaces.collablogo && (
                          <Image
                            src={imgPaths[collabWorkspaces.collablogo]}
                            alt="Collaborator Workspace Logo"
                            width={20}
                            height={20}
                            className="mr-2"
                          />
                        )}
                        <button
                          className="font-sans"
                          // onClick={() => handleWorkspaceClick(collabWorkspaces.id)}
                        >
                          {collabWorkspaces.name}
                        </button>
                      </div>
                      {/* Collab workspace pages */}
                      {collabWorkspaces.pages.map((collabPage, index) => (
                        <button
                          key={collabPage._id}
                          className={twMerge(`
                          ${buttonBaseClass}
                          ${transitionClass}
                          ${selectedPage === collabPage._id ? selectedPageClass : ''}
                        `)}
                          onClick={() => handleCollabClick(collabPage._id)}
                        >
                          <CiFileOn size={20} className="ml-3" />
                          <span className={twMerge('text-gray-600 dark:text-gray-300 ml-7')}>
                            {collabPage.PageName}
                          </span>
                          {/* Include trash functionality for pages */}
                          {/* <FaRegTrashAlt size={20} className="opacity-60 ml-auto" onClick={() => moveToTrash(collabPage.PageName)} /> */}
                        </button>
                      ))}

                      {/* Leave collaboration button */}
                      <button
                        onClick={handleLeaveCollab}
                        className="flex text-transparent  gap-3 text-center justify-center bg-clip-text bg-gradient-to-br from-blue-500 to-purple-500 font-semibold text-base mt-6 p-8 ml-6 border-none focus:outline-none">
                        <span>Leave Collaboration</span>
                        <FaArrowLeftLong className='mt-1 opacity-55' size={18} color='white' />
                      </button>
                    </div>
                  )}

                  <div className="h-20 sticky inset-x-0 bottom-0  bg-gradient-to-t from-sidebar to-transparent"></div>
                </>
              )}
            </div>

            {isModalOpen && (
              <PageNameModal
                onClose={closeModal}
                onSubmit={handleModalSubmit}
              />
            )}
          </>
        )}

        <SidebarContext.Provider value={{ expanded }}>
          <ul className={twMerge('flex-1 px-3 dark:text-white')}>{children}</ul>
        </SidebarContext.Provider>

        <div className={twMerge('border-t flex p-3')}>
          <ProfileSlider avatarData={userData} setIsProfileChange={setIsProfileChange}
            isProfileChange={isProfileChange} />

          <div
            className={twMerge(`
               flex justify-between items-center
               overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
           `)}
          >
            <div className={twMerge('leading-4')}>
              <h4 className={twMerge('font-semibold')}>{userData?.username}</h4>
              <span className={twMerge('text-xs text-gray-600 dark:text-gray-300')}>{userData?.email}</span>
            </div>
            <HiOutlineLogout
              className="hover:cursor-pointer"
              size={20}
              title='Logout'
              onClick={handleLogout}
            />
          </div>
        </div>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active: boolean;
  alert: boolean;
}

export function SidebarItem({ icon, text, active, alert }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext!) || { expanded: false };

  return (
    <li
      className={twMerge(`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800 dark:bg-gray-700 dark:text-white"
          : "hover:bg-indigo-50 text-gray-600 dark:hover:bg-gray-600 dark:text-gray-300"
        }
    `)}
    >
      {icon}
      <span
        className={twMerge(`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`)}
      >
        {text}
      </span>
      {alert && (
        <div
          className={twMerge(`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`)}
        />
      )}

      {!expanded && (
        <div
          className={twMerge(`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `)}
        >
          {text}
        </div>
      )}
    </li>
  );
}