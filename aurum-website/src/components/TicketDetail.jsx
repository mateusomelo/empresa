import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  MessageSquare,
  Send,
  CheckCircle,
  UserCheck,
  Clock,
  AlertTriangle,
  User
} from 'lucide-react';

const TicketDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newResponse, setNewResponse] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [users, setUsers] = useState([]);

  const canEdit = user.profile === 'administrador' || user.profile === 'tecnico';
  const canClose = user.profile === 'administrador' || user.profile === 'tecnico';

  useEffect(() => {
    fetchTicket();
    fetchResponses();
    if (canEdit) {
      fetchUsers();
    }
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setTicket(data.ticket);
        setEditForm({
          title: data.ticket.title,
          description: data.ticket.description,
          priority: data.ticket.priority,
          status: data.ticket.status,
          assigned_to: data.ticket.assigned_to || ''
        });
      } else if (response.status === 404) {
        setTicket(null);
      }
    } catch (error) {
      console.error('Erro ao buscar ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async () => {
    try {
      const response = await fetch(`/api/tickets/${id}/responses`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setResponses(data.responses);
      }
    } catch (error) {
      console.error('Erro ao buscar respostas:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        const techUsers = data.filter(u => u.profile === 'tecnico' || u.profile === 'administrador');
        setUsers(techUsers);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        await fetchTicket();
        setEditing(false);
      } else {
        console.error('Erro ao salvar edição:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
    }
  };

  const handleAddResponse = async () => {
    if (!newResponse.trim()) return;

    try {
      const response = await fetch(`/api/tickets/${id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: newResponse,
          is_internal: isInternal
        }),
      });

      if (response.ok) {
        setNewResponse('');
        setIsInternal(false);
        await fetchResponses();
        await fetchTicket();
      } else {
        console.error('Erro ao adicionar resposta:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error);
    }
  };

  const handleCloseTicket = async () => {
    const closeMessage = prompt('Mensagem de fechamento (opcional):');
    
    try {
      const response = await fetch(`/api/tickets/${id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: closeMessage || ''
        }),
      });

      if (response.ok) {
        await fetchTicket();
        await fetchResponses();
      } else {
        console.error('Erro ao fechar ticket:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao fechar ticket:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Chamado não encontrado</div>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold">Chamado #{ticket.id}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {canEdit && ticket.status !== 'fechado' && (
              <>
                {!editing ? (
                  <Button
                    variant="outline"
                    onClick={() => setEditing(true)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSaveEdit}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditing(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {canClose && ticket.status !== 'fechado' && (
              <Button
                onClick={handleCloseTicket}
                className="bg-red-600 hover:bg-red-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Fechar Chamado
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Header */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-bold text-white">
                      #{ticket.id} - {editing ? (
                        <Input
                          value={editForm.title}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          className="bg-gray-800 border-gray-600 text-white inline-block w-auto"
                        />
                      ) : ticket.title}
                    </h1>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  
                  {/* Exibir quem abriu o chamado */}
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <User className="h-4 w-4" />
                    <span>Chamado aberto por <strong className="text-cyan-400">{ticket.user}</strong></span>
                    <span>•</span>
                    <span>{new Date(ticket.created_at).toLocaleDateString('pt-BR')} às {new Date(ticket.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Serviço: {ticket.service_type || 'Não especificado'}</span>
                    {ticket.client && (
                      <>
                        <span>•</span>
                        <span>Cliente: {ticket.client}</span>
                      </>
                    )}
                    {ticket.assigned_user && (
                      <>
                        <span>•</span>
                        <span>Responsável: {ticket.assigned_user}</span>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300 text-sm font-medium">Descrição</Label>
                    {editing ? (
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white mt-2"
                        rows={6}
                      />
                    ) : (
                      <p className="text-gray-300 mt-2 whitespace-pre-wrap">{ticket.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responses */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Histórico de Respostas ({responses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {responses.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">Nenhuma resposta ainda</p>
                  ) : (
                    responses.map((response) => (
                      <div key={response.id} className="border-l-4 border-cyan-500 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-cyan-400 font-medium">{response.user}</span>
                            {response.is_internal && (
                              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                Interno
                              </Badge>
                            )}
                          </div>
                          <span className="text-gray-400 text-sm">
                            {new Date(response.created_at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-gray-300 whitespace-pre-wrap">{response.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Response */}
                {ticket.status !== 'fechado' && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Label className="text-gray-300">Nova Resposta</Label>
                        {canEdit && (
                          <label className="flex items-center space-x-2 text-sm">
                            <input
                              type="checkbox"
                              checked={isInternal}
                              onChange={(e) => setIsInternal(e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-gray-400">Nota interna</span>
                          </label>
                        )}
                      </div>
                      <Textarea
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                        placeholder="Digite sua resposta..."
                        className="bg-gray-800 border-gray-600 text-white"
                        rows={4}
                      />
                      <Button
                        onClick={handleAddResponse}
                        className="bg-cyan-600 hover:bg-cyan-700"
                        disabled={!newResponse.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Resposta
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Edit Form */}
            {canEdit && editing && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Editar Chamado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Status</Label>
                    <Select 
                      value={editForm.status} 
                      onValueChange={(value) => setEditForm({...editForm, status: value})}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="aberto" className="text-white hover:bg-gray-700">Aberto</SelectItem>
                        <SelectItem value="em_andamento" className="text-white hover:bg-gray-700">Em Andamento</SelectItem>
                        <SelectItem value="fechado" className="text-white hover:bg-gray-700">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-300">Prioridade</Label>
                    <Select 
                      value={editForm.priority} 
                      onValueChange={(value) => setEditForm({...editForm, priority: value})}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="baixa" className="text-white hover:bg-gray-700">Baixa</SelectItem>
                        <SelectItem value="media" className="text-white hover:bg-gray-700">Média</SelectItem>
                        <SelectItem value="alta" className="text-white hover:bg-gray-700">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-300">Atribuir para</Label>
                    <Select 
                      value={editForm.assigned_to} 
                      onValueChange={(value) => setEditForm({...editForm, assigned_to: value})}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Selecionar técnico" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="" className="text-white hover:bg-gray-700">Não atribuído</SelectItem>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id.toString()} className="text-white hover:bg-gray-700">
                            {u.username} ({u.profile})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ticket Info */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Criado por:</span>
                  <span className="text-white">{ticket.user}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Criado em:</span>
                  <span className="text-white">{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Atualizado em:</span>
                  <span className="text-white">{new Date(ticket.updated_at).toLocaleDateString('pt-BR')}</span>
                </div>
                {ticket.assigned_user && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Responsável:</span>
                    <span className="text-white">{ticket.assigned_user}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;

