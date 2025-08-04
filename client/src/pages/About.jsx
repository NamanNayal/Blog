import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold my-7">
          Laxman Pundir's Blog
        </h1>
        
        <div className="text-lg flex flex-col gap-6 text-justify leading-relaxed">
          <p>
            मैं एक साधारण इंसान हूँ, लेकिन शब्दों में अपनी असल पहचान ढूँढता हूँ। लिखना मेरे लिए सिर्फ एक कला नहीं, आत्म-अभिव्यक्ति का माध्यम है। मेरी कविताएँ, लघु कथाएँ और विचार उन्हीं अनुभवों से जन्म लेते हैं जो हम सबने कभी न कभी महसूस किए हैं — कभी खुशी, कभी उलझन, कभी समाज से जुड़े सवाल।
          </p>
          
          <p>
            मेरे लेखन का उद्देश्य किसी को पढ़ाना या समझाना नहीं, बल्कि जोड़ना है — एक भावनात्मक पुल बनाना जो दिलों को छू जाए। जब कोई मेरी पंक्तियों में खुद को देखता है, अपने सवाल ढूँढता है या अपनी खामोशी को आवाज़ मिलती है, तो लगता है कि लेखनी सार्थक हुई। यही जुड़ाव मेरी सबसे बड़ी प्रेरणा है।
          </p>
          
          <p>
            यह ब्लॉग मेरी उस यात्रा का विस्तार है जहाँ हर शब्द, हर विचार एक पड़ाव है। मैं चाहता हूँ कि आप इस यात्रा का हिस्सा बनें — रुकें, सोचें, मुस्कुराएँ और आगे बढ़ें।
          </p>
          
          <blockquote className="italic mt-8 text-center p-6 rounded-lg shadow-sm border-l-4">
            <p className="mb-2">
              "मंजिल मिलेगी, भटक कर ही सही;<br />
              गुमराह तो वो हैं, जो घर से निकले ही नहीं।"
            </p>
            <cite className="text-sm">— हरिवंश राय बच्चन</cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
