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
      
      {/* Friso colorido */}
      <div 
        className="w-full h-8" 
        style={{ 
          background: 'linear-gradient(to right, #17479e, #0e6bb5, #0093d3, #5a5a8c, #c1272d, #ff6f1f, #d6b08c, #a3bfa8, #4a2c0a)' 
        }}
      />
      
      {/* Footer */}
      <footer className="bg-white py-4 px-6 shadow">
        <div className="container mx-auto flex justify-center items-center min-h-[80px]">
          <img 
            src="https://github.com/clepsydraisa/clepsydra_isa/blob/main/images/logo_footer_c.png?raw=true" 
            alt="Logos rodapé" 
            className="w-auto h-12" 
          />
        </div>
      </footer>
    </div>
  );
};

export default AboutClepsydra; 