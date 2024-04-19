import React from 'react';
import { AiFillNotification } from "react-icons/ai";
import { CgCloseR } from "react-icons/cg";

interface CollabAlertBoxProps {
    isEmail: boolean;
    setIsEmail: React.Dispatch<React.SetStateAction<boolean>>;
}

const CollabAlertBox: React.FC<CollabAlertBoxProps> = ({ isEmail, setIsEmail }) => {

    const handleClose = () => {
        setIsEmail(false); 
    };
    return (
        <>
        {isEmail && (
            <div className="fixed top-0 left-0 w-full px-8 py-4 bg-green-400 text-white flex justify-between rounded z-40">
                <div className="flex items-center justify-between gap-10 ml-5">
                    <AiFillNotification />
                    <p className='font-semibold font-sans'>You have been invited to collaborate on a Workspace! Check your email for more details.</p>
                </div>
                <button className="text-green-100 hover:text-white" type="button" title="Close" onClick={handleClose}>
                    <CgCloseR size={25}/>
                </button>
            </div>
        )}
    </>
);
};


export default CollabAlertBox;
