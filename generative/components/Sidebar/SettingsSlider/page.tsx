"use state"
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import WorkpaceTypeDropDown from "./WorkspaceType/page";

import useStore from "@/Stores/store";
import axios from "axios";
import { useState } from "react";
import InviteCollab from "./InviteCollab/page";
import { DeleteConformation } from "./DeleteConformation";

interface SettingsSliderProps {
  workspaceId: string;
  workspaceName: string;
  workspaceLogoIndex: number | null,
  workspaceType: string;
}

export function SettingsSlider({ workspaceId, workspaceName, workspaceLogoIndex, workspaceType }: SettingsSliderProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [originalWorkspaceName, setOriginalWorkspaceName] = useState(workspaceName);
  const setWorkspaceNameChange =useStore((state)=>state.setWorkspaceNameChange)

  const imgPaths = [
    "/Assets/workspace1.jpg",
    "/Assets/workspace2.jpg",
    "/Assets/workspace3.jpg",
    "/Assets/workspace4.jpg",
    "/Assets/briefcase_439354.png",
    "/Assets/workspace5.webp",
    "/Assets/workspace6.png",
    "/Assets/workspace7.webp",
    "/Assets/workspace8.png",
    "/Assets/workspace9.webp",
    "/Assets/workspace10.png",
    "/Assets/workspace11.png",
    "/Assets/workspace12.png",
    "/Assets/workspace13.jpg",
    "/Assets/workspace14.png",
  ];

  const handleEditName = () => {
    setIsEditingName(true);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setNewWorkspaceName("");
  };

  const handleUpdateWorkspaceName = async () => {
    try {
      await axios.post(`${baseUrl}/updateWorkspaceName`, {
        workspaceId: workspaceId,
        newName: newWorkspaceName,
      });
      setIsEditingName(false);
      setOriginalWorkspaceName(newWorkspaceName);
      setWorkspaceNameChange(true);
      setTimeout(() => {
        setWorkspaceNameChange(false);
      }, 2000);
    } catch (error) {
      console.error("Error sending new workspace name:", error);
    }
  };

  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <MdOutlineSettingsSuggest size={23} style={{ opacity: 0.8 }} />
      </SheetTrigger>
      <SheetContent className="bg-sidebar/80" side={"left"}>
        <SheetHeader>
          <SheetTitle className="font-sans flex justify-center">
            <span>Workspace Settings</span>
          </SheetTitle>
          <div className="flex items-center py-4">
            {workspaceLogoIndex !== null && (
              <Image
                src={imgPaths[workspaceLogoIndex]}
                alt={`Workspace Logo`}
                width={22}
                height={25}
                className="mr-2"
              />
            )}
            {isEditingName ? (
              <input
                type="text"
               placeholder={originalWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="rounded-md text-black border-2 w-32 border-white border-opacity-65 p-1 mr-2"
              />
            ) : (
              <span className="text-xl">{originalWorkspaceName}</span>
            )}
             <WorkpaceTypeDropDown workspaceId={workspaceId} workspaceType={workspaceType} />
            {isEditingName ? (
              <>
                <Button className="bg-green-600 text-white w-11 h-6 hover:bg-green-800 " onClick={handleUpdateWorkspaceName}>Save</Button>
                <Button className="bg-red-600 text-white w-14 h-6 ml-1 hover:bg-orange-700" onClick={handleCancelEdit}>Cancel</Button>
              </>
            ) : (
              <BsPencilSquare className="ml-auto" onClick={handleEditName} />
            )}
          </div>
          <SheetDescription>
            By default, your workspace is private.
            Make changes to your workspace settings here to add collaborators to share your workspace in real-time.
          </SheetDescription>
          <div className="border-2 border-white border-opacity-65 cursor-pointer h-14 py-6 flex items-center rounded-md p-2 my-2">
            <InviteCollab workspaceId={workspaceId} workspaceType={workspaceType} />
          </div>

          <DeleteConformation  workspaceId={workspaceId} workspaceName={workspaceName} />
         
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
