import useStore from '@/Stores/store'
import Image from 'next/image'
import React from 'react'
import ProfileIconDropDown from './ProfileIconDropdown'

interface ProfileIconProps {
    workspaceId: string;
    pageId: string;
   }

   const ProfileIcon: React.FC<ProfileIconProps> = ({ workspaceId, pageId }) => {
    const profileImage = useStore(state => state.profileImage)
    const userEmail = useStore(state => state.userEmail)
    const user_data=useStore(state=>state.user_data)
    // console.log("use_data",use_data);

    return (
        <div>
            <ProfileIconDropDown workspaceId={workspaceId} pageId={pageId} user_data={user_data}/>
         
        </div>
    )
}

export default ProfileIcon;
