"use client"
import React, { useEffect, useState } from 'react'
import useStore from '@/Stores/store'
import LogoutModal from '@/components/Sidebar/LogoutModal';
import ProtectedRoutes from '@/components/ProtectedRoutes/page';
import BannerImage from '@/components/workspaceBanner/BannerImage';
import ProfileSlider from '@/components/Sidebar/ProfileSlider/page';
import { RoomProvider } from '@/liveblocks.config';
import { ClientSideSuspense } from '@liveblocks/react';
import LandingWorkspace from '@/components/LandingWorkspace/page';
import { useRouter } from 'next/navigation';
import Loaders from '@/components/Loaders/page';


interface WorkspaceIdProps {
  params: {
    workspaceid: string;
  };
}

const WorkspaceId: React.FC<WorkspaceIdProps> = ({ params }) => {

  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const isLogoutClicked = useStore((state) => state.isLogoutClicked);
  const resetLogoutClicked = useStore((state) => state.resetLogoutClicked);
  const [userData, setUserData] = useState(null);
  const userEmail = localStorage.getItem('userEmail');
  const [loading, setLoading] = useState(true);

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
      }
    };
  
    fetchUserData();
  }, [params.workspaceid , userEmail, router,baseUrl]);

  if (loading) {
    return <Loaders />
  }


  if (!userData) {
    return null; // Or a loading indicator
 }

  return (
    <ProtectedRoutes >
      <div className='dark:bg-workspaceColor min-h-screen'>
        {isLogoutClicked ? (
          <LogoutModal onClose={() => resetLogoutClicked()} />
        ) : (
          <>
            <div className='opacity-60'>workspaceid{params.workspaceid}
             <LandingWorkspace />
             {/* <CollabAlertBox /> */}
            </div>
           

          </>
        )}
      </div>
    </ProtectedRoutes>
  );
}
export default WorkspaceId;