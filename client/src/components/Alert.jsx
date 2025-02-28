import React from 'react'

export default function Alert({type, message}) {
    const alertStyles = {
        success: "bg-green-100 text-green-800 border-green-400",
        danger: "bg-red-100 text-red-800 border-red-400",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
        info: "bg-blue-100 text-blue-800 border-blue-400",
    };
  return (
    <div className={`p-3 mt-4 border-l-4 rounded-md ${alertStyles[type] || alertStyles.info}`}>
      {message}
    </div>
  );
}
