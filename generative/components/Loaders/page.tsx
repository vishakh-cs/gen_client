import React from 'react';

const Loaders = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin mb-4"></div>
      <h3 className='text-black  dark:text-white font-playfairDisplay'>Generative is loading...</h3>
    </div>
  );
};

export default Loaders;
