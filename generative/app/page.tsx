/* eslint-disable react/no-unescaped-entities */
import Pricing from "@/components/Pricing/page";
import Image from "next/image";

export default function Home() { 
  return (
    <div className="min-h-screen  w-full bg-customColor">
      <div className="flex flex-col items-center justify-center h-1/2 lg:h-3/4 py-20 lg:py-36 mx-auto">
        <h3 className="text-center text-3xl md:text-4xl lg:text-5xl font-merriweather py-5 text-gray-900 dark:text-white">
          Start Real-time <span className="text-yellow-300">Collaboration</span>
        </h3>
        <i className="text-center text-gray-900 text-base md:text-lg lg:text-xl dark:text-white">
          "If everyone is moving forward together, then success takes care of itself." - Henry Ford
        </i>
        <button className="bg-purple-700 mt-5 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded-full 
        transform transition-transform duration-300 hover:scale-110">
          Get Started
        </button>
      </div>
     
      <div className="dark:text-white text-gray-900 text-center py-8 h-[100vh] relative z-10">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="absolute bg-gradient-to-r from-blue-950 to-blue-950 w-4/6 h-3/4 rounded-full blur-3xl mb-20"></div>
        </div>
        <h1 className="text-xl text-pretty md:text-xl lg:text-xl font-roboto relative z-10">
          Generative provides a centralized digital workspace where users can create and organize various types of content.
        </h1>
        <h4 className="text-sm font-notoSans opacity-70 relative z-10 py-2">
          Capture your ideas, thoughts, and meeting notes in a structured and organized way.
        </h4>
        <div className="flex justify-center items-center py-6 relative z-10">
          <Image
            src="/Assets/Screenshot 2024-02-15 141238.png"
            alt=""
            width={700}
            height={500}
          />
        </div>
      </div>
      <div className="dark:text-white text-gray-900 text-center py-8 h-[100vh] relative z-10">
        <div className="absolute inset-0 flex justify-between items-stretch">
          <div className="absolute bg-gradient-to-r from-blue-950 to-blue-950 w-4/6 h-3/4 rounded-full blur-3xl mb-20"></div>
        </div>
        <h1 className="text-xl text-pretty md:text-xl lg:text-xl font-roboto relative z-10">
        Real-time collaboration is a core feature, allowing multiple users to work on the same document simultaneously.        </h1>
        <h4 className="text-sm font-notoSans opacity-70 relative z-10 py-2">
        Capture your ideas,thoughts ,and meeting notes in a Structed and Organized way.
        </h4>
        <div className="flex justify-center items-center py-6 relative z-10">
          <Image
            src="/Assets/Screenshot 2024-02-15 143233.png"
            alt=""
            width={700}
            height={500}
          />
        </div>
      </div>
      <Pricing />
    </div>
  );
}
