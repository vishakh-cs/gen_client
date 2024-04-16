"use client"
import { Spinner } from '@/components/Loaders/Spinner';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface Message {
  message: string;
}

function ForgotPassword() {

  const router = useRouter()

  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [message, setMessage] = useState<Message | null>(null); 
  const [loading, setLoading] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      const response = await axios.post<{ success: boolean, message: string }>('http://localhost:8000/verifyforgototp', {
        email,
        otp,
        verificationCode:verificationCode.toString(),
      });
      setMessage({ message: response.data.message });
      if(response.data.success){
        const encodedEmail = btoa(email);
        router.replace(`/forgotPassword/resetpassword?email=${encodedEmail}`);
      }
    } catch (error :any) {
      console.error('Error verifying OTP:', error);
      if (error.response && error.response.status === 400) {
        setMessage({ message: 'Invalid OTP. Please enter a valid verification code.' });
      } else {
        setMessage({message :'An error occurred while verifying OTP.'});
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!email) {
      setMessage({message:'Please enter your email address.'});
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/forgotpassword', {
        email,
      });
      setMessage(response.data);
      setVerificationCode(response.data.verificationCode);
    } catch (error:any) {
      console.error('Error sending email:', error);
      if (error.response && error.response.status === 404) {
        setMessage({message :'User not found. Please enter a valid email address.'});
      } else {
        setMessage({message :'An error occurred while sending the message.'});
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/65 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
        <div className="flex justify-center mb-8">
            <Image src="/Assets/White logo - no background.png" alt="Logo" width={150} height={150} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold font-sans text-gray-100">Enter Email and OTP</h2>
          {message && (
            <div className="mt-4 text-center">
              <p className={`text-sm ${String(message.message).includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message.message}</p>

            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex items-center">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              <button
                type="button"
                className="ml-2 py-2 px-4 bg-green-600 mb-2 hover:bg-gray-700 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={verifyEmail}
              >
                Verify
              </button>
            </div>
            <div>
              <label htmlFor="otp" className="sr-only">Enter the verification code</label>
              <input
                id="otp"
                name="otp"
                type="text"
                autoComplete="one-time-code"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter the verification code"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={!otp}
            >
              Submit
            </button>
            {!otp && (
              <p className="text-center text-gray-500">Please enter the OTP to proceed.</p>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}

export default ForgotPassword;