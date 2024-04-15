"use client";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useEffect, useState } from 'react';
import Loaders from '../Loaders/page';
import useStore from '@/Stores/store';
import { useRouter } from 'next/navigation';

interface RoomProps {
  roomId: string;
  userId: string;
  fallback: any; 
}

export default function Room({ roomId, userId, fallback }: RoomProps) {
 
  const router = useRouter();

  const userEmail = localStorage.getItem('userEmail');

  const otherWorkspaceId = useStore(state=>state.otherWorkspaceId);

    console.log("otherWorkspaceId12  ",otherWorkspaceId);

  // useEffect(() => {
  //   const otherWorkspaceIds = sessionStorage.getItem('otherWorkspaceIds');
  //   if (otherWorkspaceIds) {
  //     setOtherWorkspaceId(otherWorkspaceIds);
  //   }
  // }, []);

  const room_id = otherWorkspaceId ? otherWorkspaceId : roomId;

  console.log("roomId",room_id);

  console.log("userEmail",userEmail);
  // TODO: get user input for room and name
  const  [room, setRoom] = useState<string>()
  const [name, setName] = useState<string>(userEmail || '');

  console.log("name,name",name);
  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${room_id}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (token === "") {
    return <Loaders />;
  }

    // Handle disconnection
    const handleDisconnect = () => {
      setToken("")
      router.back()
    };

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      onDisconnected={handleDisconnect}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: '100dvh' }}
    >
      <VideoConference/>
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}