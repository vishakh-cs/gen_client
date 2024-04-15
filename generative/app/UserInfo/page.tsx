// @ts-nocheck
"use client"
import GoogleAuthButton from "@/components/GoogleAuthButton/page";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

export default function UserInfo() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const { status, data: session } = useSession();
    const router = useRouter();
  
    console.log('Session Status:', status);
    console.log('Session Data:', session);

    useEffect(() => {
      const setToken = async () => {
        if (status === 'authenticated' && session) {
          try {
            const response = await axios.post(`${baseUrl}/set-token`, {
              userId: session?.user?.id,
              email: session?.user?.email,
            });
  
            if (response.data.success) {

              const token = response.data.token;
	  
              // Set the token as a cookie
              document.cookie = `token=${token}; path=/;`;

              console.log('Token set successfully.');

              router.refresh();
              
            } else {
              console.error('Failed to set token:', response.data.message);
            }
          } catch (error:any) {
            console.error('Error setting token:', error.message);
          }
        }
      };
  
      setToken();
    }, [status, session, baseUrl, router]);
  
    if (status === 'loading') {
      return <p>Loading...</p>;
    }
  
    if (status === 'authenticated' && session) {


      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className='mb-4'>Userinfo</div>
          <Image src={session?.user?.image} alt="Profile Picture" height={150} width={150} /><br />
          <strong className="text-white">Name : {session?.user?.name} </strong><br />
          <strong className="text-white">email : {session?.user?.email} </strong><br />
        </div>
      );
    }
  
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>Welcome user.</h1>
        <GoogleAuthButton />
      </div>
    );
  }