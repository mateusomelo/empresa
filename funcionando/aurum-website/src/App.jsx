import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Button } from './components/ui/button';
import { LogIn } from 'lucide-react';

// Importando componentes
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewTicket from './components/NewTicket';
import TicketDetail from './components/TicketDetail';

// Importando as imagens
import heroImage from './assets/hero_section.png';
import companyImage from './assets/company_profile.png';
import servicesImage from './assets/services_section.png';
import clientsImage from './assets/clients_section.png';
import clientsImage1 from './assets/bestguest.png';
import clientsImage2 from './assets/clients_section-CiY21EiB.png';
import contactImage from './assets/contact_section.png';

function HomePage({ onLoginClick }) {
  const clientsData = [
    { name: "TechCorp", orimage: clientsImage, alt: "TechCorp" },
    { name: "BestGuestHotel", image: clientsImage1, alt: "InovaLabs" },
    { name: "DataGuard", image: clientsImage2, alt: "DataGuard" },
    { name: "TechCorp", orimage: clientsImage, alt: "TechCorp" },
    { name: "InovaLabs", image: clientsImage1, alt: "InovaLabs" },
    { name: "DataGuard", image: clientsImage2, alt: "DataGuard" },
  ];

  const [currentClientIndex, setCurrentClientIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentClientIndex((prevIndex) => 
        (prevIndex + 1) % clientsData.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [clientsData.length]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header com botão de login */}
      <nav className="absolute top-0 right-0 z-20 p-6">
        <Button
          onClick={onLoginClick}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <div className="w-16 h-16 bg-cyan-400 mx-auto mb-6 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white rounded"></div>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Aurum
          </h1>
          <h2 className="text-2xl md:text-3xl font-light mb-8">
            Soluções Integradas em T.I.
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            Inovação. Segurança. Valor.
          </p>
        </div>
      </section>

      {/* Company Profile Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={companyImage} 
                alt="Perfil da Empresa" 
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Perfil da Empresa
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Fundada com o propósito de revolucionar o cenário tecnológico, a Aurum Soluções Integradas em T.I. 
                é uma empresa dedicada a fornecer soluções tecnológicas completas e inovadoras. Desenvolvemos 
                soluções avançadas para otimizar a infraestrutura e segurança digital de nossos clientes, 
                garantindo excelência e confiabilidade.
              </p>
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 text-lg rounded-lg transition-colors">
                Saiba Mais
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white">
                Nossos Serviços
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <span className="bg-cyan-600 text-white text-lg px-3 py-1 rounded-full font-bold">01</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Consultoria em T.I.</h3>
                    <p className="text-gray-300">
                      Oferecemos consultoria especializada para otimizar sua infraestrutura e processos de T.I.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="bg-cyan-600 text-white text-lg px-3 py-1 rounded-full font-bold">02</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Segurança da Informação</h3>
                    <p className="text-gray-300">
                      Proteja seus dados e sistemas com nossas soluções avançadas de cibersegurança.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="bg-cyan-600 text-white text-lg px-3 py-1 rounded-full font-bold">03</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Desenvolvimento de Software</h3>
                    <p className="text-gray-300">
                      Criamos soluções de software personalizadas para atender às suas necessidades de negócio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src={servicesImage} 
                alt="Nossos Serviços" 
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center text-white">
            Nossos Clientes
          </h2>
          <p className="text-lg text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            Desde o começo, prestamos serviços de confiança a nossos clientes. Tivemos a honra de 
            sermos a primeira empresa na escolha das seguintes corporações:
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800 rounded-lg p-6 text-center transition-opacity duration-1000 ease-in-out">
              <img 
                src={clientsData[currentClientIndex].image} 
                alt={clientsData[currentClientIndex].alt} 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-white">{clientsData[currentClientIndex].name}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                Vamos trabalhar juntos.
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 text-cyan-400">📍</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Endereço</h3>
                    <p className="text-gray-300">Rua das Inovações, 123 - Centro Empresarial, SP</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 text-cyan-400">📞</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Telefone</h3>
                    <p className="text-gray-300">(11) 3456-7890</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 text-cyan-400">✉️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">E-mail</h3>
                    <p className="text-gray-300">contato@aurum-ti.com.br</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src={contactImage} 
                alt="Vamos trabalhar juntos" 
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Aurum - Soluções Integradas em T.I. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            user ? 
            <Navigate to="/dashboard" /> : 
            <HomePage onLoginClick={() => window.location.href = '/login'} />
          } 
        />
        <Route 
          path="/login" 
          element={
            user ? 
            <Navigate to="/dashboard" /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            user ? 
            <Dashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/tickets/new" 
          element={
            user ? 
            <NewTicket user={user} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/tickets/:id" 
          element={
            user ? 
            <TicketDetail user={user} /> : 
            <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

