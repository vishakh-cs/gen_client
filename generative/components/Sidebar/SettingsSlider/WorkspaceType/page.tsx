import { motion, useAnimation, Variants } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { RiUserSharedFill } from "react-icons/ri";
import { IoIosArrowDropdown } from "react-icons/io";
import axios from "axios";
import { toast } from 'react-hot-toast';
import useStore from "@/Stores/store";

interface WorkpaceTypeDropDownProps {
  workspaceType: string;
  workspaceId:string;
}

const WorkpaceTypeDropDown: React.FC<WorkpaceTypeDropDownProps> = ({ workspaceType ,workspaceId}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [open, setOpen] = useState(false);
  const [currentWorkspaceType, setCurrentWorkspaceType] = useState<string | null>(null);
  const updatedWorkspaceType=useStore((state)=>state.workspaceType)

  const fetchWorkspaceData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/get_workspace_data/${workspaceId}`);
      const workspaceData = response.data;

      setCurrentWorkspaceType(workspaceData.type);
      useStore.setState({ workspaceType: workspaceData.type });
      useStore.setState({workspaceId:workspaceData.data._id});
    } catch (error) {
      console.error('Error fetching workspace data:', error);
      toast.error('Error fetching workspace data');
    }
  };
  

  const handleWorkspaceTypeChange = async (newType: string) => {
    try {

      const response = await axios.post(`${baseUrl}/change_workspace_type`, {
        workspaceId: workspaceId,
        newType: newType,
      });
      const updatedWorkspaceType = response.data.updatedWorkspace.type;
      setCurrentWorkspaceType(updatedWorkspaceType); 

      toast.success(`Workspace type changed to ${newType}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error changing workspace type:', error);
      toast.error('Error changing workspace type');
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  useEffect(() => {
    if (currentWorkspaceType) {
      fetchWorkspaceData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspaceType]);

  return (
    <motion.div animate={open ? "open" : "closed"} className="relative">
      <button onClick={() => setOpen((pv) => !pv)} className="">
        <span className="flex justify-between">
          <span className="ml-3 font-mono text-sm opacity-75">{currentWorkspaceType}</span>
          <span className="ml-2 flex justify-between gap-6">
            <IoIosArrowDropdown size={20} className="ml-auto" />
          </span>
        </span>
      </button>

      <motion.ul
        initial={false}
        variants={wrapperVariants}
        style={{ originY: "top", translateX: "-50%" }}
        className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute top-[120%] left-[50%] w-48 overflow-hidden"
      >
        <Option setOpen={setOpen} Icon={RiGitRepositoryPrivateFill} text="Private" onSelect={() => handleWorkspaceTypeChange('private')}  />
        <Option setOpen={setOpen} Icon={RiUserSharedFill} text="Shared" onSelect={() => handleWorkspaceTypeChange('shared')}  />
      </motion.ul>
    </motion.div>
  );
};

interface OptionProps {
  text: string;
  Icon: IconType;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSelect: () => void; 
}

const Option: React.FC<OptionProps> = ({ text, Icon, setOpen, onSelect }) => {
  return (
    <motion.li
      variants={itemVariants}
      onClick={() => {
        onSelect();
        setOpen(false);
      }}
      className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
    >
      <motion.span variants={actionIconVariants}>
        <Icon />
      </motion.span>
      <span>{text}</span>
    </motion.li>
  );
};


export default WorkpaceTypeDropDown;

const wrapperVariants: Variants = {
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

const itemVariants: Variants = {
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
};

const actionIconVariants: Variants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};
