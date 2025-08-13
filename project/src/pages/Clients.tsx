import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, FileText, Download } from 'lucide-react';
import ClientForm from '../components/ClientForm';
import { clientsAPI } from '../services/api';

interface Client {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  serviceName: string;
  additionalServices: string[];
  totalValue: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, statusFilter]);

  const fetchClients = async () => {
    try {
      // Simulate API call with demo data
      setTimeout(() => {
        const demoClients: Client[] = [
          {
            _id: '1',
            name: 'John Smith',
            company: 'Acme Corporation',
            email: 'john@acme.com',
            phone: '+1 (555) 123-4567',
            serviceName: 'Web Development',
            additionalServices: ['SEO', 'Maintenance'],
            totalValue: 15000,
            status: 'active',
            createdAt: '2025-01-01'
          },
          {
            _id: '2',
            name: 'Sarah Johnson',
            company: 'Tech Solutions Inc',
            email: 'sarah@techsolutions.com',
            phone: '+1 (555) 987-6543',
            serviceName: 'Mobile App Development',
            additionalServices: ['UI/UX Design'],
            totalValue: 25000,
            status: 'active',
            createdAt: '2025-01-02'
          },
          {
            _id: '3',
            name: 'Mike Davis',
            company: 'StartupCo',
            email: 'mike@startupco.com',
            phone: '+1 (555) 456-7890',
            serviceName: 'E-commerce Platform',
            additionalServices: ['Payment Gateway', 'Analytics'],
            totalValue: 35000,
            status: 'pending',
            createdAt: '2025-01-03'
          }
        ];
        setClients(demoClients);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = clients;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    setFilteredClients(filtered);
  };

  const handleCreateClient = (clientData: Omit<Client, '_id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setClients([...clients, newClient]);
    setShowForm(false);
  };

  const handleUpdateClient = (clientData: Omit<Client, '_id' | 'createdAt'>) => {
    if (editingClient) {
      const updatedClients = clients.map(client =>
        client._id === editingClient._id
          ? { ...client, ...clientData }
          : client
      );
      setClients(updatedClients);
      setEditingClient(null);
      setShowForm(false);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client._id !== clientId));
    }
  };

  const exportToExcel = () => {
    // This would typically use a library like xlsx
    console.log('Exporting to Excel...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clients Management</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={exportToExcel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => {
              setEditingClient(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.company}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{client.serviceName}</div>
                    {client.additionalServices.length > 0 && (
                      <div className="text-sm text-gray-500">
                        +{client.additionalServices.join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${client.totalValue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setEditingClient(client);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding a new client.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Client Form Modal */}
      {showForm && (
        <ClientForm
          client={editingClient}
          onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
          onCancel={() => {
            setShowForm(false);
            setEditingClient(null);
          }}
        />
      )}
    </div>
  );
};

export default Clients;