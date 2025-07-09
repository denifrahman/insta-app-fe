'use client';

import React, { useEffect, useRef, useState } from 'react';
import AddNewPost from './AddNewPost';
import HeaderSearchWindow from './HeaderSearchWindow';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface User {
  id: number,
  name: string,
  avatar: string,
  email: string,
  username: string
}

function Header({ page }: { page: string }) {

  const router = useRouter();
  const [nameSearch, setNameSearch] = useState('');
  const [listSearchResults, setListSearchResults] = useState([]);
  const [searchWindow, setSearchWindow] = useState(false);
  const [avatarDropDown, setAvatarDropDown] = useState(false);
  const [addPost, setAddPost] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);



  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(baseUrl + `/api/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(nameSearch);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [nameSearch]);

  useEffect(() => {
    if (!debouncedSearch.trim()) return;

    fetch(`${baseUrl}/api/search/${debouncedSearch}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSearchWindow(true);
        setNameSearch(debouncedSearch);
        setListSearchResults(data.result.data);
      })
      .catch((error) => console.error(error));
  }, [debouncedSearch]);

  const handleSignOut = () => {
    fetch(baseUrl + '/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <div className="sticky top-0 z-50 border-b border-stone-300 bg-white dark:border-stone-700 dark:bg-[#1c1c1c] dark:text-slate-100 w-full">
      <div className="flex h-[60px] items-center justify-between px-2 sm:px-4 lg:px-8 max-w-7xl mx-auto w-full">

        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="logo"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </a>
        </div>


        <div className="relative hidden sm:flex flex-1 justify-center max-w-xs mx-2">
          <input
            className="w-full rounded-lg bg-[#efefef] py-[6px] pl-10 pr-2 focus:outline-0 dark:bg-[#131313]"
            type="text"
            placeholder="Search"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            onFocus={() => setSearchWindow(true)}
            onBlur={() => setTimeout(() => setSearchWindow(false), 200)}
          />
          {searchWindow && (
            <HeaderSearchWindow
              loading={false}
              userDetails={listSearchResults}
              searchName={nameSearch}
            />
          )}
          <div className="absolute left-3 top-[50%] -translate-y-1/2 text-gray-500">
            🔍
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4 relative" ref={dropdownRef}>
          <button onClick={() => setAddPost(true)} type="button" title="Add Post">
            ➕
          </button>

          <button
            className="relative h-8 w-8 rounded-full overflow-hidden border border-stone-300 cursor-pointer flex-shrink-0"
            type="button"
            onClick={() => setAvatarDropDown(!avatarDropDown)}
          >
            <Image
              src={user?.avatar || '/logo.png'}
              alt="avatar"
              fill
              className="object-cover"
              sizes="32px"
            />
          </button>

          {avatarDropDown && (
            <div className="absolute top-12 right-0 z-50 w-44 bg-white dark:bg-[#131313] rounded shadow-md overflow-hidden">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#222] text-sm"
                onClick={() => {
                  router.push(`/profile/${user?.username}`);
                  setAvatarDropDown(false);
                }}
              >
                View Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#222] text-sm"
                onClick={() => {
                  handleSignOut();
                  setAvatarDropDown(false);
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {addPost && <AddNewPost setAddPost={setAddPost} />}
    </div>
  );
}

export default Header;
