"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import  { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [decodedEmail, setDecodedEmail] = useState('');

  const router = useRouter();
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const encodedEmail = searchParams.get('email');
    if (encodedEmail) {
      const decodedEmail = atob(encodedEmail);
      setDecodedEmail(decodedEmail);
    }
  }, []);

  console.log("decodedEmail",decodedEmail);

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
  const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
  const numbers = /[0-9]/;

  if (newPassword.length < 6) {
    setErrorMessage('Password must be at least 6 characters long.');
    return;
  }

  if (!specialChars.test(newPassword)) {
    setErrorMessage('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>).');
    return;
  }

  if (!numbers.test(newPassword)) {
    setErrorMessage('Password must contain at least one number.');
    return;
  }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/forgotresetpassword', {
        newPassword, email:decodedEmail
      });
      if(response.data.success){
        router.replace('/login')
      }
      console.log(response.data);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="mx-auto mb-8" >
          <Image src="/Assets/Black logo - no background.png" alt="Logo" width={150} height={150} />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-center text-black/60">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">New Password</label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full rounded-md h-10 border-gray-300 shadow-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="mt-1 block w-full rounded-md h-10 border-gray-300 text-gray-700  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
