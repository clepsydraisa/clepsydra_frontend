import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js';
import { fetchWellData, fetchWellHistory, utmToLatLng, WellData } from '../utils/supabase';

// Registrar o plugin de zoom
Chart.register(zoomPlugin);

interface WellDataWithChart extends WellData {
  coord?: [number, number];
  chartData?: Array<{
    date: string;
    value: number;
  }>;
}

interface SampleDataType {
  [key: string]: {
    [codigo: string]: WellDataWithChart;
  };
}

const Visual: React.FC = () => {
  const [selectedVariable, setSelectedVariable] = useState('profundidade');
  const [selectedPoint, setSelectedPoint] = useState('');
  const [selectedSistemaAquifero, setSelectedSistemaAquifero] = useState('todos');
  const [showInfo, setShowInfo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [showTrendAnalysis, setShowTrendAnalysis] = useState(false);
  const [trendData, setTrendData] = useState<any>(null);
  const [currentChart, setCurrentChart] = useState<Chart | null>(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [infoTableData, setInfoTableData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [wellData, setWellData] = useState<SampleDataType>({});
  
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);

  const variables = [
    { value: 'profundidade', label: 'Profundidade', icon: 'fa-tint', color: 'blue' },
    { value: 'nitrato', label: 'Nitratos', icon: 'fa-flask', color: 'green' },
    { value: 'condutividade', label: 'Condutividade', icon: 'fa-bolt', color: 'yellow' },
    { value: 'precipitacao', label: 'Precipitação', icon: 'fa-cloud-rain', color: 'cyan' },
    { value: 'rega', label: 'Rega', icon: 'fa-tint', color: 'blue' },
    { value: 'temperaturas', label: 'Temperaturas', icon: 'fa-thermometer-half', color: 'red' },
    { value: 'caudal', label: 'Caudal', icon: 'fa-water', color: 'blue' }
  ];

  const sistemasAquifero = [
    { value: 'todos', label: 'Todos' },
    { value: 'AL', label: 'AL - T7-Aluviões do Tejo' },
    { value: 'MD', label: 'MD - T1-Bacia do Tejo-Sado / Margem Direita' },
    { value: 'ME', label: 'ME - T3-Bacia do Tejo-Sado / Margem Esquerda' }
  ];

  useEffect(() => {
    // Inicializar mapa quando o componente montar
    if (typeof window !== 'undefined' && (window as any).L) {
      initMap();
    }
  }, []);

  useEffect(() => {
    // Carregar dados quando variável ou sistema aquífero mudar
    loadWellData();
  }, [selectedVariable, selectedSistemaAquifero]);

  useEffect(() => {
    // Atualizar mapa quando os dados mudarem
    if (mapRef.current && Object.keys(wellData).length > 0) {
      updateMap();
      updateWellFilter();
    }
  }, [wellData, selectedVariable]);

  const loadWellData = async () => {
    setLoading(true);
    try {
      const data = await fetchWellData(selectedVariable, selectedSistemaAquifero);
      
      // Converter dados para o formato esperado
      const processedData: SampleDataType = {};
      
      data.forEach((well) => {
        const codigo = well.codigo;
        const [lat, lng] = utmToLatLng(well.coord_x_m, well.coord_y_m);
        
        if (!processedData[selectedVariable]) {
          processedData[selectedVariable] = {};
        }
        
        // Se já existe um poço com este código, não duplicar
        if (!processedData[selectedVariable][codigo]) {
          processedData[selectedVariable][codigo] = {
            ...well,
            coord: [lat, lng],
            chartData: [{
              date: well.data,
              value: getValueFromWell(well, selectedVariable)
            }]
          };
        }
      });
      
      setWellData(processedData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Se houver erro, mostrar array vazio em vez de dados de teste
      setWellData({});
    } finally {
      setLoading(false);
    }
  };

  const getValueFromWell = (well: WellData, variable: string): number => {
    switch (variable) {
      case 'condutividade':
        return (well as any).condutividade || 0;
      case 'nitrato':
        return parseFloat((well as any).nitrato) || 0;
      case 'profundidade':
        return parseFloat((well as any).nivel_piezometrico) || 0;
      case 'precipitacao':
        return (well as any).precipitacao_dia_mm || 0;
      default:
        return 0;
    }
  };



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
    const data = wellData[selectedVariable];
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
    const data = wellData[selectedVariable];
    if (!data) return;
    
    const codes = Object.keys(data);
    console.log(`Encontrados ${codes.length} pontos para ${selectedVariable} com filtro ${selectedSistemaAquifero}`);
  };

  const openChartModal = async (codigo: string, well: WellDataWithChart) => {
    setModalTitle(`Poço ${codigo}`);
    setShowModal(true);
    
    // Carregar dados históricos do poço
    try {
      const historicalData = await fetchWellHistory(selectedVariable, codigo, selectedSistemaAquifero);
      
      const chartData = historicalData.map((record) => ({
        date: record.data,
        value: getValueFromWell(record, selectedVariable)
      }));
      
      // Atualizar os dados do poço com o histórico
      const updatedWell = {
        ...well,
        chartData: chartData
      };
      
      // Simular carregamento do gráfico
      setTimeout(() => {
        if (chartRef.current) {
          createChart(codigo, updatedWell);
        }
      }, 100);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      // Usar dados existentes se houver erro
      setTimeout(() => {
        if (chartRef.current) {
          createChart(codigo, well);
        }
      }, 100);
    }
  };

  const createChart = (codigo: string, well: WellDataWithChart) => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (currentChart) {
      currentChart.destroy();
    }

    const variableConfig = getVariableConfig(selectedVariable);
    const chartData = well.chartData || [];

    const newChart = new Chart(ctx, {
      type: selectedVariable === 'profundidade' ? 'line' : 'scatter',
      data: {
        datasets: [{
          label: `${variableConfig.label} (${getUnit(selectedVariable)})`,
          data: chartData.map((d) => ({
            x: new Date(d.date),
            y: d.value
          })),
          borderColor: getColorForVariable(selectedVariable),
          backgroundColor: getColorForVariable(selectedVariable, 0.2),
          fill: selectedVariable === 'profundidade' ? 'start' : false,
          tension: 0.2,
          showLine: selectedVariable !== 'profundidade',
          pointRadius: 3,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'year',
              tooltipFormat: 'yyyy-MM-dd',
              displayFormats: {
                year: 'yyyy',
                month: 'yyyy-MM',
                day: 'yyyy-MM-dd'
              }
            },
            title: { display: true, text: 'Data' },
            ticks: {
              maxTicksLimit: 10
            }
          },
          y: {
            title: { 
              display: true, 
              text: `${variableConfig.label} (${getUnit(selectedVariable)})`
            },
            reverse: selectedVariable === 'profundidade', // Eixo Y invertido para profundidade
            min: 0,
            ticks: {
              callback: function(value) {
                return value + ' ' + getUnit(selectedVariable);
              }
            }
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
          },
          tooltip: {
            callbacks: {
              title: function(context) {
                const date = new Date(context[0].parsed.x);
                return date.toLocaleDateString('pt-BR');
              },
              label: function(context) {
                return `${variableConfig.label}: ${context.parsed.y} ${getUnit(selectedVariable)}`;
              }
            }
          }
        }
      }
    });
    
    setCurrentChart(newChart as any);
  };

  const getUnit = (variable: string): string => {
    switch (variable) {
      case 'profundidade': return 'm';
      case 'nitrato': return 'mg/L';
      case 'condutividade': return 'µS/cm';
      case 'precipitacao': return 'mm';
      case 'temperaturas': return '°C';
      case 'caudal': return 'L/s';
      default: return '';
    }
  };

  const getColorForVariable = (variable: string, alpha = 1): string => {
    const colors: { [key: string]: string } = {
      profundidade: `rgba(0, 123, 255, ${alpha})`,
      nitrato: `rgba(40, 167, 69, ${alpha})`,
      condutividade: `rgba(255, 193, 7, ${alpha})`,
      precipitacao: `rgba(23, 162, 184, ${alpha})`,
      temperaturas: `rgba(220, 53, 69, ${alpha})`,
      caudal: `rgba(0, 123, 255, ${alpha})`
    };
    return colors[variable] || `rgba(108, 117, 125, ${alpha})`;
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
        
        {/* Filtros */}
        <div className="mb-4 flex items-center space-x-4 flex-wrap">
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
            <label htmlFor="sistemaAquiferoFilter" className="font-semibold text-blue-900 whitespace-nowrap">
              Sistema Aquífero:
            </label>
            <select
              id="sistemaAquiferoFilter"
              value={selectedSistemaAquifero}
              onChange={(e) => setSelectedSistemaAquifero(e.target.value)}
              className="border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[200px] appearance-none bg-white bg-no-repeat bg-right pr-8"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              {sistemasAquifero.map(sistema => (
                <option key={sistema.value} value={sistema.value}>
                  {sistema.label}
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
              {wellData[selectedVariable] && 
                Object.keys(wellData[selectedVariable]).map(codigo => (
                  <option key={codigo} value={codigo}>{codigo}</option>
                ))
              }
            </select>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-800">Carregando dados...</span>
            </div>
          </div>
        )}

        {/* Mensagem quando não há dados */}
        {!loading && (!wellData[selectedVariable] || Object.keys(wellData[selectedVariable] || {}).length === 0) && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="text-yellow-600">⚠️</div>
              <div className="text-yellow-800">
                <strong>Nenhum dado encontrado.</strong> 
                {!process.env.REACT_APP_SUPABASE_URL ? (
                  <span> Configure as variáveis de ambiente REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY para conectar à base de dados.</span>
                ) : (
                  <span> Verifique se existem dados na tabela correspondente para os filtros selecionados.</span>
                )}
              </div>
            </div>
          </div>
        )}

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
                            const well = wellData[selectedVariable]?.[codigo];
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