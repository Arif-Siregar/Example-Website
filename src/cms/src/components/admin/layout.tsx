import React, { ReactNode, useState } from 'react';
import Navbar from './navbar';
import { Suspense } from 'react';
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar';
import Router from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';

interface LayoutProps {
  children: ReactNode;
  user?: any;
}

export default function Layout({ children, user }: LayoutProps) {
  const [loading,setloading] = useState(false);
  Router.events.on("routeChangeStart",()=>{
    setloading(true)
  });
  Router.events.on("routeChangeComplete",()=>{
    setloading(false)
  });
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <ProgressBar
        height="8px"
        color="#0000FF"
        options={{ showSpinner: false }}
        shallowRouting
      />
        <Navbar user={user} />
      {loading && 
        <div className='flex justify-center items-center h-screen'>
        <div className='grid grid-rows-2'>
       <div className='flex justify-center'><CircularProgress size={60}/></div>
       <div className='mt-4 text-lg'>Working on it!!</div>
       </div>
       </div>
      }
      {!loading && children}
    </main>
  );
}
