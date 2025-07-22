import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import HomePage from './pages/HomePage';
import AboutClepsydra from './pages/AboutClepsydra';
import AboutPath4Med from './pages/AboutPath4Med';
import Tasks from './pages/Tasks';
import Partners from './pages/Partners';
import Resources from './pages/Resources';
import Reports from './pages/Reports';
import Timeline from './pages/Timeline';
import Visual from './pages/Visual';
import RealConditions from './pages/RealConditions';
import DataBibliography from './pages/DataBibliography';
import Layout from './components/Layout';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about-c" element={<AboutClepsydra />} />
            <Route path="/about-p" element={<AboutPath4Med />} />
            <Route path="/tarefas" element={<Tasks />} />
            <Route path="/parceiros" element={<Partners />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/visual" element={<Visual />} />
            <Route path="/condicoes-reais" element={<RealConditions />} />
            <Route path="/biblio-dados" element={<DataBibliography />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
