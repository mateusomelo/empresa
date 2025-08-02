import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';

const NewTicket = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_type_id: '',
    client_id: '',
    priority: 'media'
  });
  const [serviceTypes, setServiceTypes] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const priorities = [
    { value: 'baixa', label: 'Baixa' },
    { value: 'media', label: 'Média' },
    { value: 'alta', label: 'Alta' }
  ];

  useEffect(() => {
    fetchServiceTypes();
    fetchClients();
  }, []);

  const fetchServiceTypes = async () => {
    try {
      const response = await fetch('/api/service-types', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setServiceTypes(data);
      }
    } catch (error) {
      console.error('Erro ao buscar tipos de serviço:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/dashboard');
      } else {
        setError(data.error || 'Erro ao criar chamado');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold">Novo Chamado</h1>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-300">
            <span>{user.username}</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Abrir Novo Chamado</CardTitle>
            <p className="text-gray-400">
              Descreva seu problema ou solicitação detalhadamente para que possamos ajudá-lo da melhor forma.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">
                    Título do Chamado *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Resumo do problema ou solicitação"
                    value={formData.title}
                    onChange={handleChange}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_type_id" className="text-gray-300">
                    Tipo de Serviço *
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('service_type_id', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Selecione o tipo de serviço" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {serviceTypes.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()} className="text-white hover:bg-gray-700">
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="client_id" className="text-gray-300">
                    Cliente
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('client_id', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Selecione o cliente (opcional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()} className="text-white hover:bg-gray-700">
                          {client.name} - {client.company || client.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-gray-300">
                    Prioridade
                  </Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => handleSelectChange('priority', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value} className="text-white hover:bg-gray-700">
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Descrição Detalhada *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva detalhadamente o problema, erro ou solicitação. Inclua informações como:
- Quando o problema começou
- Passos para reproduzir o erro
- Mensagens de erro (se houver)
- Impacto no trabalho
- Qualquer tentativa de solução já realizada"
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 min-h-32"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700"
                  disabled={loading}
                >
                  {loading ? (
                    'Criando...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Criar Chamado
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-gray-900 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">Dicas para um bom chamado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2">Seja Específico</h4>
                <p className="text-gray-400">
                  Forneça detalhes claros sobre o problema, incluindo mensagens de erro e contexto.
                </p>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2">Passos para Reproduzir</h4>
                <p className="text-gray-400">
                  Liste os passos que levaram ao problema para que possamos reproduzi-lo.
                </p>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2">Impacto no Negócio</h4>
                <p className="text-gray-400">
                  Explique como o problema afeta seu trabalho ou a operação da empresa.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewTicket;

