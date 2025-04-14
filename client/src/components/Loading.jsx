import React from 'react';
import { ClipLoader } from 'react-spinners';

export default function Loading({ text = 'Loading...', size = 40, overlay = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
        overlay ? 'fixed inset-0 bg-[#222831]/60 z-50 backdrop-blur-sm' : 'w-full h-full'
      }`}
    >
      <ClipLoader size={size} color="#00ADB5" />
      <p className="mt-2 text-[#EEEEEE] text-sm animate-pulse">{text}</p>
    </div>
  );
}
