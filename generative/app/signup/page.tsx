"use client"
import axios from 'axios';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
    Username: string;
    phonenumber: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function Signup() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const checkPasswordStrength = (password: string): number => {
        const minLength = 6;
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        let score = 0;
        if (password.length >= minLength) score += 1;
        if (hasLowerCase) score += 1;
        if (hasNumbers) score += 1;
        if (hasSpecialChars) score += 1;

        return score;
    };

    const validatePhoneNumber = (phoneNumber: string): boolean => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phoneNumber);
    };

    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);

    const handleForm = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!e.currentTarget.username.value.trim()) {
            setMessage("Please enter your full name.");
            return;
        }

        if (e.currentTarget.password.value !== e.currentTarget.confirmPassword.value) {
            setMessage("Password does not match the confirm password");
            return;
        }

        const passwordStrength = checkPasswordStrength(e.currentTarget.password.value);

        if (passwordStrength < 3) {
            setMessage("Password is not strong enough. Please choose a stronger password including numbers and special characters.");
            return;
        }
        const isPhoneNumberValid = validatePhoneNumber(e.currentTarget.phonenumber.value);
        if (!isPhoneNumberValid) {
            setMessage('Please enter a valid phone number ');
            return;
        }

        let userData: UserData = {
            Username: e.currentTarget.username.value,
            phonenumber: e.currentTarget.phonenumber.value,
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value,
            confirmPassword: e.currentTarget.confirmPassword.value,
        };

        console.log('Client-side userData:', userData);

        try {
            const response = await axios.post(`${baseUrl}/signup`, {
                UserName: userData.Username,
                phonenumber: userData.phonenumber,
                email: userData.email,
                password: userData.password,
                confirmPassword: userData.confirmPassword,
            });

            if (response.data.success) {
                console.log('Signup successful');
                setMessage('Signup verification Mail has been sent to your Email 📧');
                // router.push('/login');
            } else {
                console.error('Signup failed:', response.data.message);
                setMessage(`Signup failed: ${response.data.message}`);
            }
        } catch (error :any) {
            console.error('Signup failed:', error.message);

            if (error.response) {
                if (error.response.status === 400) {
                    setMessage('Email is already registered or Already sent Verification Link to your Registered email. Please check your email.');
                } else {
                    setMessage('Signup failed. Please try again later.');
                }
            } else if (error.request) {
                setMessage('No response from the server. Please try again later.');
            } else {
                setMessage('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="flex justify-center min-h-screen">
                <div className="hidden bg-cover lg:block lg:w-2/5" style={{ backgroundImage: "url('https://source.unsplash.com/random/?tech')" }}></div>

                <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
                    <div className="w-full">
                        <h1 className="text-4xl font-semibold tracking-wider font-sourceCodePro text-gray-800  dark:text-white mb-4">
                            <span className='text-red-600'>Gen</span>erative
                        </h1>
                        <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                            Get your free account now.
                        </h1>

                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                            Let’s get you all set up so you can verify your personal account and begin setting up your profile.
                        </p>

                        {message && (
                            <div className="mt-4 text-lg text-red-600 dark:text-red-400">{message}</div>
                        )}

                        <form onSubmit={handleForm} className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Full Name</label>
                                <input type="text" name='username' placeholder="your Full name" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"  />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Phone number</label>
                                <input type="text" name='phonenumber' placeholder="XXX-XX-XXXX-XXX" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email address</label>
                                <input type="email" name='email' placeholder="myemail@example.com" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"  />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Password</label>
                                <input type="password" name='password' placeholder="Enter your password" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"  />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Confirm password</label>
                                <input type="password" name='confirmPassword' placeholder="Enter your password" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"  />
                            </div>

                            <button
                                className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-purple-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                <span className='font-bold text-xl'>Sign Up </span>

                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                            <a onClick={() => router.push('/login')} className='text-white mt-2 py-2 px-4 font-semibold cursor-pointer ml-2' >Login</a>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
