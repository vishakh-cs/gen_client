/* eslint-disable react/no-children-prop */
import Sidebar from '@/components/Sidebar/sidebar';
import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    params: any;
}

const Layout: React.FC<LayoutProps> = ({ children, params }) => { 
    return (
        <main className='flex overflow-hidden h-screen w-screen'>
           <Sidebar params={params} children={undefined} />
           
            <div className='dark:border-Neutrals-12/70 border-l-[1px] w-full relative overflow-scroll'>
                {children}
            </div>
        </main>
    );
};

export default Layout;
