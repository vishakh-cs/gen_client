"use client"
import React, { useEffect, useState } from 'react';
import { BlockNoteEditor, filterSuggestionItems } from '@blocknote/core';
import YPartyKitProvider from "y-partykit/provider";
import {
  useCreateBlockNote,
  BlockNoteView,
  getDefaultReactSlashMenuItems,
  DefaultReactSuggestionItem,
  SuggestionMenuController,
} from '@blocknote/react';
import * as Y from "yjs";
import { useCompletion } from "ai/react";
import { ImMagicWand } from 'react-icons/im';
import "@blocknote/react/style.css";
import { useTheme } from "next-themes";
import { WebrtcProvider } from "y-webrtc";
import LiveblocksProvider from "@liveblocks/yjs";
import {useRoom, useSelf } from '@/liveblocks.config';
import useStore from '@/Stores/store';

interface EditorProps {
  // workspaceId: string;
  pageId: string;
}

export const Editor = ({
  pageId,
}: EditorProps) => {
  
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();

  const [provider, setProvider] = useState<any>();


  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);
    // No cleanup function needed here
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  return (
    <>
      <BlockNote doc={doc} provider={provider} pageId={pageId} />
    
    </>
  );
}


interface BlockNoteProps {
  doc: Y.Doc;
  provider: any;
  pageId: string;
}

const BlockNote: React.FC<BlockNoteProps> = ({ doc, provider, pageId }) => {
  const currentUser = useSelf();

  const { complete } = useCompletion({
    id: "hackathon_starter",
    api: "/api/generate",
    onResponse: response => {
      if (response.status === 429) {
        return;
      }
      if (response.body) {
        const reader = response.body.getReader();
        let decoder = new TextDecoder();
        reader.read().then(function processText({ done, value }) {
          if (done) {
            return;
          }
          let chunk = decoder.decode(value, { stream: true });
          editor?._tiptapEditor.commands.insertContent(chunk);
          reader.read().then(processText);
        });
      } else {
        console.error("Response body is null");
      }
    },
    onError: e => {
      console.error(e.message);
    },
  });

  const getPrevText = (
    editor: BlockNoteEditor,
    {
      chars,
      offset = 0,
    }: {
      chars: number;
      offset?: number;
    }
  ) => {
    const content = editor._tiptapEditor.getText();

    const start = Math.max(0, content.length - chars - offset);
    const prevText = content.slice(start, start + chars);

    return prevText;
  };

  const insertMagicItem = (
    editor: BlockNoteEditor
  ): DefaultReactSuggestionItem => ({
    title: "Continue with AI",
    onItemClick: () => {
      complete(
        getPrevText(editor, {
          chars: 5000,
          offset: 1,
        })
      );
    },
    aliases: ["ai", "magic"],
    group: "Magic",
    icon: <ImMagicWand size={18} />,
    subtext: "Continue your idea with some extra inspiration!",
  });

  const getCustomSlashMenuItems = (
    editor: BlockNoteEditor
  ): DefaultReactSuggestionItem[] => [
    insertMagicItem(editor),
    ...getDefaultReactSlashMenuItems(editor),
  ];

  const userName = useStore(state => state.user_data.name); 

  const darkMode =useStore(state=>state.darkMode)
  const { theme, setTheme } = useTheme();
  let mode: "dark" | "light" = darkMode ? "dark" : "light";


  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment(pageId),
      user: {
        name: userName as string,
        color: ''
      },
    },
  });

  return (
    <div className="w-full h-full">
      <BlockNoteView editor={editor} theme={mode} slashMenu={false}>
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async query =>
            filterSuggestionItems(getCustomSlashMenuItems(editor), query)
          }
        />
      </BlockNoteView>
    </div>
  );
}

