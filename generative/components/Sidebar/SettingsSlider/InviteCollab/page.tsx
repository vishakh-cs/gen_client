/* eslint-disable react/no-unescaped-entities */
import useStore from "@/Stores/store";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertCircle } from "react-icons/fi";
import { IoLockClosed } from "react-icons/io5";

interface User {
    _id: string;
    id: string;
    name: string;
    status: string;
    role: string;
    email: string;
}

interface InviteCollabProps {
    workspaceId: string;
    workspaceType:string;
}

const InviteCollab: React.FC<InviteCollabProps> = ({ workspaceId ,workspaceType }: InviteCollabProps) => {

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [collaboratingUsers, setCollaboratingUsers] = useState<User[]>([]);

    const WorkspaceType = useStore((state) => state.workspaceType);

    const setRemoveCollab_trigger = useStore((state)=>state.setRemoveCollabTrigger)

    console.log("collaboratingUsers", collaboratingUsers);

    useEffect(() => {
        const fetchCollaboratingUsers = async () => {
            try {
                const response = await axios.get(`${baseUrl}/get_collaborating_users`, {
                    params: {
                        workspaceId: workspaceId,
                    },
                });

                setCollaboratingUsers(response.data.collaborators);
            } catch (error: any) {
                console.error("Error fetching collaborating users:", error);
            }
        };

        fetchCollaboratingUsers();
    }, [baseUrl, workspaceId]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/find_collab_user`, {
                    params: {
                        query: searchQuery,
                        workspaceId: workspaceId,
                    },
                });

                setSearchResults(response.data.users);
            } catch (error: any) {
                console.error("Error fetching user data:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (searchQuery.trim() !== "") {
            fetchData();
        } else {
            setSearchResults([]);
        }
    }, [baseUrl, searchQuery, workspaceId]);


    const handleRemoveCollaborator = async (userId: string) => {
        console.log("userId", userId);
        try {
            const response = await axios.post(`${baseUrl}/remove_collaborator`, {
                userId: userId,
                workspaceId: workspaceId,
            });

            if (response.data.success) {
                // Filter out the removed user from the state
                setCollaboratingUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
                toast.success("User removed from collaboration");
            } else {
                toast.error("Failed to remove user from collaboration");
            }
        } catch (error) {
            console.error("Error removing user from collaboration:", error);
            toast.error("Failed to remove user from collaboration");
        }
    };


    const isPrivateWorkspace = WorkspaceType === "private";

    return (
        <div>
            {isPrivateWorkspace ? (
                <p className="text-red-500 font-semibold opacity-80 text-lg font-sans flex "><h4>Change workspace type to 'shared' to add collaborators.</h4><IoLockClosed color="white" className="mt-2 " size={30} /></p>
            ) : (
                <button onClick={() => setIsOpen(!isPrivateWorkspace)}>
                    <span className="text-black dark:text-white font-sans font-semibold">Add Collaborator</span>
                </button>
            )}
            <SpringModal
                isOpen={isOpen && !isPrivateWorkspace}
                setIsOpen={setIsOpen}
                workspaceId={workspaceId}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                collaboratingUsers={collaboratingUsers}
                handleRemoveCollaborator={handleRemoveCollaborator}
            />
        </div>
    );
};

const SpringModal = ({
    isOpen,
    setIsOpen,
    setSearchQuery,
    searchResults,
    workspaceId,
    collaboratingUsers,
    handleRemoveCollaborator,
}: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    searchResults: User[];
    workspaceId: string;
    collaboratingUsers?: User[];
    handleRemoveCollaborator: (userId: string) => Promise<void>;
}) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    const handleInvite = async (user: User) => {
        try {
            const invitePromise = axios.post(`${baseUrl}/send_email_notification`, {
                userEmail: user.email,
                workspaceId: workspaceId,
            });

            toast.promise(invitePromise, {
                loading: 'Sending invitation email...',
                success: `Invitation email sent to ${user.email}`,
                error: 'Failed to send invitation email.',
            });
        } catch (error) {
            console.error("Error sending email notification:", error);
        }
    };


    const handleCloseModal = () => {
        setSearchQuery("");
        setIsOpen(false);
    };




    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCloseModal}
                    className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: "12.5deg" }}
                        animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-br from-gray-700 to-blue-950 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
                    >
                        <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-center mb-2">Invite a User</h3>
                            {/* Show collaborating users */}
                            <div className="block dark:text-white text-black text-lg font-semibold py-2 px-2">
                                Collaborating Users
                            </div>
                            <div className="w-full h-20 bg-white border rounded-md overflow-auto">
                                <div className="p-4 text-black">
                                    {collaboratingUsers && collaboratingUsers.length > 0 ? (
                                        <div>
                                            {collaboratingUsers.map((user) => (
                                                <div key={user.id} className="flex items-center justify-between font-semibold text-black m-1">
                                                    {user.email}
                                                    <button
                                                        className="ml-20 font-semibold bg-orange-600 text-white rounded-lg w-24"
                                                        onClick={() => handleRemoveCollaborator(user._id)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>No collaborating users</div>
                                    )}
                                </div>
                            </div>


                            <p className="text-sm text-justify mb-6">
                                Invite a User to your project to Work Together on it. You can also Assign them as Roles, you can do it later from
                                the Project Settings /Collab User section.
                            </p>
                            <div className="searchuser">
                                <div className="w-full max-w-screen-xl mx-auto px-6">
                                    <div className="flex justify-center p-4 px-3 py-10">
                                        <div className="w-full max-w-md">
                                            <div className="bg-white/90 shadow-md rounded-lg px-3 py-2 mb-4">
                                                <div className="block dark:text-black text-black text-lg font-semibold py-2 px-2">
                                                    Search User
                                                </div>
                                                <div className="flex items-center bg-gray-200 rounded-md">
                                                    <div className="pl-2">
                                                        <svg
                                                            className="fill-current text-gray-500 w-6 h-6"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                className="heroicon-ui"
                                                                d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        className="w-full rounded-md bg-gray-200 text-black leading-tight focus:outline-none py-2 px-2"
                                                        id="search"
                                                        type="text"
                                                        placeholder="Search teams or members"
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        autoComplete="off"
                                                    />
                                                </div>

                                                <div className="py-3 text-sm">
                                                    {searchResults && searchResults.length > 0 ? (
                                                        searchResults.map((user, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex justify-start text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2"
                                                            >
                                                                <div className="text-sm font-normal text-gray-500 tracking-wide">{user.email}</div>
                                                                <button
                                                                    onClick={() => handleInvite(user)}
                                                                    className="ml-auto bg-white hover:opacity-90 transition-opacity text-green-600 font-semibold py-1 px-2 rounded"
                                                                >
                                                                    Invite
                                                                </button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-black">No results found.</div>
                                                    )}
                                                </div>
                                                <div className="block bg-gray-200 text-sm text-right py-2 px-3 -mx-3 -mb-2 rounded-b-lg"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                                >
                                    Nah, go back
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InviteCollab;
