import React, { useState } from 'react';
import irrocloudLogo from '../assets/images/irrocloud.png';
import myirrigationLogo from '../assets/images/myirrigation.png';
import image1 from '../assets/images/1.JPG';
import image2 from '../assets/images/2.JPG';
import image3 from '../assets/images/3.JPG';
import image4 from '../assets/images/4.JPG';
import image5 from '../assets/images/5.jpg';
import image6 from '../assets/images/6.jpg';
import image7 from '../assets/images/7.jpg';
import image8 from '../assets/images/8.jpg';
import image9 from '../assets/images/9.jpg';
import image10 from '../assets/images/10.jpg';
import image11 from '../assets/images/11.jpeg';
import image12 from '../assets/images/12.jpg';
import image13 from '../assets/images/13.jpg';
import image14 from '../assets/images/14.jpg';
import image15 from '../assets/images/15.jpg';
import image16 from '../assets/images/16.jpg';

const RealConditions: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    image1, image2, image3, image4, image5, image6, image7, image8,
    image9, image10, image11, image12, image13, image14, image15, image16
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="flex-grow w-full py-12 pt-24 bg-white">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Observações em Condições Reais</h1>
        
        <div className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            O local experimental português localiza-se na Quinta da Cholda, no Concelho da Golegã. 
            Aqui testam-se dois protocolos de monitorização: a) água subterrânea (profundidade, 
            concentração de nitratos e condutividade elétrica); b) zona não saturada do solo 
            (fluxos de água e de azoto).
          </p>
        </div>

        {/* Image Carousel */}
        <div className="mb-12">
          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={`Imagem ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>

        {/* Data Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sonda Diver</h3>
            <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Dados da sonda diver</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recolha de Dados</h3>
            <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Dados de recolha</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tensiómetros</h3>
            <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Dados dos tensiómetros</p>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-gray-50 rounded-lg p-8">
          <p className="text-lg text-gray-700 mb-6">
            A experimentação é suportada pelas plataformas Irrocloud e myIrrigation. 
            Estas permitem monitorizar remotamente a humidade do solo (teor de água e potencial de água).
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <img 
                src={irrocloudLogo} 
                alt="Irrocloud Logo" 
                className="h-16 mx-auto mb-4"
                loading="lazy"
              />
              <a 
                href="https://irrocloud.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Irrocloud
              </a>
            </div>
            
            <div className="text-center">
              <img 
                src={myirrigationLogo} 
                alt="MyIrrigation Logo" 
                className="h-16 mx-auto mb-4"
                loading="lazy"
              />
              <a 
                href="https://myirrigation.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                MyIrrigation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealConditions; 