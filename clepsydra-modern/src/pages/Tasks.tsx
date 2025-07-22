import React from 'react';

const Tasks: React.FC = () => {
  const tasks = [
    {
      id: 1,
      title: 'Tarefa 1',
      description: 'Desenvolvimento de ferramentas para monitorização e obtenção dados e identificação de lacunas.',
      highlightedWords: ['monitorização e obtenção dados', 'identificação de lacunas']
    },
    {
      id: 2,
      title: 'Tarefa 2',
      description: 'Criação ou melhoria/atualização de rede de monitorização (geração de dados)',
      highlightedWords: ['melhoria/atualização'],
      italicWords: ['geração de dados']
    },
    {
      id: 3,
      title: 'Tarefa 3',
      description: 'Observações em condições reais – Living Lab',
      highlightedWords: ['Observações em condições reais']
    },
    {
      id: 4,
      title: 'Tarefa 4',
      description: 'Capacitação e sensibilização social',
      highlightedWords: []
    }
  ];

  const renderDescription = (description: string, highlightedWords: string[], italicWords: string[] = []) => {
    let result = description;
    
    // Aplicar destaque às palavras destacadas
    highlightedWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      result = result.replace(regex, '<span class="text-blue-700 font-medium">$1</span>');
    });
    
    // Aplicar itálico às palavras em itálico
    italicWords.forEach(word => {
      const regex = new RegExp(`\\((${word})\\)`, 'gi');
      result = result.replace(regex, '<span class="italic">($1)</span>');
    });
    
    return result;
  };

  return (
    <div className="flex-grow w-full py-12 pt-24" style={{ backgroundColor: '#174192' }}>
      <div className="relative w-full flex-grow min-h-[60vh] flex items-center justify-start mt-6" style={{ minHeight: '600px' }}>
        {/* Mapa como background decorativo */}
        <div className="absolute right-0 top-0 h-[65vh] w-[900px] max-w-[60vw] pointer-events-none select-none z-0 overflow-hidden flex items-center justify-end">
          <img 
            src="https://github.com/clepsydraisa/clepsydra_isa/blob/main/images/europa_clep.png?raw=true" 
            alt="Europa Clepsydra" 
            className="h-full w-auto object-contain object-right" 
          />
        </div>
        
        {/* Boxes das tarefas em grid */}
        <div className="relative z-10 flex flex-1 flex-col justify-center md:block w-full max-w-4xl pl-4 md:pl-16" style={{ height: '65vh', minHeight: '420px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full content-center">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className="bg-white bg-opacity-95 rounded-xl p-6 flex flex-col justify-center gap-2 border border-gray-100 items-start w-[600px] h-[220px] transition-all duration-200 cursor-pointer hover:opacity-80"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-base">
                    {task.id}
                  </div>
                  <span className="text-blue-900 text-base font-semibold">{task.title}</span>
                </div>
                <span 
                  className="text-gray-700 text-sm font-normal leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: renderDescription(task.description, task.highlightedWords, task.italicWords) 
                  }}
                />
              </div>
            ))}
          </div>
        </div>
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

export default Tasks; 