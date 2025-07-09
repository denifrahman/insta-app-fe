'use client';

import Image from 'next/image';
import Link from 'next/link';


function HeaderSearchWindow({
  loading,
  userDetails,
  searchName,
}: {
  loading: boolean;
  userDetails: any[];
  searchName: string;
}) {
  return (
    <div
      id="headerSearchWindow"
      className="absolute left-[-55px] top-[49px] h-[375px] w-[375px] overflow-hidden rounded-md bg-white shadow-[-2px_-2px_10px_2px_rgba(0,0,0,0.1)] dark:bg-[#1c1c1c] dark:shadow-[-2px_-2px_5px_0px_rgba(0,0,0,0.7)]"
    >
      <div className="flex h-full items-center justify-center">
        {loading || searchName === '' ? (
          <div className="h-8 w-8 ">
          </div>
        ) : (
          <div className="h-full w-full overflow-y-scroll py-3">
            {userDetails.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="">No user with this name was found</div>
              </div>
            ) : (
              userDetails.map((details, index) => (
                <Link href={`/profile/${details.username}`} key={index}>
                  <div className="flex cursor-pointer items-center py-3 pl-5 hover:bg-[#f8f8f8] dark:hover:bg-[#131313]">
                    {' '}
                    {details.avatar ? (
                      <Image
                        className="h-11 w-11 rounded-full object-cover"
                        src={details.avatar}
                        alt="avatar"
                        width="44"
                        height="44"
                      />
                    ) : (
                      <div className="h-11 w-11">
                      </div>
                    )}
                    <p className="ml-5">{details.username}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderSearchWindow;
