"use client"
import React, { useEffect, useState, useMemo } from 'react';
import useStore from '@/Stores/store';
import LogoutModal from '@/components/Sidebar/LogoutModal';
import BannerImagePreview from '@/components/Publish/BannerImagePreview';
import { EditorComponentPreview } from '@/components/Publish/EditorComponent';
import axios from 'axios';
import { Spinner } from '@/components/Loaders/Spinner';
import { RoomProvider } from '@/liveblocks.config';
import { ClientSideSuspense } from '@liveblocks/react';
import { io, Socket } from 'socket.io-client';
import { FiSun, FiMoon } from 'react-icons/fi';

// Define the shape of the workspace object
interface Workspace {
 isPublished: any;
 name: string;
 pageCount: number;
 pages: Page[];
}

// Define the shape of a page object
interface Page {
 _id: string;
 PageName: string;
}

// Define the props for the WorkspaceId component
interface WorkspaceIdProps {
 params: {
    workspaceid: string;
 };
}

const WorkspaceId: React.FC<WorkspaceIdProps> = ({ params }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
 const [workspace, setWorkspace] = useState<Workspace>({ name: '', pageCount: 0, pages: [] , isPublished:false });
 const [pages, setPages] = useState<Page[]>([]);
 const [currentPageIndex, setCurrentPageIndex] = useState(0);
 const [currentpageId, setCurrentPageId] = useState('');
 const [isLoading, setIsLoading] = useState(true);
 const isLogoutClicked = useStore((state) => state.isLogoutClicked);
 const resetLogoutClicked = useStore((state) => state.resetLogoutClicked);
 const[trigger,setTrigger]=useState(false)
 const [darkMode, setDarkMode] = useState(false);


 console.log("pages",pages);
 console.log("workspace",workspace);
 const socket = io(`${baseUrl}`);

 const baseurl = process.env.NEXT_PUBLIC_BASE_URL
 console.log("baseurl",baseurl);

 useEffect(() => {
  socket.on('unpublished', () => {
    setTrigger(true)
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from the server');
  });

  return () => {
    socket.off('unpublished');
    socket.off('disconnect');
    setTrigger(false)
  };
}, [socket]);

 useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get_publish_data?workspaceid=${params.workspaceid}`);
        if (response.status === 200) {
          const data = response.data;
          console.log("data", data);
          setWorkspace(data.workspace);

          setPages(data.workspace.pages);
          setCurrentPageId(data.workspace.pages[0]._id);
          setIsLoading(false);
        } else {
          console.error('Failed to fetch workspace data');
        }
      } catch (error) {
        console.error('Error fetching workspace data:', error);
      }
    };

    fetchWorkspaceData();
 }, [baseUrl, params.workspaceid, trigger]); 

 const nextPage = async () => {
  if (currentPageIndex < pages.length - 1) {
    setIsLoading(true); 
    setCurrentPageIndex(currentPageIndex + 1);
    setCurrentPageId(pages[currentPageIndex + 1]._id);
    try {
      // Fetch content of the next page
      const response = await axios.get(`${baseUrl}/get_publish_data?pageid=${pages[currentPageIndex + 1]._id}`);
      if (response.status === 200) {
        // If data is fetched successfully, update state and set loading to false
        setIsLoading(false);
      } else {
        console.error('Failed to fetch page content');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching page content:', error);
      setIsLoading(false); 
    }
  }
};

 const prevPage = async () => {
    if (currentPageIndex > 0) {
      setIsLoading(true);
      setCurrentPageIndex(currentPageIndex - 1);
      setCurrentPageId(pages[currentPageIndex - 1]._id);
      try {
        // Fetch content of the previous page
        const response = await axios.get(`${baseUrl}/get_page_content?pageid=${pages[currentPageIndex - 1]._id}`);
        if (response.status === 200) {

        } else {
          console.error('Failed to fetch page content');
        }
      } catch (error) {
        console.error('Error fetching page content:', error);
      } finally {
        setIsLoading(false);
      }
    }
 };

 // Memoize the currentPage value
 const currentPage = useMemo(() => pages[currentPageIndex], [pages, currentPageIndex]);

 if (!workspace.isPublished) {
  return (
    <div className='flex justify-center items-center h-screen'>
      <h1>404 Page Not Found</h1>
    </div>
  );
}

 if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spinner />
      </div>
    );
 }
 const toggleDarkMode = () => {
  setDarkMode(prevMode => !prevMode);
};

 return (
  <div className={`min-h-screen ${darkMode ? 'bg-workspaceColor' : 'bg-white'}`}>
    {isLogoutClicked ? (
      <LogoutModal onClose={() => resetLogoutClicked()} />
    ) : (
      <>
        <div className='flex justify-between items-center py-2 px-4 sticky top-0 z-10'>
          <div>
            <span className={`flex items-center ml-5 text-lg font-semibold ${darkMode ? 'text-white' : 'text-black/50'}`}>
              Workspace: <span className={`${darkMode ? 'text-white' : 'text-black'}`}>{workspace.name}</span>
            </span>
          </div>
          <div className={`flex items-center gap-4 mr-4 ${darkMode ? 'text-slate-400' : 'text-black'}`}>
            <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>
              {workspace.pageCount}
            </span>
          </div>
          <button className="text-xl" onClick={toggleDarkMode}>
            {darkMode ? <FiSun  /> : <FiMoon color='black' />}
          </button>
        </div>

        <BannerImagePreview workspaceId={params.workspaceid} pageId={currentpageId} />

        {currentPage && (
          <div className={`ml-10 mt-2 text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-black'}`}>
            {currentPage.PageName}
          </div>
        )}
          <RoomProvider id="my-room" initialPresence={{}}>
            <ClientSideSuspense fallback="Loading…">
              {() => <EditorComponentPreview darkMode={darkMode} pageId={currentpageId} />}
            </ClientSideSuspense>
          </RoomProvider>
        <div className="flex justify-center mt-4 px-4">
          <button className={`bg-transparent hover:bg-transparent font-semibold py-2 px-4 rounded ${darkMode ? 'text-white' : 'text-black'}`} onClick={prevPage}>Previous Page</button>
          <span className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-slate-400'} mt-1`}>
            {currentPageIndex + 1} | {pages.length}
          </span>
          <button className={`bg-transparent hover:bg-transparent font-semibold py-2 px-4 rounded ${darkMode ? 'text-white' : 'text-black'}`} onClick={nextPage}>Next Page</button>
        </div>
      </>
    )}
  </div>
);
}

export default WorkspaceId;
