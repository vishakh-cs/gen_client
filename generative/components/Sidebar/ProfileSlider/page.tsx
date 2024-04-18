import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { twMerge } from 'tailwind-merge';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { RiLoader4Line, RiCheckLine, RiDeleteBinLine, RiPencilLine, RiMoonLine, RiSunLine } from 'react-icons/ri';
import toast, { Toaster } from 'react-hot-toast';
import { IoIosArrowDropdown } from "react-icons/io";
import { RiBriefcaseFill } from "react-icons/ri";
import { Switch } from "@/components/ui/switch"
import { useEdgeStore } from '@/lib/edgestore';
import Image from 'next/image';
import useStore from '@/Stores/store';
import { useSession } from 'next-auth/react';

interface ProfileData {
  profileImageUrl: string | null;
  userId: string;
  profileImage?: string;
  username?: string;
  email?: string;
}
interface ProfileSliderProps {
  avatarData: ProfileData;
  setIsProfileChange: React.Dispatch<React.SetStateAction<boolean>>;
  isProfileChange: boolean;
}

export default function ProfileSlider({ avatarData, setIsProfileChange, isProfileChange }: ProfileSliderProps) {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [avatarImage, setAvatarImage] = useState<string | undefined>(avatarData?.profileImage);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string | undefined>(avatarData?.username);
  const { status, data: session } = useSession();
  const [avatarDataState, setAvatarDataState] = useState<ProfileData>(avatarData);
  const [isLoadingLocalStorage, setIsLoadingLocalStorage] = useState<boolean>(true);

  const setDarkMode = useStore((state) => state.setDarkMode)

  const darkMode = useStore(state => state.darkMode);

  const setProfileImage = useStore((state) => state.setProfileImage);

  const audioRef = useRef<HTMLAudioElement>(null);
  const { edgestore } = useEdgeStore();

  // useEffect(() => {
  //   const savedDarkMode = localStorage.getItem('darkmode');
  //   if (savedDarkMode) {
  //     setDarkMode(JSON.parse(savedDarkMode));
  //     setIsLoadingLocalStorage(false);
  //   }
  // }, [setDarkMode]);

  const toggleDarkMode = () => {
    const newDarkModeState = !darkMode;
    setDarkMode(newDarkModeState);
    localStorage.setItem('darkmode', JSON.stringify(newDarkModeState));
  };

  console.log("darkmode", darkMode);

  useEffect(() => {

    fetchProfileImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfileImage = async () => {
    setLoading(true);

    try {
      const response = await axios.get<{ profileImageUrl: string }>(`${baseUrl}/profileImage/${avatarData?.userId}`);
      const { profileImageUrl } = response.data;

      setAvatarImage(profileImageUrl);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile image:', error);
      setLoading(false);
    }
  };


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);

      try {
        // Upload image to edge store
        const uploadResponse = await edgestore.publicFiles.upload({
          file: file,
          options: {

          },
          onProgressChange: (progress) => {
            console.log(progress);
          },
        });
        toast.success('Image uploaded successfully');

        if (audioRef.current) {
          audioRef.current.play();
        }

        // Get the uploaded image URL from the response
        const imageUrl = uploadResponse.url;
        setAvatarImage(imageUrl);

        // Save the image URL to the database
        const saveResponse = await axios.post(`${baseUrl}/setProfileImageUrl`, {
          profileImage: imageUrl,
          emailId: avatarData?.email
        });

        if (saveResponse.data.success) {
          setSuccess(true);
          setIsProfileChange(true)
          toast.success('Image uploaded successfully');
        } else {
          toast.error('Failed to save image URL in the database');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };


  const handleDeleteAllWorkspaces = () => {
    console.log('Deleting all workspaces...');
  };

  const handleEditUsername = () => {
    console.log('Editing username...');
    setIsEditingUsername(true);
  };

  const handleChangeUsername = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/changeUsername`, {
        newUsername: newUsername,
        emailId: avatarData.email
      });

      if (response.data.success) {
        setSuccess(true);
        setIsProfileChange(true);
        setIsEditingUsername(false);
        setProfileImage(avatarData.profileImage || '');
        setAvatarDataState(prevData => ({ ...prevData, username: newUsername }));
        toast.success('Username changed successfully');
        setTimeout(() => {
          setIsProfileChange(false);
        }, 2000);
      } else {
        toast.error('Failed to change username');
      }
    } catch (error) {
      console.error('Error changing username:', error);
      toast.error('Failed to change username. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger className='w-12'>
        <Avatar>
          <AvatarFallback
            className={twMerge(`
            rounded-full
            h-12
            bg-gray-200 dark:bg-gray-600
            text-gray-500 dark:text-gray-400
            flex items-center justify-center relative
          `)}
          >
            {loading && <RiLoader4Line className="absolute animate-spin text-white" />}
            {!loading && (
              <>
                <Image
                  src={avatarData?.profileImageUrl || session?.user?.image || ''}
                  alt="profile image"
                  width={48}
                  height={48}
                  className=" h-12 rounded-full"
                />
                {success && <RiCheckLine className="absolute bottom-0 right-0 text-green-500" />}
              </>

            )}
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent className='dark:bg-gray-950'>
        <SheetHeader>
          <h4 className={twMerge('font-semibold')}>Profile</h4>

          <div className={twMerge('box')}>
            <div className={twMerge('box-item')}>
              <div className={twMerge('flex justify-center')}>
                <Avatar className='w-32'>
                  {/* <AvatarImage src={avatarImage } /> */}
                  <AvatarFallback
                    className={twMerge(`
                     rounded-full
                     h-32
                    
                     text-gray-500 dark:text-gray-400
                     flex items-center justify-center relative
                    `)}
                  >
                    {loading && <RiLoader4Line className="absolute animate-spin text-white" />}
                    {loading ? (
                      <RiLoader4Line className="absolute animate-spin text-white" />
                    ) : avatarData?.profileImageUrl ? (

                      <Image
                        className='rounded-full'
                        src={avatarData?.profileImageUrl || session?.user?.image || ''}
                        alt="profile image"
                        width={90}
                        height={48}
                        quality={100}
                        unoptimized
                        style={{
                          height: '90px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                        }}
                      />
                    ) : (
                      <span>{avatarData?.username?.slice(0, 2).toUpperCase()}</span>
                    )}
                    {/* {success && <RiCheckLine className="absolute bottom-0 right-0 text-green-500" />} */}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className={twMerge('flex justify-center text-sm mt-2')}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="avatarUpload"
                  aria-label="Upload Profile Image"
                />
                {loading ? (
                  <RiLoader4Line className="animate-spin text-white mr-2" />
                ) : (
                  <button type='button' onClick={() => document.getElementById('avatarUpload')?.click()}>Upload Profile Image</button>
                )}
                {success && <RiCheckLine size={20} className="text-green-500" />}
                <audio ref={audioRef} src="/Assets/uploadsound (1).mp3" />
              </div>
            </div>

            <div className={twMerge('box-item')}>
              <div className={twMerge('flex items-center mt-4 border-gray-200 rounded-lg h-16 w-full border')}>
                <span className={twMerge('text-gray-500 dark:text-gray-400 overflow-hidden whitespace-nowrap ml-1')}>
                  {avatarDataState && avatarDataState.username && avatarDataState.username.length > 15 ? (
                    <span title={avatarDataState.username}>
                      {avatarDataState.username.slice(0, 15)}...
                    </span>
                  ) : (
                    avatarData?.username
                  )}

                </span>

                {isEditingUsername ? (
                  <>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      aria-label="New Username"
                      className={twMerge('border-b border-gray-500 dark:border-gray-400 bg-transparent text-white px-1 ml-1')}
                    />
                    <button onClick={handleChangeUsername} className={twMerge('text-blue-500 hover:underline')}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span className={twMerge('ml-auto mr-2')}>
                      <RiPencilLine
                        color='green'
                        size={20}
                        className={twMerge('cursor-pointer text-gray-500 dark:text-gray-400 hover:text-blue-500')}
                        onClick={handleEditUsername}
                      />
                    </span>
                  </>
                )}
              </div>

              <div className={twMerge('flex items-center mt-4')}>
                <span className={twMerge('text-gray-500 dark:text-gray-400 flex items-center mt-4 border-gray-200 rounded-lg h-16 w-full border px-4')}>
                  {avatarData?.email}
                </span>
              </div>

              <div className={twMerge('flex justify-between items-center mt-32')}>
                <div className={twMerge('flex items-center')}>
                  <span className={twMerge('text-gray-500 dark:text-gray-400 font-bold')}>
                    Theme
                  </span>
                  {darkMode ? (
                    <RiMoonLine
                      size={20}
                      className={twMerge('cursor-pointer text-yellow-500 hover:text-yellow-700 ml-4')}
                    />
                  ) : (
                    <RiSunLine
                      size={20}
                      className={twMerge('cursor-pointer text-yellow-500 hover:text-yellow-700 ml-4')}
                    />
                  )}
                </div>
                <Switch onClick={toggleDarkMode} checked={darkMode} />
              </div>

            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}