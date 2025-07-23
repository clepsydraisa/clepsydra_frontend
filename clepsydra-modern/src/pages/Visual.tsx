import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js';

// Registrar o plugin de zoom
Chart.register(zoomPlugin);

interface WellData {
  coord: [number, number];
  data: Array<{
    date: string;
    profundidade?: number;
    nitrato?: number;
  }>;
}

interface SampleDataType {
  [key: string]: {
    [codigo: string]: WellData;
  };
}

const Visual: React.FC = () => {
  const [selectedVariable, setSelectedVariable] = useState('profundidade');
  const [selectedPoint, setSelectedPoint] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [showTrendAnalysis, setShowTrendAnalysis] = useState(false);
  const [trendData, setTrendData] = useState<any>(null);
  const [currentChart, setCurrentChart] = useState<Chart | null>(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [infoTableData, setInfoTableData] = useState<any>(null);
  
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);

  const variables = [
    { value: 'profundidade', label: 'Profundidade', icon: 'fa-tint', color: 'blue' },
    { value: 'nitrato', label: 'Nitratos', icon: 'fa-flask', color: 'green' },
    { value: 'precipitacao', label: 'Precipitação', icon: 'fa-cloud-rain', color: 'cyan' },
    { value: 'rega', label: 'Rega', icon: 'fa-tint', color: 'blue' },
    { value: 'temperaturas', label: 'Temperaturas', icon: 'fa-thermometer-half', color: 'red' },
    { value: 'caudal', label: 'Caudal', icon: 'fa-water', color: 'blue' }
  ];

  // Dados de exemplo (simulando os dados do CSV)
  const sampleData: SampleDataType = {
    profundidade: {
      '377/001': {
        coord: [39.5, -8.0],
        data: [
          { date: '2020-01-01', profundidade: 45.2 },
          { date: '2020-06-01', profundidade: 42.1 },
          { date: '2021-01-01', profundidade: 47.8 },
          { date: '2021-06-01', profundidade: 44.3 },
          { date: '2022-01-01', profundidade: 49.1 }
        ]
      },
      '377/002': {
        coord: [39.3, -8.2],
        data: [
          { date: '2020-01-01', profundidade: 38.5 },
          { date: '2020-06-01', profundidade: 35.2 },
          { date: '2021-01-01', profundidade: 41.7 },
          { date: '2021-06-01', profundidade: 37.9 },
          { date: '2022-01-01', profundidade: 43.2 }
        ]
      }
    },
    nitrato: {
      '377/001': {
        coord: [39.5, -8.0],
        data: [
          { date: '2020-01-01', nitrato: 25.3 },
          { date: '2020-06-01', nitrato: 28.7 },
          { date: '2021-01-01', nitrato: 22.1 },
          { date: '2021-06-01', nitrato: 30.4 },
          { date: '2022-01-01', nitrato: 26.8 }
        ]
      }
    }
  };

  useEffect(() => {
    // Inicializar mapa quando o componente montar
    if (typeof window !== 'undefined' && (window as any).L) {
      initMap();
    }
  }, []);

  useEffect(() => {
    // Atualizar mapa quando a variável mudar
    if (mapRef.current) {
      updateMap();
      updateWellFilter();
    }
  }, [selectedVariable]);

  const initMap = () => {
    if (mapRef.current) return;
    
    const L = (window as any).L;
    mapRef.current = L.map('map').setView([39.5, -8], 8);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);
    
    markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
  };

  const clearMarkers = () => {
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }
  };

  const getVariableConfig = (variable: string) => {
    return variables.find(v => v.value === variable) || variables[0];
  };

  const updateMap = () => {
    clearMarkers();
    const data = sampleData[selectedVariable];
    if (!data) return;

    const L = (window as any).L;
    const variableConfig = getVariableConfig(selectedVariable);
    
    Object.entries(data).forEach(([codigo, well]) => {
      // Criar marcador personalizado com ícone
      const marker = L.marker(well.coord, {
        icon: L.AwesomeMarkers.icon({
          icon: variableConfig.icon,
          markerColor: variableConfig.color,
          prefix: 'fa'
        })
      });
      
      marker.addTo(markersLayerRef.current).on('click', () => {
        openChartModal(codigo, well);
      });
    });
  };

  const updateWellFilter = () => {
    const data = sampleData[selectedVariable];
    if (!data) return;
    
    const codes = Object.keys(data);
    // Aqui você pode atualizar as opções do select se necessário
  };

  const openChartModal = (codigo: string, well: WellData) => {
    setModalTitle(`Poço ${codigo}`);
    setShowModal(true);
    
    // Simular carregamento do gráfico
    setTimeout(() => {
      if (chartRef.current) {
        createChart(codigo, well);
      }
    }, 100);
  };

  const createChart = (codigo: string, well: WellData) => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (currentChart) {
      currentChart.destroy();
    }

    const newChart = new Chart(ctx, {
      type: selectedVariable === 'profundidade' ? 'line' : 'scatter',
      data: {
        datasets: [{
          label: selectedVariable === 'profundidade' ? 'Profundidade Nível Água (m)' : 'Nitrato (mg/L)',
          data: well.data.map((d) => ({
            x: new Date(d.date),
            y: selectedVariable === 'profundidade' ? d.profundidade : d.nitrato
          })),
          borderColor: selectedVariable === 'profundidade' ? '#007bff' : '#28a745',
          backgroundColor: selectedVariable === 'profundidade' ? 'rgba(0,123,255,0.2)' : '#28a745',
          fill: selectedVariable === 'profundidade' ? 'start' : false,
          tension: 0.2,
          showLine: selectedVariable !== 'profundidade'
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'year',
              tooltipFormat: 'yyyy-MM-dd'
            },
            title: { display: true, text: 'Data' }
          },
          y: {
            title: { 
              display: true, 
              text: selectedVariable === 'profundidade' ? 'Profundidade (m)' : 'Nitrato (mg/L)'
            },
            reverse: selectedVariable === 'profundidade',
            min: 0
          }
        },
        plugins: {
          zoom: {
            pan: { enabled: true, mode: 'x' },
            zoom: {
              mode: 'x',
              drag: { enabled: true },
              wheel: { enabled: true }
            }
          }
        }
      }
    });
    
    setCurrentChart(newChart as any);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowTrendAnalysis(false);
    setTrendData(null);
    if (currentChart) {
      currentChart.destroy();
      setCurrentChart(null);
    }
  };

  const resetZoom = () => {
    if (currentChart) {
      currentChart.resetZoom();
    }
  };

  const toggleTrendAnalysis = () => {
    setShowTrendAnalysis(!showTrendAnalysis);
    // Aqui você pode carregar dados de tendência se necessário
  };

  const toggleInfo = () => {
    setInfoVisible(!infoVisible);
    if (!infoVisible) {
      // Simular carregamento da tabela de info
      setInfoTableData({
        profundidade: {
          '377/001': { tendencia: 'Aumento da profundidade', periodo: '2020-2022' },
          '377/002': { tendencia: 'Diminuição da profundidade', periodo: '2020-2022' }
        }
      });
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
        <div className="mb-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="variableFilter" className="font-semibold text-blue-900 whitespace-nowrap">
              Variável:
            </label>
            <select
              id="variableFilter"
              value={selectedVariable}
              onChange={(e) => setSelectedVariable(e.target.value)}
              className="border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[140px] appearance-none bg-white bg-no-repeat bg-right pr-8"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              {variables.map(variable => (
                <option key={variable.value} value={variable.value}>
                  {variable.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="wellFilter" className="font-semibold text-blue-900 whitespace-nowrap">
              Pontos:
            </label>
            <select
              id="wellFilter"
              value={selectedPoint}
              onChange={(e) => setSelectedPoint(e.target.value)}
              className="border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[120px] appearance-none bg-white bg-no-repeat bg-right pr-8"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="">Todos</option>
              {sampleData[selectedVariable] && 
                Object.keys(sampleData[selectedVariable]).map(codigo => (
                  <option key={codigo} value={codigo}>{codigo}</option>
                ))
              }
            </select>
          </div>
        </div>

        {/* Mapa */}
        <div id="map" style={{ height: '500px' }}></div>
        
        {/* Botão Info */}
        <div className="mt-2 flex flex-col items-start">
          <button 
            onClick={toggleInfo}
            className="px-4 py-2 bg-gray-100 text-blue-800 rounded hover:bg-gray-200 font-semibold transition"
          >
            {infoVisible ? '× Fechar Info' : '+ Info'}
          </button>
          
          {infoVisible && infoTableData && (
            <div className="mt-2 w-full">
              <table className="min-w-full border mt-2 text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Poço</th>
                    <th className="border px-2 py-1">Período</th>
                    <th className="border px-2 py-1">Tendência</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(infoTableData[selectedVariable] || {}).map(([codigo, data]: [string, any]) => (
                    <tr key={codigo}>
                      <td className="border px-2 py-1">
                        <button 
                          className="show-chart-btn" 
                          title="Ver gráfico"
                          onClick={() => {
                            const well = sampleData[selectedVariable]?.[codigo];
                            if (well) openChartModal(codigo, well);
                          }}
                        >
                          📈
                        </button>
                        {codigo}
                      </td>
                      <td className="border px-2 py-1">{data.periodo}</td>
                      <td className="border px-2 py-1">{data.tendencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de gráfico */}
      {showModal && (
        <div className="chart-modal">
          <div className="bg-white p-6 rounded shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 text-2xl"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-lg font-bold mb-2">{modalTitle}</h2>
            
            <div className="mb-2 text-sm text-gray-600">
              Use o <strong>scroll do mouse</strong> para dar zoom,
              <strong>clique e arraste</strong> para selecionar uma área.<br />
              <button
                onClick={resetZoom}
                className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
              >
                Resetar Zoom
              </button>
              {selectedVariable === 'profundidade' && (
                <button
                  onClick={toggleTrendAnalysis}
                  className="mt-2 ml-2 px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
                >
                  {showTrendAnalysis ? 'Fechar análise de tendência' : 'Análise de tendência'}
                </button>
              )}
            </div>
            
            <div className="flex flex-row">
              <canvas 
                ref={chartRef}
                id="wellChart" 
                width="400" 
                height="300"
                style={{ maxWidth: '70vw', maxHeight: '70vh' }}
              ></canvas>
              
              {showTrendAnalysis && (
                <div className="ml-6 p-4 bg-gray-50 border border-gray-200 rounded shadow text-xs" style={{ minWidth: '220px', maxWidth: '320px' }}>
                  <div className="trend-title">Análise de tendência</div>
                  <div className="trend-period-card">
                    <div><strong>Período 1:</strong> 2020-01-01 a 2022-01-01</div>
                    <div className="trend-type-up">Aumento da profundidade</div>
                    <div className="trend-value">0.015 m ano<sup>-1</sup></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visual; 