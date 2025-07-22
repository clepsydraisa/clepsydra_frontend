import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const RealConditions: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const images = [
    {
      src: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/6.jpg',
      alt: 'Campo de milho',
      legend: 'Campo de milho'
    },
    {
      src: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/7.jpg',
      alt: 'Sonda diver',
      legend: 'Sonda diver instalada num furo para medição da profundidade da toalha freática'
    },
    {
      src: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/8.jpg',
      alt: 'Recolha de dados',
      legend: 'Recolha de dados do diver para o computador'
    },
    {
      src: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/2.JPG',
      alt: 'Tensiómetros',
      legend: 'Instalação de uma bateria de tensiómetros para medição do potencial de água no solo'
    },
    {
      src: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/9.jpg',
      alt: 'Bateria de tensiómetros',
      legend: 'Bateria de tensiómetros a diferentes profundidades'
    },
    {
      src: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/10.jpg',
      alt: 'Conexão à cloud',
      legend: 'Conexão à cloud'
    },
    {
      src: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/3.JPG',
      alt: 'Leituras no smartphone',
      legend: 'Leituras do potencial de água no smartphone'
    },
    {
      src: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/12.jpg',
      alt: 'Sonda FDR',
      legend: 'Instalação da sonda FDR de humidade do solo'
    },
    {
      src: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/13.jpg',
      alt: 'Envio remoto',
      legend: 'Envio remoto de informação'
    },
    {
      src: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/14.jpg',
      alt: 'Cápsulas para recolha',
      legend: 'Instalação das cápsulas para recolha da solução do solo e análise de nitratos'
    },
    {
      src: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/15.jpg',
      alt: 'Cápsulas porosas',
      legend: 'Instalação das cápsulas porosas 2'
    },
    {
      src: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/16.jpg',
      alt: 'Recolha da solução',
      legend: 'Recolha da solução do solo'
    }
  ];

  const platforms = [
    {
      name: 'Irrocloud',
      url: 'https://www.irrocloud.com/irrocloud/login/?next=/',
      image: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/irrocloud.png'
    },
    {
      name: 'myIrrigation',
      url: 'https://myirrigation.eu/login',
      image: 'https://raw.githubusercontent.com/clepsydraisa/clepsydra_isa/refs/heads/main/images/myirrigation.png'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleImageHover = (event: React.MouseEvent, legend: string) => {
    setTooltipContent(legend);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    setShowTooltip(true);
  };

  const handleImageLeave = () => {
    setShowTooltip(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex-grow w-full py-12 pt-24">
      <div className="container mx-auto px-6 mt-6">
        {/* Texto introdutório */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-blue-900 mb-4">
            Observações em Condições Reais
          </h2>
          <p className="text-gray-700 text-base leading-relaxed">
            O local experimental português localiza-se na Quinta da Cholda, no Concelho da Golegã. 
            Aqui testam-se dois protocolos de monitorização: <strong>a)</strong> água subterrânea 
            (profundidade, concentração de nitratos e condutividade elétrica); <strong>b)</strong> zona 
            não saturada do solo (fluxos de água e de azoto)
          </p>
        </section>

        {/* Carrossel de imagens */}
        <section className="mb-10">
          <div className="relative max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <div className="flex transition-transform duration-500 ease-in-out">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 w-full"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-96 object-cover"
                      onMouseEnter={(e) => handleImageHover(e, image.legend)}
                      onMouseLeave={handleImageLeave}
                    />
                  </div>
                ))}
              </div>
              
              {/* Controles do carrossel */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>

              {/* Indicadores */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Texto sobre ferramentas digitais */}
        <section className="mb-10">
          <p className="text-gray-700 text-base mb-6">
            A experimentação é suportada pelas plataformas Irrocloud e myIrrigation. 
            Estas permitem monitorizar remotamente a humidade do solo (teor de água e potencial de água).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {platforms.map((platform, index) => (
              <div key={index} className="flex flex-col items-center">
                <a 
                  href={platform.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group"
                >
                  <img 
                    src={platform.image} 
                    alt={platform.name} 
                    className="rounded-lg shadow-md w-full max-w-xs mb-2 hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="flex items-center justify-center">
                    <span className="text-blue-800 font-semibold mr-2">{platform.name}</span>
                    <ExternalLink className="w-4 h-4 text-blue-600 group-hover:text-blue-800" />
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Informações técnicas */}
        <section className="mb-10">
          <h3 className="text-2xl font-semibold text-blue-900 mb-4">
            Protocolos de Monitorização
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">
                Água Subterrânea
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Profundidade da toalha freática</li>
                <li>• Concentração de nitratos</li>
                <li>• Condutividade elétrica</li>
                <li>• Monitorização contínua</li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-green-900 mb-3">
                Zona Não Saturada
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Fluxos de água no solo</li>
                <li>• Fluxos de azoto</li>
                <li>• Potencial de água</li>
                <li>• Humidade do solo</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div
          className="fixed z-50 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm max-w-xs"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            pointerEvents: 'none'
          }}
        >
          {tooltipContent}
        </div>
      )}
      
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

export default RealConditions; 