import React, { useState } from 'react';
import MapComponent from '../components/MapComponent';

const Visual: React.FC = () => {
  const [selectedVariable, setSelectedVariable] = useState('profundidade');
  const [selectedPoint, setSelectedPoint] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const variables = [
    { value: 'profundidade', label: 'Profundidade' },
    { value: 'nitrato', label: 'Nitratos' },
    { value: 'precipitacao', label: 'Precipitação' },
    { value: 'rega', label: 'Rega' },
    { value: 'temperaturas', label: 'Temperaturas' },
    { value: 'caudal', label: 'Caudal' }
  ];

  const sampleMarkers = [
    {
      position: [38.7223, -9.1393] as [number, number],
      title: 'Ponto 1 - Lisboa',
      description: 'Monitorização de profundidade e nitratos'
    },
    {
      position: [41.1579, -8.6291] as [number, number],
      title: 'Ponto 2 - Porto',
      description: 'Monitorização de precipitação e temperaturas'
    },
    {
      position: [37.0193, -7.9304] as [number, number],
      title: 'Ponto 3 - Faro',
      description: 'Monitorização de caudal e rega'
    },
    {
      position: [40.6405, -8.6538] as [number, number],
      title: 'Ponto 4 - Aveiro',
      description: 'Monitorização completa de todas as variáveis'
    }
  ];

  const infoData = {
    profundidade: {
      title: 'Informações sobre Profundidade',
      data: [
        { label: 'Média', value: '45.2m' },
        { label: 'Mínima', value: '12.1m' },
        { label: 'Máxima', value: '89.7m' },
        { label: 'Pontos monitorizados', value: '15' }
      ]
    },
    nitrato: {
      title: 'Informações sobre Nitratos',
      data: [
        { label: 'Média', value: '23.4 mg/L' },
        { label: 'Mínima', value: '5.2 mg/L' },
        { label: 'Máxima', value: '67.8 mg/L' },
        { label: 'Pontos monitorizados', value: '12' }
      ]
    }
  };

  return (
    <div className="flex-grow w-full py-12 pt-24">
      <div className="container mx-auto px-6 mt-6">
        {/* Breve texto explicativo */}
        <div className="mb-6 text-gray-700 text-base font-normal">
          Foi criada uma interface gráfica orientada para o utilizador, que permite explorar de forma dinâmica as tendências históricas das variáveis relevantes.
        </div>
        
        {/* Filtro de variáveis */}
        <div className="mb-4 flex items-center space-x-2 flex-wrap">
          <label htmlFor="variableFilter" className="font-semibold text-blue-900">
            Variável:
          </label>
          <select
            id="variableFilter"
            value={selectedVariable}
            onChange={(e) => setSelectedVariable(e.target.value)}
            className="border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {variables.map(variable => (
              <option key={variable.value} value={variable.value}>
                {variable.label}
              </option>
            ))}
          </select>
          
          <label htmlFor="wellFilter" className="font-semibold text-blue-900 ml-4">
            Pontos:
          </label>
          <select
            id="wellFilter"
            value={selectedPoint}
            onChange={(e) => setSelectedPoint(e.target.value)}
            className="border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[100px]"
          >
            <option value="">Todos</option>
            {sampleMarkers.map((marker, index) => (
              <option key={index} value={`ponto-${index + 1}`}>
                Ponto {index + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Mapa */}
        <div className="mb-4">
          <MapComponent 
            center={[39.5, -8]} 
            zoom={7} 
            markers={sampleMarkers}
          />
        </div>

        {/* Botão Info */}
        <div className="mt-2 flex flex-col items-start">
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="px-4 py-2 bg-gray-100 text-blue-800 rounded hover:bg-gray-200 font-semibold transition"
          >
            {showInfo ? '- Info' : '+ Info'}
          </button>
          
          {showInfo && (
            <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="font-semibold text-blue-900 mb-2">
                {infoData[selectedVariable as keyof typeof infoData]?.title || 'Informações'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {infoData[selectedVariable as keyof typeof infoData]?.data.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{item.label}:</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-clepsydra-blue mb-3">
              Estatísticas Gerais
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Projetos Ativos:</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Parceiros:</span>
                <span className="font-semibold">15+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Locais Monitorados:</span>
                <span className="font-semibold">25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Variáveis Analisadas:</span>
                <span className="font-semibold">6</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-clepsydra-blue mb-3">
              Tecnologias Utilizadas
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• React + TypeScript</li>
              <li>• Leaflet Maps</li>
              <li>• Tailwind CSS</li>
              <li>• Dados em Tempo Real</li>
              <li>• Análise de Tendências</li>
              <li>• Visualizações Interativas</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Friso colorido */}
      <div 
        className="w-full h-8 mt-8" 
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

export default Visual; 