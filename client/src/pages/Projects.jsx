import React from 'react';
import CallToAction from '../components/CallToAction';

export default function Projects() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold my-7">
          आगामी रचनाएँ
        </h1>
        
        <div className="text-lg flex flex-col gap-6 text-justify leading-relaxed">
          <p className="text-xl font-medium text-center">
            आने वाले शब्दों की झलक...
          </p>
          
          <p>
            यहाँ जल्द ही प्रकाशित होंगी नई कविताएँ, लघु कहानियाँ और ऐसे विचार जो दिल और समाज—दोनों को छूते हैं। हर रचना एक नई दिशा, एक नया अनुभव लेकर आएगी। जुड़े रहिए, क्योंकि कुछ खास लिखने वाला हूँ — आपके लिए।
          </p>

          <div className="grid gap-4 mt-6">
            <div className="p-4 rounded-lg shadow-sm border-l-4">
              <h3 className="font-semibold mb-2">काव्य संग्रह</h3>
              <p className="text-sm">जीवन के विभिन्न रंगों को समेटे हुए कविताओं का संकलन</p>
            </div>
            
            <div className="p-4 rounded-lg shadow-sm border-l-4">
              <h3 className="font-semibold mb-2">लघु कहानियाँ</h3>
              <p className="text-sm">समाज के दर्पण में दिखते चेहरों की कहानियाँ</p>
            </div>
            
            <div className="p-4 rounded-lg shadow-sm border-l-4">
              <h3 className="font-semibold mb-2">विचार और चिंतन</h3>
              <p className="text-sm">आधुनिक जीवन की चुनौतियों पर गहरे विचार</p>
            </div>
          </div>
        </div>
        
        <div className="mt-10">
          <CallToAction />
        </div>
      </div>
    </div>
  );
}