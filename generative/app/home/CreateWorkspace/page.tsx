import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const CreateWorkspaceComponent = dynamic(() => import('@/components/CreateWorkspaceComponent/page'), {
    ssr: false, // This disables SSR for the CreateWorkspaceForm component
});

function CreateWorkspace() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateWorkspaceComponent />
        </Suspense>
    );
}

export default CreateWorkspace;