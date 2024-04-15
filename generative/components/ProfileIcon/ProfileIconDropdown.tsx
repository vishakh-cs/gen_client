import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  FiEdit,
  FiChevronDown,
  FiTrash,
  FiShare,
  FiPlusSquare,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { PiPaperPlaneTilt } from "react-icons/pi";
import axios from 'axios';
import InputEmoji from 'react-input-emoji'
import { useRouter } from 'next/navigation';
import useStore from '@/Stores/store';
import { signOut } from 'next-auth/react';
import { destroyCookie } from 'nookies';

interface User {
  _id: string;
  email: string;
  profileImageUrl: string;

}

interface Message {
  senderId: string;
  text: string;
  chatId: string;
 }

const ProfileIconDropDown: React.FC<{ workspaceId: string; pageId: string; user_data: User }> = ({ workspaceId, pageId, user_data }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [open, setOpen] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [collaboratingUsers, setCollaboratingUsers] = useState<User[]>([]);
  const [chatCollaborator, setChatCollaborator] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [collabrationWorkspace, setCollabrationWorkspace] = useState<string[]>([]);
  const [otherWorkspaceIds, setOtherWorkspaceIds] = useState<string[]>([]);


  const [messages, setMessages] = useState<Message[]>([]);

  const setOtherWorkspaceId = useStore((state)=>state.setOtherWorkspaceId);
  const setIsLogoutClicked = useStore((state) => state.setLogoutClicked);
  const resetLogoutClicked = useStore((state) => state.resetLogoutClicked);

  const router = useRouter();

  console.log("otherWorkspaceIds",otherWorkspaceIds);

  console.log("collabrationWorkspace:", collabrationWorkspace);


  const handleChange = (newMessage :string) => {
    setNewMessage(newMessage)
  }

  const handleSend = async (e: React.MouseEvent<SVGElement>) => {
    e.preventDefault();
    try {
      const message = {
        senderId: user_data._id,
        text: newMessage,
        chatId: chatId,
      };

      const response = await axios.post(`${baseUrl}/addMessage/`, message);
      console.log('Message sent successfully:', response.data);
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };



  console.log("collaboratingUsers123", collaboratingUsers);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("user_data", user_data);

        const response = await fetch(`${baseUrl}/chatUser/${user_data._id}`);
        if (response.ok) {
          const data = await response.json();
          setChats(data);
          console.log("data", data);
        } else {
          throw new Error('Failed to fetch chats');
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchData();
  }, [baseUrl, user_data]);


  // fetch collabdata

  useEffect(() => {
    const fetchCollaboratingUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get_collaborating_users`, {
          params: {
            workspaceId: workspaceId,
          },
        });

        console.log("response.data.collaborators", response.data.collaborators);
        setCollabrationWorkspace(response.data.collabworkspace_id)
        setCollaboratingUsers(response.data.collaborators);
      } catch (error: any) {
        console.error("Error fetching collaborating users:", error);
      }
    };

    fetchCollaboratingUsers();
  }, [baseUrl, workspaceId]);


  // fetch for collab data

  useEffect(() => {
    const fetchCollaboratingUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get_otherCollab_users`, {
          params: {
            workspaceId: workspaceId,
          },
        });

        setOwner(response.data.owner);
        setOtherWorkspaceIds(response.data.otherWorkspaceIds);
        setOtherWorkspaceId(response.data.otherWorkspaceIds[0]);
        sessionStorage.setItem('otherWorkspaceIds', response.data.otherWorkspaceIds);

      } catch (error: any) {
        console.error("Error fetching collaborating users:", error);
      }
    };

    fetchCollaboratingUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);


  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpen(false);
        setShowChatModal(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);



  // Function to handle opening chat modal
  const handleChatClick = (collaborator: User) => {

    setChatCollaborator(collaborator);
    setShowChatModal(true);
    console.log("THe chart datat", chats);

    setChatId(chats[0]?._id);
  };


  const handleLogout = async () => {

    destroyCookie(null, 'token', { path: '/' });
    await signOut({ redirect: false });
    
    setIsLogoutClicked(true);
    setOpen(false);
    router.replace('/');
    resetLogoutClicked();
  };

  const handleMeetingRoomClick = () => {
    // const destination = otherWorkspaceIds.length > 0 ? otherWorkspaceIds[0] : workspaceId;
    const currentUserId = user_data._id;
    const firstOtherWorkspaceId = otherWorkspaceIds.length > 0 ? otherWorkspaceIds[0] : null;
    
    router.push(`/home/${currentUserId}/${workspaceId}/Rooms`);
  };
  
  

  return (
    <>
      <motion.div animate={open ? "open" : "closed"} className="relative" ref={dropdownRef}>
        <button onClick={() => setOpen((pv) => !pv)}>
          {!user_data.profileImageUrl && user_data.email && (
            <div className='bg-green-600 w-7 h-7 mr-2 mt-2 rounded-full'>
            </div>
          )}
          {user_data.profileImageUrl && (
            <Image
              src={user_data.profileImageUrl}
              alt="Profile"
              width={30}
              height={30}
              className="w-7 h-7 mr-2 rounded-full"
              title={user_data.email}
            />
          )}
        </button>

        <motion.ul
          initial={wrapperVariants.closed}
          variants={wrapperVariants}
          style={{ originY: "top", translateX: "-50%", maxHeight: "auto" }}
          className="flex flex-col gap-2 p-2 rounded-lg bg-gray-800 text-white shadow-xl absolute top-[120%] left-[50%] w-60 overflow-hidden"
        >
          {/* Render email option first */}
          <Option setOpen={setOpen} Icon={FiEdit} text={user_data.email} />

          {/* Render Collaborators list below email option */}
          <li className="flex flex-col gap-1 h-20 border border-white">
            <span className="font-sans text-lg text-center text-transparent bg-clip-text bg-gradient-to-br from-pink-400 via-yellow-400 to-red-500 ">Collaborators</span>
            <div className="overflow-y-auto max-h-full">

              {/* Render owner users */}
              {owner && owner.email !== user_data.email && (
                // Render owner's email and chat icon
                <div className="flex items-center justify-center text-xs">
                  <Image
                    src={owner.profileImageUrl}
                    alt="Profile"
                    width={30}
                    height={30}
                    className="w-7 h-7 mr-2 rounded-full overflow-hidden"
                    title={owner.email}
                  />
                  <span>{owner.email}</span>
                  {/* <button type='button' className="text-indigo-500 flex items-center gap-1" onClick={(e) => { e.preventDefault(); handleChatClick(owner) }}>
                    <span className='text-sm font-semibold'>chat</span>
                    <FiMessageSquare size={15} />
                  </button> */}
                </div>
              )}
              {/* Render collaborating users */}
              {collaboratingUsers.map((collaborator, index) => (
                // Check if the collaborator is not the current user
                collaborator.email !== user_data.email && (
                  <div key={index} className="flex items-center justify-center text-xs">
                    <Image
                      src={collaborator.profileImageUrl}
                      alt="Profile"
                      width={30}
                      height={30}
                      className="w-7 h-7 mr-2 rounded-full overflow-hidden"
                      title={collaborator.email}
                    />
                    <span>{collaborator.email}</span>
                    {/* <button type='button' className="text-indigo-500 flex items-center gap-1" onClick={(e) => { e.preventDefault(); handleChatClick(collaborator) }}>
                      <span className='text-sm font-semibold'>chating</span>
                      <FiMessageSquare size={15} />
                    </button> */}
                  </div>
                )
              ))}
            </div>
          </li>

          {/* Render other options */}
          {/* <Option setOpen={setOpen} Icon={FiEdit} text="Edit History" /> */}
          {(collaboratingUsers.length > 0 || otherWorkspaceIds.length > 0) && (
          <button onClick={() => handleMeetingRoomClick()}>
            <Option setOpen={setOpen} Icon={FiUsers} text="Meeting Room" />
          </button>
        )}
          <div onClick={handleLogout}>
          <Option setOpen={setOpen} Icon={FiShare} text="Logout" />
          </div>
        </motion.ul>
      </motion.div>

      {/* Modal for chat */}
      {showChatModal && chatCollaborator && (
        <div ref={modalRef} className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50" onClick={() => setShowChatModal(false)}>
          <div className="bg-white p-4 rounded-md shadow-md absolute right-10 top-1/2 transform -translate-y-1/2 h-4/5 w-96 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center bg-slate-800 w-full h-10 rounded-t-md'>
              <Image
                src={chatCollaborator.profileImageUrl}
                alt="Profile"
                width={30}
                height={30}
                className="w-7 h-7 mt-1 ml-2 rounded-full"
              />
              <h2 className='text-white ml-2 font-bold py-2'>{chatCollaborator.email}</h2>
            </div>
            <div className="flex-1 overflow-y-auto text-black">
             
            </div>
            <div className="flex justify-around gap-3 items-center bg-white rounded-b-md mt-1">
              <InputEmoji
                value={newMessage}
                onChange={handleChange}
              />

              <PiPaperPlaneTilt
                onClick={handleSend}
                size={20} color='black' />
            </div>
            <button onClick={() => setShowChatModal(false)}>Close</button>
          </div>
        </div>
      )}


    </>
  );
};

interface OptionProps {
  text: string;
  Icon: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Option: React.FC<OptionProps> = ({ text, Icon, setOpen }) => {
  return (
    <motion.li
      variants={itemVariants}
      onClick={() => setOpen(false)}
      className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-200 hover:text-indigo-500 transition-colors cursor-pointer"
    >
      <motion.span variants={actionIconVariants}>
        <Icon />
      </motion.span>
      <span>{text}</span>
    </motion.li>
  );
};

export default ProfileIconDropDown;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
}

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};
