import React from 'react';
import { Download, FileText, Database, ChartBar } from 'lucide-react';

const DataBibliography: React.FC = () => {
  const downloads = [
    {
      title: 'Precipitação (CSV)',
      url: 'https://drive.google.com/file/d/1JHshXWcRano7IFRn9zK0U-TZW5O4Z6YS/view?usp=sharing',
      icon: Download
    },
    {
      title: 'Concentração de Nitratos (CSV)',
      url: 'https://drive.google.com/file/d/1TvsLe6_yz6PUkLbGkKCeNI64n-k4pmYw/view?usp=sharing',
      icon: Download
    },
    {
      title: 'Condutividade Elétrica (CSV)',
      url: 'https://drive.google.com/file/d/1RiQHOOydlDOzvBnpGKzcT6p6Z0oOWv3M/view?usp=sharing',
      icon: Download
    },
    {
      title: 'Piezometria (CSV)',
      url: 'https://drive.google.com/file/d/1IMczBMfrlOhqPsJrYshbijUGgkuFLsPK/view?usp=sharing',
      icon: Download
    },
    {
      title: 'Consumo de Rega Estimados (CSV)',
      url: 'https://drive.google.com/file/d/12hmOJ59t2uQP7L5P-0-ZJKci8LKGVJ8R/view?usp=sharing',
      icon: Download
    },
    {
      title: 'Temperaturas (CSV)',
      url: 'https://drive.google.com/file/d/1C8OjPBl1EO1Q4ssBE1_t7kFKnnWwAYr6/view?usp=sharing',
      icon: Download
    }
  ];

  return (
    <div className="flex flex-col flex-grow container mx-auto px-6 py-12 pt-24">
      <section className="mb-12 mt-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Informação dos Dados
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Na presente tarefa do projeto Clepsydra, pretende desenvolver-se uma base de dados que centralize informação atualmente dispersa e a disponibilize de forma estruturada e orientada para a aplicação prática, relevante para o estudo da água subterrânea na Zona Vulnerável do Tejo, em contexto agrícola. As séries históricas de dados recolhidas foram analisadas quanto à sua qualidade e consistência, tendo sido posteriormente organizadas na base de dados. Parte da informação já se encontra disponível em plataformas existentes, como o SNIRH, enquanto outra foi estimada no âmbito do projeto. Esta base de dados será disponibilizada aos stakeholders e à comunidade científica, com o objetivo de apoiar os estudos a desenvolver na Zona Vulnerável do Tejo.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Caixa de Downloads */}
          <div className="bg-white p-6 rounded-lg shadow-md flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Database className="mr-2 text-blue-600" size={20} />
              Download de Dados
            </h3>
            <ul className="space-y-2">
              {downloads.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="flex items-center">
                    <Icon className="mr-2 text-blue-600" size={16} />
                    <a
                      href={item.url}
                      className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Caixa de Informações */}
          <div className="bg-white p-6 rounded-lg shadow-md flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="mr-2 text-blue-600" size={20} />
              Informações Técnicas
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start">
                <ChartBar className="mr-2 text-blue-600 mt-1" size={16} />
                <div>
                  <strong>Formato dos Dados:</strong> CSV (Comma-Separated Values)
                </div>
              </div>
              <div className="flex items-start">
                <ChartBar className="mr-2 text-blue-600 mt-1" size={16} />
                <div>
                  <strong>Fonte:</strong> SNIRH e estimativas do projeto
                </div>
              </div>
              <div className="flex items-start">
                <ChartBar className="mr-2 text-blue-600 mt-1" size={16} />
                <div>
                  <strong>Região:</strong> Zona Vulnerável do Tejo
                </div>
              </div>
              <div className="flex items-start">
                <ChartBar className="mr-2 text-blue-600 mt-1" size={16} />
                <div>
                  <strong>Contexto:</strong> Agricultura e gestão de recursos hídricos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas dos Dados */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Dados Disponíveis</h4>
            <p className="text-3xl font-bold text-blue-700">6</p>
            <p className="text-blue-600 text-sm">Tipos de dados diferentes</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h4 className="text-lg font-semibold text-green-900 mb-2">Qualidade</h4>
            <p className="text-3xl font-bold text-green-700">95%</p>
            <p className="text-green-600 text-sm">Dados validados</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h4 className="text-lg font-semibold text-purple-900 mb-2">Cobertura</h4>
            <p className="text-3xl font-bold text-purple-700">100%</p>
            <p className="text-purple-600 text-sm">Zona Vulnerável do Tejo</p>
          </div>
        </div>
      </section>
      
      {/* Friso colorido */}
      <div 
        className="w-full h-8" 
        style={{ 
          background: 'linear-gradient(to right, #17479e, #0e6bb5, #0093d3, #5a5a8c, #c1272d, #ff6f1f, #d6b08c, #a3bfa8, #4a2c0a)' 
        }}
      />
      
      {/* Footer */}
      <footer className="bg-white py-4 px-6 shadow mt-8">
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

export default DataBibliography; 