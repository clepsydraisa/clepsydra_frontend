import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js';
import { fetchWellData, fetchWellHistory, utmToLatLng, WellData, checkSistemaAquiferoValues } from '../utils/supabase';

// Registrar o plugin de zoom
Chart.register(zoomPlugin);

interface WellDataWithChart extends WellData {
  coord?: [number, number];
  chartData?: Array<{
    date: string;
    value: number | null;
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
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [showTrendAnalysis, setShowTrendAnalysis] = useState(false);
  const [currentChart, setCurrentChart] = useState<Chart | null>(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [infoTableData, setInfoTableData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [wellData, setWellData] = useState<SampleDataType>({});
  const [sistemaAquiferoOptions, setSistemaAquiferoOptions] = useState<string[]>([]);
  
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

  useEffect(() => {
    // Inicializar mapa quando o componente montar
    if (typeof window !== 'undefined' && (window as any).L) {
      initMap();
    }
  }, []);

  useEffect(() => {
    // Carregar dados quando variável mudar
    loadWellData();
    loadSistemaAquiferoOptions();
  }, [selectedVariable]);

  useEffect(() => {
    // Carregar dados quando sistema aquífero mudar
    loadWellData();
    // Resetar ponto selecionado quando sistema aquífero mudar
    setSelectedPoint('');
  }, [selectedSistemaAquifero]);

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
      console.log(`Carregando dados para: ${selectedVariable} com sistema aquífero: ${selectedSistemaAquifero}`);
      
      const data = await fetchWellData(selectedVariable, selectedSistemaAquifero);
      console.log(`Dados recebidos: ${data.length} registros`);
      console.log('Primeiros 3 registros:', data.slice(0, 3));
      
      // Verificar se os dados estão filtrados corretamente
      if (selectedSistemaAquifero !== 'todos') {
        const filteredData = data.filter(well => well.sistema_aquifero === selectedSistemaAquifero);
        console.log(`Dados filtrados por sistema aquífero "${selectedSistemaAquifero}": ${filteredData.length} registros`);
        if (filteredData.length !== data.length) {
          console.warn('⚠️ Filtro não está a funcionar corretamente! Dados não filtrados na query.');
        }
      }
      
      // Converter dados para o formato esperado
      const processedData: SampleDataType = {};
      let validPoints = 0;
      let invalidPoints = 0;
      
      data.forEach((well) => {
        const codigo = well.codigo;
        
        // Validar coordenadas
        if (!isValidCoordinate(well.coord_x_m) || !isValidCoordinate(well.coord_y_m)) {
          console.log(`Coordenadas inválidas para poço ${codigo}:`, well.coord_x_m, well.coord_y_m);
          invalidPoints++;
          return; // Pular este poço
        }
        
        const [lat, lng] = utmToLatLng(well.coord_x_m, well.coord_y_m);
        
        // Validar valor da variável
        const value = getValueFromWell(well, selectedVariable);
        if (value === null) {
          console.log(`Valor inválido para poço ${codigo} e variável ${selectedVariable}:`, well);
          invalidPoints++;
          return; // Pular este poço
        }
        
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
              value: value
            }]
          };
          validPoints++;
        }
      });
      
      console.log(`Dados processados: ${validPoints} pontos válidos, ${invalidPoints} pontos inválidos`);
      console.log(`Poços únicos: ${Object.keys(processedData[selectedVariable] || {}).length}`);
      
      if (Object.keys(processedData[selectedVariable] || {}).length > 0) {
        const firstWell = Object.values(processedData[selectedVariable])[0];
        console.log('Exemplo de poço processado:', firstWell);
        console.log('Dados do gráfico:', firstWell.chartData);
      }
      
      setWellData(processedData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setWellData({});
    } finally {
      setLoading(false);
    }
  };

  const loadSistemaAquiferoOptions = async () => {
    try {
      const options = await checkSistemaAquiferoValues(selectedVariable);
      setSistemaAquiferoOptions(options);
      console.log('Sistemas aquíferos disponíveis:', options);
    } catch (error) {
      console.error('Erro ao carregar sistemas aquíferos:', error);
      setSistemaAquiferoOptions([]);
    }
  };

  // Função para limpar e validar valores numéricos
  const cleanNumber = (value: string | number | null | undefined): number | null => {
    if (value === null || value === undefined) return null;
    
    if (typeof value === 'string') {
      // Remove caracteres especiais, espaços, <, (, ), etc
      const cleaned = value.replace(/[<>()]/g, '').trim();
      if (cleaned === '') return null;
      
      const num = parseFloat(cleaned);
      return isNaN(num) ? null : num;
    }
    
    if (typeof value === 'number') {
      return isNaN(value) ? null : value;
    }
    
    return null;
  };

  // Função para validar coordenadas
  const isValidCoordinate = (coord: number | null | undefined): boolean => {
    return coord !== null && coord !== undefined && !isNaN(coord) && coord !== 0;
  };

  const getValueFromWell = (well: WellData, variable: string): number | null => {
    switch (variable) {
      case 'condutividade':
        return cleanNumber((well as any).condutividade);
      case 'nitrato':
        return cleanNumber((well as any).nitrato);
      case 'profundidade':
        // Usar profundidade_nivel_agua para o gráfico
        return cleanNumber((well as any).profundidade_nivel_agua);
      case 'precipitacao':
        return cleanNumber((well as any).precipitacao_dia_mm);
      default:
        return null;
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
    console.log(`Encontrados ${codes.length} pontos para ${selectedVariable}`);
  };

  const focusOnWell = (codigo: string) => {
    const data = wellData[selectedVariable];
    if (!data || !data[codigo] || !mapRef.current) return;
    
    const well = data[codigo];
    
    // Zoom para o ponto selecionado
    mapRef.current.setView(well.coord, 14);
    
    // Abrir modal do gráfico
    openChartModal(codigo, well);
  };

  const openChartModal = async (codigo: string, well: WellDataWithChart) => {
    setModalTitle(`Poço ${codigo}`);
    setShowModal(true);
    
    console.log(`Abrindo modal para poço ${codigo}`);
    console.log('Dados do poço:', well);
    
    // Carregar dados históricos do poço
    try {
      const historicalData = await fetchWellHistory(selectedVariable, codigo, 'todos');
      console.log(`Dados históricos recebidos: ${historicalData.length} registros`);
      console.log('Primeiros 3 registros históricos:', historicalData.slice(0, 3));
      
      const chartData = historicalData
        .map((record) => {
          const value = getValueFromWell(record, selectedVariable);
          if (value === null) return null;
          
          return {
            date: record.data,
            value: value
          };
        })
        .filter(item => item !== null); // Remover valores null
      
      console.log('Dados processados para gráfico:', chartData.slice(0, 5));
      console.log('Total de pontos no gráfico:', chartData.length);
      
      // Atualizar os dados do poço com o histórico
      const updatedWell = {
        ...well,
        chartData: chartData as Array<{ date: string; value: number | null }>
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

    console.log('Criando gráfico com dados:', chartData.length, 'pontos');
    console.log('Primeiros 3 pontos:', chartData.slice(0, 3));

    // Ordenar dados por data e filtrar valores válidos
    const sortedData = chartData
      .slice()
      .filter(d => d.value !== null && d.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log('Dados ordenados:', sortedData.length, 'pontos');
    console.log('Primeiros 3 pontos ordenados:', sortedData.slice(0, 3));

    const newChart = new Chart(ctx, {
      type: selectedVariable === 'profundidade' ? 'line' : 'scatter',
      data: {
        datasets: [{
          label: selectedVariable === 'profundidade' ? 'Profundidade Nível Água (m)' : `${variableConfig.label} (${getUnit(selectedVariable)})`,
          data: sortedData.map((d) => ({
            x: d.date,
            y: d.value
          })),
          borderColor: selectedVariable === 'profundidade' ? '#007bff' : variableConfig.color,
          backgroundColor: selectedVariable === 'profundidade' ? 'rgba(0,123,255,0.2)' : variableConfig.color,
          fill: selectedVariable === 'profundidade' ? 'start' : false,
          tension: 0.2,
          showLine: selectedVariable === 'profundidade',
          pointRadius: selectedVariable === 'profundidade' ? 3 : 4,
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
              text: selectedVariable === 'profundidade' ? 'Profundidade (m)' : `${variableConfig.label} (${getUnit(selectedVariable)})`
            },
            reverse: selectedVariable === 'profundidade', // Eixo Y invertido para profundidade
            min: 0,
            ticks: {
              callback: function(value) {
                return value; // Remover unidades, só mostrar o número
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
                const label = selectedVariable === 'profundidade' ? 'Profundidade Nível Água' : variableConfig.label;
                return `${label}: ${context.parsed.y} ${getUnit(selectedVariable)}`;
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

  const closeModal = () => {
    setShowModal(false);
    setShowTrendAnalysis(false);
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
              <option value="todos">Todos</option>
              {sistemaAquiferoOptions.map(option => (
                <option key={option} value={option}>
                  {option}
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
              onChange={(e) => {
                const codigo = e.target.value;
                setSelectedPoint(codigo);
                if (codigo) {
                  focusOnWell(codigo);
                } else {
                  // Zoom out para a vista inicial
                  if (mapRef.current) {
                    mapRef.current.setView([39.5, -8], 8);
                  }
                }
              }}
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
                  onClick={() => setShowTrendAnalysis(!showTrendAnalysis)}
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
              {showTrendAnalysis && selectedVariable === 'profundidade' && (
                <div
                  className="ml-6 p-4 bg-gray-50 border border-gray-200 rounded shadow text-xs"
                  style={{ minWidth: '220px', maxWidth: '320px' }}
                >
                  <div className="font-semibold text-base mb-2">Análise de tendência</div>
                  <div className="text-gray-600">
                    Funcionalidade de análise de tendência em desenvolvimento...
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