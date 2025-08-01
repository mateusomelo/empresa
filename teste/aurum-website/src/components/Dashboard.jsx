import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  User, 
  LogOut, 
  Plus, 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Home,
  Users,
  Building2
} from 'lucide-react';
import UserManagement from './UserManagement';
import ClientManagement from './ClientManagement';
import ServiceTypeManagement from './ServiceTypeManagement';

const Dashboard = ({ user, onLogout }) => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets', {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/tickets/stats', {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      onLogout();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aberto':
        return 'bg-red-600';
      case 'em_andamento':
        return 'bg-yellow-600';
      case 'fechado':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta':
        return 'text-red-400';
      case 'media':
        return 'text-yellow-400';
      case 'baixa':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getServiceTypeLabel = (serviceType) => {
    switch (serviceType) {
      case 'consultoria':
        return 'Consultoria em T.I.';
      case 'seguranca':
        return 'Segurança da Informação';
      case 'desenvolvimento':
        return 'Desenvolvimento de Software';
      default:
        return serviceType;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-cyan-400 rounded flex items-center justify-center">
              <div className="w-4 h-4 border border-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-bold">Aurum T.I. - Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Início
            </Button>
            
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="h-4 w-4" />
              <span>{user.username}</span>
              <Badge className={`ml-2 ${
                user.profile === 'administrador' ? 'bg-purple-600' :
                user.profile === 'tecnico' ? 'bg-blue-600' : 'bg-green-600'
              }`}>
                {user.profile}
              </Badge>
            </div>
            
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-300 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total || 0}</p>
                </div>
                <Ticket className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Abertos</p>
                  <p className="text-2xl font-bold text-red-400">{stats.aberto || 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Em Andamento</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.em_andamento || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Fechados</p>
                  <p className="text-2xl font-bold text-green-400">{stats.fechado || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">
              {currentView === 'dashboard' && 'Meus Chamados'}
              {currentView === 'users' && 'Gerenciamento de Usuários'}
              {currentView === 'clients' && 'Gerenciamento de Clientes'}
              {currentView === 'service-types' && 'Gerenciamento de Tipos de Serviço'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Menu de navegação */}
            {user.profile === 'administrador' && (
              <>
                <Button
                  variant={currentView === 'users' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('users')}
                  className="text-sm"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Usuários
                </Button>
              </>
            )}
            
            {(user.profile === 'administrador' || user.profile === 'tecnico') && (
              <>
                <Button
                  variant={currentView === 'clients' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('clients')}
                  className="text-sm"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Clientes
                </Button>
              </>
            )}
            
            {user.profile === 'administrador' && (
              <Button
                variant={currentView === 'service-types' ? 'default' : 'outline'}
                onClick={() => setCurrentView('service-types')}
                className="text-sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Tipos de Serviço
              </Button>
            )}
            
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setCurrentView('dashboard')}
              className="text-sm"
            >
              <Ticket className="h-4 w-4 mr-2" />
              Chamados
            </Button>
            
            {currentView === 'dashboard' && (
              <Button
                onClick={() => navigate('/tickets/new')}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Chamado
              </Button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {currentView === 'dashboard' && (
            <>
              {tickets.length === 0 ? (
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhum chamado encontrado</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Clique em "Novo Chamado" para criar seu primeiro ticket
                    </p>
                  </CardContent>
                </Card>
              ) : (
                tickets.map((ticket) => (
                  <Card key={ticket.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                        onClick={() => navigate(`/tickets/${ticket.id}`)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">#{ticket.id} - {ticket.title}</h3>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                            <span className={`text-sm ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <p className="text-gray-400 mb-3">{ticket.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Serviço: {getServiceTypeLabel(ticket.service_type)}</span>
                            <span>Criado: {new Date(ticket.created_at).toLocaleDateString('pt-BR')}</span>
                            {ticket.assigned_user && (
                              <span>Responsável: {ticket.assigned_user}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}
          
          {currentView === 'users' && user.profile === 'administrador' && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <UserManagement />
            </div>
          )}
          
          {currentView === 'clients' && (user.profile === 'administrador' || user.profile === 'tecnico') && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <ClientManagement />
            </div>
          )}
          
          {currentView === 'service-types' && user.profile === 'administrador' && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <ServiceTypeManagement />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

