import React from 'react';

export default function Loading({ 
  text = "Loading...", 
  overlay = false, 
  size = 40,
  className = "" 
}) {
  const baseClasses = "flex flex-col items-center justify-center gap-4";
  const overlayClasses = overlay 
    ? "fixed inset-0  bg-opacity-50 z-50" 
    : "py-8";
  
  return (
    <div className={`${baseClasses} ${overlayClasses} ${className}`}>
      {/* Spinning loader */}
      <div className="relative">
        <div 
          className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
          style={{ 
            width: `${size}px`, 
            height: `${size}px` 
          }}
        />
      </div>
      
      {/* Loading text */}
      <div className="text-center">
        <p className="text-gray-600  font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}