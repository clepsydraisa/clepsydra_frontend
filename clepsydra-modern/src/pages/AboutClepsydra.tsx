import React from 'react';

const AboutClepsydra: React.FC = () => {
  return (
    <div className="flex-grow w-full p-0 m-0 pt-24">
      <div className="w-full h-full flex justify-center items-center p-0 m-0">
        <img 
          src="https://github.com/clepsydraisa/clepsydra_isa/blob/main/images/pt5_bg.png?raw=true" 
          alt="Clepsydra Background" 
          className="object-contain"
          style={{ 
            width: '96vw', 
            height: 'calc(96vh - 96px - 32px - 80px)', 
            maxWidth: '1200px', 
            maxHeight: '80vh', 
            margin: '2vh 2vw' 
          }}
        />
      </div>
      

    </div>
  );
};

export default AboutClepsydra; 