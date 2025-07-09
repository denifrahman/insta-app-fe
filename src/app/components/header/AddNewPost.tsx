'use client';
import axios from 'axios';
import React, { useState } from 'react';

function AddNewPost({
  setAddPost,
}: {
  setAddPost: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [imageSelected, setImageSelected] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImageSelected(true);
    }
  };


  const handleUpload = async () => {
    if (!selectedImage) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('caption', caption);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percent);
            }
          },
        }
      );
      if (res.status === 200) {
        setAddPost(false);
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 500) {
      setCaption(e.target.value);
    }
  };

  return (
    <div
      className="fixed top-0 z-10 flex h-full w-full cursor-default items-center justify-center bg-[#0000008f] dark:bg-[#000000d7]"
      onClick={(e: any) => {
        if (e.target.id === 'closeAddPost') setAddPost(false);
      }}
      role="button"
      tabIndex={0}
      id="closeAddPost"
    >
      {loading ? (
        <div className="animate-spin rounded-full bg-[#000000de] p-2">
          <picture>
            <img
              className="h-10 w-10"
              src="/instagramLoading.png"
              alt="instagram loading"
            />
          </picture>
        </div>
      ) : (
        <div>
          <button
            className="fixed top-5 right-5 text-white text-2xl"
            type="button"
            onClick={() => setAddPost(false)}
          >
            ✕
          </button>
          <div className="w-[444px] flex-col overflow-hidden rounded-xl bg-white dark:border dark:border-stone-300 dark:bg-[#000000]">
            {imageSelected && selectedImage ? (
              <div>
                <div className="flex items-center justify-between px-4">
                  {!uploading && (
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setImageSelected(false);
                        setCaption('');
                      }}
                      type="button"
                      className="text-sm text-blue-500"
                    >
                      Change
                    </button>
                  )}
                  {!uploading && (
                    <h1 className="border-b border-stone-300 py-3 text-center font-semibold dark:border-stone-700">
                      Post Preview
                    </h1>
                  )}
                  {uploading ? (
                    <div className="w-full bg-gray-200 rounded-full h-4 my-2">
                      <div
                        className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  ) : <button
                    className="font-semibold text-[#0095f6] text-sm"
                    type="button"
                    onClick={handleUpload}
                  >
                    Create
                  </button>}

                </div>
                <div>
                  <picture>
                    <div className="flex justify-center items-center bg-black">
                      <img
                        className="max-h-[444px] max-w-[444px] object-contain"
                        src={URL.createObjectURL(selectedImage)}
                        alt="post"
                      />
                    </div>
                  </picture>
                </div>
                <div className="p-4">
                  <input
                    className="w-full focus:outline-none border-b py-2 dark:bg-[#000] dark:text-white"
                    placeholder="Write a caption..."
                    type="text"
                    value={caption}
                    onChange={handleCaptionChange}
                  />
                  <div className="text-right text-xs text-gray-500">
                    {caption.length} / 500
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="border-b border-stone-300 py-5 text-center font-semibold dark:border-stone-700">
                  Create new post
                </h1>
                <div className="flex h-[444px] flex-col items-center justify-center">
                  <div className="mx-auto mb-4">
                    <img
                      src="/logo.png"
                      alt="upload icon"
                      className="h-20 w-20 opacity-70"
                    />
                  </div>
                  <h1 className="py-2 text-lg">Upload photos only now supported</h1>
                  <div className="flex justify-center rounded bg-[#0095f6] text-sm font-semibold text-white">
                    <label
                      className="cursor-pointer px-4 py-2"
                      htmlFor="photoFile"
                    >
                      Select From Computer
                      <input
                        type="file"
                        id="photoFile"
                        accept=".png, .jpg, .jpeg"
                        hidden
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )
      }
    </div >
  );
}

export default AddNewPost;
