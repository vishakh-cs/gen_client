import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { CiFileOn, CiTrash } from 'react-icons/ci';
import { twMerge } from 'tailwind-merge';
import { RiFindReplaceLine } from "react-icons/ri";
import { MdRestorePage } from "react-icons/md";
import { FaRegTrashAlt, FaSpinner } from "react-icons/fa";
import toast from 'react-hot-toast';
import { GetServerSideProps } from 'next';
import useStore from '@/Stores/store';


interface TrashBar {
    id: string;
    name: string;
}

interface TrashBarProps {
    workspaceId: string;
}
const TrashBar: React.FC<TrashBarProps> = ({ workspaceId }) => {

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const [trashedPages, setTrashedPages] = useState<TrashBar[]>([]);
    const [deletingPageId, setDeletingPageId] = useState<string | null>(null);
    const setPageRestored = useStore((state) => state.setPageRestored);


    const fetchTrashedPages = async () => {
        try {
            const response = await axios.get<TrashBar[]>(`${baseUrl}/trashedData/${workspaceId}`);
            setTrashedPages(response.data);
        } catch (error) {
            console.error('Error fetching trashed pages:', error);
        }
    };

    useEffect(() => {
        fetchTrashedPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspaceId]);

    const RestorePage = async (pageId :string) => {
        try {
            const res = await axios.post(`${baseUrl}/RestorePage/${pageId}`);
            if (res.data.success) {
                toast.success("Successfully restored page!");
                setPageRestored(true);
                // Fetch the updated trash data
                fetchTrashedPages();
            }
        } catch (error) {
            console.error('Error restoring page:', error);
            toast.error("Failed to restore page.");
        } finally {
            setTimeout(() => {
                setPageRestored(false);
            }, 2000);
        }
    };


   // Function to delete a page
   const deletePage = (pageId: string) => {
    const deletePagePromise = axios.delete(`${baseUrl}/deletePage/${pageId}`);

    toast.promise(
        deletePagePromise,
        {
            loading: 'Deleting page...',
            success: 'Page deleted successfully!',
            error: 'Failed to delete page.',
        }
    );

    deletePagePromise.then((res) => {
        if (res.data.success) {
            toast.success("Page has been moved to Trash");
            setPageRestored(true);
            fetchTrashedPages();
        }
    }).catch((error) => {
        console.error('Error deleting page:', error);
    }).finally(() => {
        setTimeout(() => {
            setDeletingPageId(null);
            setPageRestored(false);
        }, 2000);
    });
};



    const handleTrashManagement = () => {
        fetchTrashedPages();
    };

    return (
        <Sheet>
            <SheetTrigger>
                <button
                    type='button'
                    onClick={handleTrashManagement}
                    className={twMerge('border-t flex p-3 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700')}
                >
                    <span className={twMerge('text-gray-600 flex justify-between dark:text-gray-300')}>
                        Trash Management
                    </span>
                    <span><CiTrash size={22} className='ml-4' /></span>
                </button>
            </SheetTrigger>
            <SheetContent className='dark:bg-black/80 bg-white' side={'left'}>
                <SheetHeader>
                    <SheetTitle className='flex justify-center'>Trash Management</SheetTitle>
                    <SheetDescription>
                        <span className='text-red-600 text-lg font-sans'>Note!</span>
                        <span className='ml-2'>
                            Once you delete from the trash bin, you will not be able to recover it.
                        </span>
                    </SheetDescription>
                    <div>
                        {trashedPages.map((page, index) => (
                            <div className='mt-1' key={index}>
                                <p className='bg-slate-400 rounded-md h-9 hidden'>ID: {page.id}</p>
                                <p className='bg-slate-900 rounded-md h-9  text-white font-semibold flex justify-between mr-5 items-center px-4  '><CiFileOn size={20} /> {page.name}
                                {deletingPageId === page.id ? (
                                <FaSpinner className='animate-spin text-gray-400' />
                            ) : (
                                <FaRegTrashAlt
                                    onClick={() => deletePage(page.id)}
                                    color='red' size={18} className='ml-auto'
                                />
                            )}
                            {!deletingPageId && <span className='text-red-600 cursor-pointer' onClick={() => deletePage(page.id)}>Delete</span>}
                            <MdRestorePage size={20} className="ml-3" /><span className='cursor-pointer' onClick={() => RestorePage(page.id)}>Restore</span>
                        </p>
                    </div>
                ))}
            </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}

export default TrashBar;
