// PageNameModal.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import toast from 'react-hot-toast';

interface PageNameModalProps{
    onClose :()=> void;
    onSubmit : (pageName : string)=> void;
}

const PageNameModal : React.FC<PageNameModalProps>= ({ onClose, onSubmit }) => {
  const [pageName, setPageName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = () => {
    if (!pageName.trim()) {
      toast.error('Page name cannot be empty');
      return;
    }
    onSubmit(pageName);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <input
          ref={inputRef}
          className='text-gray-900 ml-1 rounded-sm h-7  placeholder'
          type="text"
          placeholder='Enter page name...'
          value={pageName}
          onChange={(e) => setPageName(e.target.value)}
        />
        <button className='font-sans opacity-80 ml-1' onClick={handleSubmit}>Add</button>
      </div>
    </div>
  );
};

export default React.memo(PageNameModal) ;
