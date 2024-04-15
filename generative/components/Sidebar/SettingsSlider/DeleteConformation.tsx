/* eslint-disable react/no-unescaped-entities */
"use client"
import useStore from "@/Stores/store";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import axios from "axios";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

interface DeleteConformationProps {
    workspaceId: string;
    workspaceName: string;
}

export const DeleteConformation: React.FC<DeleteConformationProps> = ({ workspaceId, workspaceName }) => {

     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const setPageRestored = useStore((state) => state.setPageRestored);

    const [error, setError] = useState('');
    const [enteredWorkspaceName, setEnteredWorkspaceName] = useState('');

    useEffect(() => {
            setEnteredWorkspaceName(''); 
    }, []);

    const handleDeleteWorkspace = async () => {
        if (enteredWorkspaceName.trim() !== workspaceName.trim()) {
            setError('Entered workspace name does not match the original workspace name.');
            return;
        }
    
        try {
            const response = await axios.post(`${baseUrl}/delete_workspace`, {
                workspaceId
            });
            console.log(response.data);
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                throw new Error(response.data.message || 'Error deleting workspace');
            }
        } catch (error:any) {
            console.error("Error deleting workspace:", error);
            toast.error(error.response?.data?.message || 'Error deleting workspace');
        }
    };
    
    
    return (
        <Dialog>
            <DialogTrigger>
                <div className="border-2 border-red-500 cursor-pointer border-opacity-65 h- py-6 flex items-center rounded-md p-2 my-2">
                    <span className="text-red-500 font-semibold">Delete Workspace</span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete workspace ({workspaceName})</DialogTitle>
                    <DialogDescription>
                        Delete your Workspace here. Click Delete when you're done.
                    </DialogDescription>
                    <Toaster />
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="">
                        {error && <p className="text-red-500">{error}</p>}
                        Enter the workspace Name below
                        <input
                            autoComplete="false"
                            id="name"
                            value={enteredWorkspaceName}
                            onChange={(e) => setEnteredWorkspaceName(e.target.value)}
                            className="w-full text-black"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" className="bg-red-500 hover:bg-red-950 text-white" onClick={handleDeleteWorkspace}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
