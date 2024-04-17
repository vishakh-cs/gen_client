import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { MdContentCopy } from "react-icons/md";
import { Check } from "lucide-react";
import toast, { ToastBar, Toaster } from 'react-hot-toast';

interface PublishProps {
  workspaceid: string;
  pageId: string;
}

const Publish:React.FC<PublishProps>=({ workspaceid ,pageId}) =>{
  const clientUrl = 'https://generatives.live';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishData, setPublishData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false); 

  const url = `${clientUrl}/public/preview/${workspaceid}/${pageId}`;
  console.log("url ", url);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsPublished(false); 
  };

  const publish = () => {
    setLoading(true);
    setTimeout(() => {
      setIsPublished(true);
      setLoading(false);
      sendPublishRequest();
    }, 1000);
  };

  const unpublish = () => {
    setLoading(true);
    setTimeout(() => {
      setIsPublished(false);
      setLoading(false);
      sendUnpublishRequest();
    }, 1000);
  };

  const sendPublishRequest = () => {
    axios.post(`${baseUrl}/publish_document`, {workspaceId: workspaceid, })
    .then(response => {
      toast.success("Page Published Successfully!");
      console.log('Publish request successful');
    })
    .catch(error => {
      console.error('Error sending publish request:', error);
    });
  };

  const sendUnpublishRequest = () => {
    axios.post(`${baseUrl}/unpublish_document`, {workspaceId: workspaceid,})
    .then(response => {
      toast.success("Page Unpublished Successfully!");
      console.log('Unpublish request successful');
    })
    .catch(error => {
      console.error('Error sending unpublish request:', error);
    });
  };


  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  return (
    <div className={`font-sans font-semibold cursor-pointer ${isPublished ? "text-green-600" : "dark:text-slate-100 text-gray-950"} ${isPublished ? "text-green-400" : "text-gray-400"}`} onClick={isPublished ? undefined : openModal}>
      {isPublished ? "Published" : "Publish"} 🌐
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center mt-4">
          <div className="fixed inset-0 dark:bg-gray-800/50 bg-opacity-85 bg-gray-200" onClick={closeModal}></div>
          <div className="absolute right-0 top-0 m-8">
            <div className={`rounded-lg ${isPublished ? "dark:bg-workspaceColor" : "bg-workspaceColor"} p-8 shadow-2xl`}>
              <h2 className={`text-lg font-bold ${isPublished ? "text-white" : "text-gray-200"}`}>{isPublished ? "Published 🌐" : "🌎 Are you sure you want to publish?"}</h2>
              <p className={`mt-2 text-sm ${isPublished ? "text-green-800" : "text-gray-100"} ${isPublished ? "dark:text-white" : "text-blue-200"}`}>
                {isPublished ? "Anyone who has this link will be able to view this." : "Once published, your changes will be visible to everyone. Are you sure you want to proceed?"}
              </p>
              {isPublished ? (
                <div>
                  <div className="mt-4 flex items-center gap-2 ">
                    <input
                      className="flex-1 text-gray-950 dark:text-gray-200 px-2 text-xs border rounded-l-md h-10 bg-muted truncate"
                      value={url}
                      disabled
                    />
                    <button
                      onClick={onCopy}
                      disabled={copied}
                      className="h-8 rounded-l-none"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-gray-950 dark:text-white" />
                      ) : (
                        <MdContentCopy  size={18} className="h-4 w-4 text-gray-950 dark:text-white" />
                      )}
                    </button>
                  </div>
                  <button className="rounded bg-gray-600 w-full font-bold text-white px-4 py-2 mt-2" onClick={unpublish}>Unpublish</button>
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                  <button type="button" className={`rounded ${isPublished ? "bg-green-100" : "bg-green-50"} px-4 py-2 text-sm font-medium ${isPublished ? "text-green-600" : "text-green-800"}`} onClick={loading ? undefined : publish}>
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
                        <span>Publishing...</span>
                      </div>
                    ) : (
                      "Yes, Publish"
                    )}
                  </button>
                  <button type="button" className={`rounded ${isPublished ? "bg-green-200" : "bg-gray-50"} px-4 py-2 text-sm font-medium ${isPublished ? "text-green-600" : "text-gray-600"}`} onClick={(e) => { e.stopPropagation(); closeModal(); }}>
                    No, Go Back
                  </button>
                  <Toaster/>
                </div>
                
              )}
            </div>
          </div>
        </div>
  
      )}
    </div>
  );
}

export default Publish;
