import { create } from 'zustand';

interface StoreState {
  userID: string | null;
  userEmail: string;
  profileImage: string | null;
  user_data: any; 
  isLogoutClicked: boolean;
  workspaceName: string;
  isProfileClicked: boolean;
  workspaceId: string;
  workspaceType: string; 
  otherWorkspaceId: string;
  collaboratorWorkspace: {
    _id: string;
    name: string;
    workspaceLogoIndex: number;
    owner: string;
    collaborators: string[];
    createdAt: string;
    pages: string[];
    type: string;
  } | null;
  isPageRestored: boolean; 
  isWorkspaceNameChanged: boolean; 
  removeCollabTrigger:boolean;
  darkMode: boolean;
  isPageClick: boolean;
}

interface StoreActions {
  setUserID(userID: string): void;
  setUserEmail(userEmail: string):  void;
  setProfileImage:(profileImage?: string)=>void;
  setUserData(user_data: any): void;
  setLogoutClicked: (value: boolean) => void;
  resetLogoutClicked: () => void;
  setOtherWorkspaceId: (workspaceId: string) => void;
  setWorkspaceName: (name: string) => void;
  resetWorkspaceName: () => void;
  setWorkspaceId: (id: string) => void;
  setWorkspaceType: (type: string) => void;
  setCollaboratorWorkspace: (collabWorkspace: StoreState['collaboratorWorkspace']) => void;
  setPageRestored(restored: boolean): void;
  setWorkspaceNameChange(changed: boolean): void;
  setRemoveCollabTrigger(trigger: boolean): void;
  setDarkMode: (darkMode: boolean) => void;
  setIsPageClick: (isPageClick: boolean) => void;

}

export const useStore = create<StoreState & StoreActions>((set) => {
  // Check if localStorage is available
  const localStorageAvailable = typeof window !== 'undefined' && window.localStorage;

  return {
    userID: localStorageAvailable ? localStorage.getItem('USER_ID') || null : null,
    userEmail: '',
    profileImage: '',
    user_data: {},
    isLogoutClicked: false,
    workspaceName: '',
    isProfileClicked: false,
    otherWorkspaceId: '',
    workspaceId: '',
    workspaceType: '',
    collaboratorWorkspace: null,
    isPageRestored: false,
    isWorkspaceNameChanged: false,
    removeCollabTrigger: false,
    darkMode: localStorageAvailable ? JSON.parse(localStorage.getItem('darkmode') as string) : false,
    isPageClick: false,

    setUserID: (userId) => set({ userID: userId }),
    setUserEmail: (email) => set({ userEmail: email.toLowerCase() }),
    setProfileImage: (img) => set({ profileImage: img }),
    setUserData: (data) => set({ user_data: data }),

    setLogoutClicked: (value) => set({ isLogoutClicked: value }),
    resetLogoutClicked: () => set({ isLogoutClicked: false }),

    setWorkspaceName: (name) => set({ workspaceName: name }),
    resetWorkspaceName: () => set({ workspaceName: '' }),

    setOtherWorkspaceId: (id) => set({ otherWorkspaceId: id }),
    setWorkspaceId: (id) => set({ workspaceId: id }),
    setWorkspaceType: (type) => set({ workspaceType: type }),
    setCollaboratorWorkspace: (collabWorkspace) => set({ collaboratorWorkspace: collabWorkspace }),
    setPageRestored: (restored) => set({ isPageRestored: restored }),

    setWorkspaceNameChange: (changed) => set({ isWorkspaceNameChanged: changed }),
    setRemoveCollabTrigger: (trigger) => set({ removeCollabTrigger: trigger }),
    setDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    setIsPageClick: () => set((state) => ({ isPageClick: true })),
  };
});


export default useStore;
