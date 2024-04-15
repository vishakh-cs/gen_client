"use client"

import React, { useState } from 'react';

interface Workspace {
    // Define the properties of a workspace
}

interface WorkspaceDropdownProps {
    privateWorkspace: Workspace[] | [];
    sharedWorkspace: Workspace[] | [];
    collabratingSpace: Workspace[] | [];
    defaultValue: Workspace | undefined;
}

const WorkspaceDropdown: React.FC<WorkspaceDropdownProps> = ({
    privateWorkspace,
    sharedWorkspace,
    collabratingSpace,
    defaultValue,
   }) => {
   
    const [selectOption,setSelectOption]=useState(defaultValue)
    const [isOpen,setisOpen]=useState(false)
    return (
        <div>

            <p>workspace-dropdown</p>
        </div>
    );
};

export default WorkspaceDropdown;
