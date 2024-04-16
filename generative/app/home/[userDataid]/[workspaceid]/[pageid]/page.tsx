"use client"
import React, { useEffect, useState } from 'react'
import useStore from '@/Stores/store'
import LogoutModal from '@/components/Sidebar/LogoutModal';
import ProtectedRoutes from '@/components/ProtectedRoutes/page';
import BannerImage from '@/components/workspaceBanner/BannerImage';
import ProfileSlider from '@/components/Sidebar/ProfileSlider/page';
import { RoomProvider } from '@/liveblocks.config';
import  { Editor } from '@/components/CollaborativeEditor/Editor';
import { ClientSideSuspense } from '@liveblocks/react';
import ProfileIcon from '@/components/ProfileIcon/page';
import Publish from '@/components/Publish/page';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/Loaders/Spinner';
import PreviewSkelton from '@/components/Loaders/PreviewSkleton';

interface WorkspaceIdProps {
  params: {
     userDataid: string;
     workspaceid: string;
     pageid: string;
  };
 }
 

 const WorkspaceId: React.FC<WorkspaceIdProps> = ({ params }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const router = useRouter();
  const isLogoutClicked = useStore((state) => state.isLogoutClicked);
  const resetLogoutClicked = useStore((state) => state.resetLogoutClicked);

  const [userData, setUserData] = useState<string | null>(null);
  const userEmail = typeof localStorage !== 'undefined' ? localStorage.getItem('userEmail') : null;
  const [loading, setLoading] = useState(true);
  const userID = useStore(state => state.userID);
  const isPageClick = useStore(state=>state.isPageClick);

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('USER_ID', params.userDataid);
  }
  

  console.log("isPageClick",isPageClick);
  console.log("userID12",userID);

  useEffect(()=>{
    if(params.userDataid !==userID){
      return  router.push('/404')
    }
    setLoading(false)
  },[params.userDataid, router, userID])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${baseUrl}/protected_workspace/${params.workspaceid}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data.email);
          if (data.email !== userEmail){
            router.push('/404')
          }
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
        useStore.setState({ isPageClick: false });
      }
    };
  
    fetchUserData();
  }, [params.workspaceid, userEmail, router, baseUrl ]);

   useEffect(() => {
    if (isPageClick) {
      const timer = setTimeout(() => {
        useStore.setState({ isPageClick: false });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isPageClick]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  

  if(isPageClick){
    return <div className=' mt-5 py-3'>
      <PreviewSkelton />
      </div>
  }

  return (
    <ProtectedRoutes>
      <div className='dark:bg-workspaceColor min-h-screen'>
        {isLogoutClicked ? (
          <LogoutModal onClose={() => resetLogoutClicked()} />
        ) : (
          <>
            <div className='flex justify-between items-center text-gray-950 dark:text-gray-100 py-2 px-4 sticky top-0 z-10'>
              <div>
                <span className='text-sm text-gray-950 dark:text-gray-100'>workspaceid{params.workspaceid}/{params.pageid}</span>
              </div>
              <div className='flex items-center gap-4 mr-4'>

                <ProfileIcon workspaceId={params.workspaceid} pageId={params.pageid} />
                <Publish workspaceid={params.workspaceid} pageId={params.pageid} />
              </div>
            </div>
            <BannerImage workspaceId={params.workspaceid} pageId={params.pageid} />
           <div className='mt-4 py-4'>
            <RoomProvider id="my-room" initialPresence={{}}>
              <ClientSideSuspense fallback="Loading…">
                {() => <Editor pageId={params.pageid} />}
              </ClientSideSuspense>
            </RoomProvider>
            </div>
          </>
        )}
      </div>
    </ProtectedRoutes>
  );
}
export default WorkspaceId;