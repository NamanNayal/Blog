import React from 'react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-[#5A5AFF] justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className='flex-1 justify-center flex flex-col'>
            <h2 className='text-2xl'>
                Want to learn more about the latest trends in technology?
            </h2>
            <p className='my-2 text-sm'>
                Subscribe to our newsletter and stay updated with the latest news and insights from the tech world.
            </p>
            <button className=' rounded-tl-xl rounded-bl-none bg-btn-primary'>
                <a href="https://www.geeksforgeeks.org/" target='_blank' rel='noopener noreferrer'>GeeksforGeeks</a>
            </button>

        </div>
        <div className='flex-1 p-7'> 
            <img src="https://imgs.search.brave.com/qxEbG_jwuZifmhvvbaI2k3SmfGjvk-dj4vWo3rl9t0Y/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9naXRo/dWIuY29tL29tb25p/bXVzMS9nZWVrcy1m/b3ItZ2Vla3Mtc29s/dXRpb25zL3Jhdy9t/YXN0ZXIvaW1hZ2Vz/L2dlZWtzZm9yZ2Vl/a3MucG5n" alt="image" />
        </div>
    </div>
  )
}
