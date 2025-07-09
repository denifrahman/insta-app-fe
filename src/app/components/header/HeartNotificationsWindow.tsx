'use client';

import React from 'react';
import Link from 'next/link';

export default function HeartNotificationsWindow() {

  const [postPopUp, setPostPopUp] = React.useState(false);
  // const [heartDetail, setHeartDetail] = React.useState<heartDetails>();
  const [loading, setLoading] = React.useState(true);

  const upperRef = React.useRef<HTMLDivElement>(null);


  return (
    <div className="relative">
      <div
        id="close"
        className="fixed top-0 left-0 h-screen w-screen cursor-default"
      />
      <div className="absolute top-2 right-[-80px] h-[280px] w-[270px]  cursor-default text-[#262626] dark:text-[#f1f5f9] sm:right-[-12px] sm:w-[440px]">
        {postPopUp ? (
         ''
        ) : (
          ''
        )}
        <div className="ml-auto mr-[84px] flex h-4 w-4 items-center justify-center overflow-hidden sm:mr-4">
          <div className="mt-5 h-4 w-4 rotate-45 bg-white dark:bg-[#131313]" />
        </div>
        <div
          className="rounded-md bg-white py-4 shadow-[-2px_-2px_10px_2px_rgba(0,0,0,0.1)] dark:bg-[#131313]
        dark:shadow-[-2px_-2px_5px_2px_rgba(0,0,0,0.7)]"
        >
          <div className={loading ? 'opacity-0' : ''}>
            <p className="pl-6 text-sm font-semibold">New notifications</p>
            <div
              onLoad={() => setLoading(false)}
            >
             
              <div ref={upperRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
