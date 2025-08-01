import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Trash2, Edit, Plus, Settings } from 'lucide-react';

const ServiceTypeManagement = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const fetchServiceTypes = async () => {
    try {
      const response = await fetch('/api/service-types', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setServiceTypes(data);
      } else {
        console.error('Erro ao buscar tipos de serviço');
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingServiceType ? `/api/service-types/${editingServiceType.id}` : '/api/service-types';
      const method = editingServiceType ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchServiceTypes();
        setIsDialogOpen(false);
        resetForm();
        alert(editingServiceType ? 'Tipo de serviço atualizado com sucesso!' : 'Tipo de serviço criado com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao salvar tipo de serviço');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar tipo de serviço');
    }
  };

  const handleDelete = async (serviceTypeId) => {
    if (!confirm('Tem certeza que deseja excluir este tipo de serviço?')) {
      return;
    }

    try {
      const response = await fetch(`/api/service-types/${serviceTypeId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        fetchServiceTypes();
        alert('Tipo de serviço excluído com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao excluir tipo de serviço');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao excluir tipo de serviço');
    }
  };

  const handleEdit = (serviceType) => {
    setEditingServiceType(serviceType);
    setFormData({
      name: serviceType.name,
      description: serviceType.description || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setEditingServiceType(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando tipos de serviço...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gerenciamento de Tipos de Serviço</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Tipo de Serviço
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingServiceType ? 'Editar Tipo de Serviço' : 'Novo Tipo de Serviço'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Consultoria em T.I."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva o tipo de serviço..."
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingServiceType ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceTypes.map((serviceType) => (
                <TableRow key={serviceType.id}>
                  <TableCell className="font-medium">{serviceType.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {serviceType.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={serviceType.active ? 'default' : 'secondary'}>
                      {serviceType.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(serviceType.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(serviceType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(serviceType.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {serviceTypes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum tipo de serviço encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceTypeManagement;

