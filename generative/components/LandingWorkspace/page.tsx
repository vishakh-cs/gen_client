import React from 'react';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { RiFilePaper2Line } from 'react-icons/ri';
import { AiOutlineSchedule } from 'react-icons/ai';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { motion } from 'framer-motion';

function LandingWorkspace() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className=" min-h-screen flex flex-col items-center justify-center py-20 px-5"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1 className="text-4xl text-gray-950 dark:text-gray-100 font-bold mb-8">Welcome to Generative</h1>
      </motion.div>
      <div className="max-w-4xl text-center">
        <p className="text-lg text-gray-950 dark:text-gray-100  mb-12">
          Generative is a powerful platform designed for creating documents, presentations, notes, and planning activities. It offers a collaborative workspace where you can interact with others in real-time, invite collaborators, and share documentation seamlessly.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <div className="bg-white rounded-full p-4">
              <HiOutlineChatAlt2 className="text-4xl text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-950 dark:text-gray-100  mt-4">Real-time Collaboration</h2>
            <p className="text-gray-950 dark:text-gray-100  text-center mt-2">Engage with your team members, collaborate on projects, and brainstorm ideas together in real-time.</p>
          </motion.div>
          {/* Add other content here */}
        </div>
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12"
        >
         
            <a className={twMerge('bg-blue-500 hover:bg-blue-600 text-gray-950 dark:text-gray-100 py-3 px-8 rounded-full text-lg font-semibold transition duration-300')}>
              Start Exploring Generative
            </a>
          
        </motion.div>
      </div>
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-5 left-0 right-0 flex justify-center items-center text-gray-950 dark:text-gray-100"
      >
        <p className="text-lg">Made with ❤️ by Vishakh</p>
      </motion.div>
    </motion.div>
  );
}

export default LandingWorkspace;
