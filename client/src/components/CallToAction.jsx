import React from 'react'
import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-[#5A5AFF] justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className='flex-1 justify-center flex flex-col'>
            <h2 className='text-2xl'>
                कविता, कहानियाँ और विचार — दिल से।
            </h2>
            <p className='my-2 text-sm'>
              
                यह मंच है उन लफ़्ज़ों का जो कुछ कह जाते हैं।
                जल्द आ रहे हैं ऐसे लेख और रचनाएँ जो आपको सोचने, मुस्कुराने और महसूस करने पर मजबूर कर देंगे।

                हमसे जुड़े रहें — आपकी अपनी आवाज़ बस शुरू होने को है।
            </p>
            <Link to="/about" className=' rounded-tl-xl rounded-bl-none bg-btn-primary'>
            <button >
                लक्ष्मण पुंडीर
            </button>
            </Link>

        </div>
        <div className='flex-1 p-7 '> 
            <img src="https://www.hope.ac.uk/media/studywithus/undergraduate/images/2023-24ugcoursebannerimages/BA%20(Hons)%20Creative%20Writing%20(Major).jpg" alt="image" className='rounded-tl-3xl rounded-br-3xl' />
        </div>
    </div>
  )
}
