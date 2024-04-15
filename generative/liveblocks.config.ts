import { createClient } from "@liveblocks/client";
import { createRoomContext, createLiveblocksContext } from "@liveblocks/react";

// Create a Liveblocks client
const client = createClient({
  publicApiKey: "pk_prod_MBiQAyeZMADECGZoWnu3o7PCYmTht8i4McH7APPHZc56I7TFl_Y_gxZ0k7d6drqN",
});

// Define resolve functions for Liveblocks features
const resolveUsers = async ({ }) => {
  // Return a list of user information
  return [];
};

const resolveMentionSuggestions = async ({ }) => {
  // Return a list of userIds that match text
  return [];
};

const resolveRoomsInfo = async ({ }) => {
  // Return a list of room information
  return [];
};

// Define types for Room-level hooks
type Presence = {};
type Storage = {};
type UserMeta = {};
type RoomEvent = {};
type ThreadMetadata = {};

// Create Room-level hooks using createRoomContext
export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersListener,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useObject,
    useMap,
    useList,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
    useThreads,
    useCreateThread,
    useEditThreadMetadata,
    useCreateComment,
    useEditComment,
    useDeleteComment,
    useAddReaction,
    useRemoveReaction,
    useThreadSubscription,
    useMarkThreadAsRead,
    useRoomNotificationSettings,
    useUpdateRoomNotificationSettings,
    // These hooks can be exported from either context
    // useUser,
    // useRoomInfo
  }
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(client);


// Create Project-level hooks using createLiveblocksContext
export const {
  suspense: {
    LiveblocksProvider,
    useMarkInboxNotificationAsRead,
    useMarkAllInboxNotificationsAsRead,
    useInboxNotifications,
    useUnreadInboxNotificationsCount,
    // These hooks can be exported from either context
    useUser,
    useRoomInfo,
  }
} = createLiveblocksContext<UserMeta, ThreadMetadata>(client);
