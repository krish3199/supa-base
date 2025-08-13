import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Download, DollarSign, Clock, CheckCircle } from 'lucide-react';
import PaymentForm from '../components/PaymentForm';

interface Payment {
  _id: string;
  clientId: string;
  clientName: string;
  serviceCost: number;
  paidAmount: number;
  pendingAmount: number;
  paymentDate: string;
  status: 'pending' | 'completed' | 'overdue';
  paymentMethod: 'cash' | 'check' | 'bank_transfer' | 'credit_card';
  notes?: string;
  createdAt: string;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter]);

  const fetchPayments = async () => {
    try {
      setTimeout(() => {
        const demoPayments: Payment[] = [
          {
            _id: '1',
            clientId: '1',
            clientName: 'Acme Corporation',
            serviceCost: 15000,
            paidAmount: 10000,
            pendingAmount: 5000,
            paymentDate: '2025-01-09',
            status: 'pending',
            paymentMethod: 'bank_transfer',
            notes: 'Partial payment received',
            createdAt: '2025-01-01'
          },
          {
            _id: '2',
            clientId: '2',
            clientName: 'Tech Solutions Inc',
            serviceCost: 25000,
            paidAmount: 25000,
            pendingAmount: 0,
            paymentDate: '2025-01-05',
            status: 'completed',
            paymentMethod: 'bank_transfer',
            createdAt: '2025-01-02'
          },
          {
            _id: '3',
            clientId: '3',
            clientName: 'StartupCo',
            serviceCost: 35000,
            paidAmount: 15000,
            pendingAmount: 20000,
            paymentDate: '2024-12-15',
            status: 'overdue',
            paymentMethod: 'check',
            notes: 'Payment overdue by 25 days',
            createdAt: '2025-01-03'
          }
        ];
        setPayments(demoPayments);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    setFilteredPayments(filtered);
  };

  const handleCreatePayment = (paymentData: Omit<Payment, '_id' | 'createdAt' | 'pendingAmount'>) => {
    const pendingAmount = paymentData.serviceCost - paymentData.paidAmount;
    const newPayment: Payment = {
      ...paymentData,
      pendingAmount,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setPayments([...payments, newPayment]);
    setShowForm(false);
  };

  const handleUpdatePayment = (paymentData: Omit<Payment, '_id' | 'createdAt' | 'pendingAmount'>) => {
    if (editingPayment) {
      const pendingAmount = paymentData.serviceCost - paymentData.paidAmount;
      const updatedPayments = payments.map(payment =>
        payment._id === editingPayment._id
          ? { ...payment, ...paymentData, pendingAmount }
          : payment
      );
      setPayments(updatedPayments);
      setEditingPayment(null);
      setShowForm(false);
    }
  };

  const handleDeletePayment = (paymentId: string) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      setPayments(payments.filter(payment => payment._id !== paymentId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <Clock className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getTotalStats = () => {
    const totalReceived = filteredPayments.reduce((sum, payment) => sum + payment.paidAmount, 0);
    const totalPending = filteredPayments.reduce((sum, payment) => sum + payment.pendingAmount, 0);
    const totalValue = filteredPayments.reduce((sum, payment) => sum + payment.serviceCost, 0);
    
    return { totalReceived, totalPending, totalValue };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { totalReceived, totalPending, totalValue } = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payments Management</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => console.log('Export to Excel')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => {
              setEditingPayment(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Payment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Received</p>
              <p className="text-2xl font-bold text-green-600">${totalReceived.toLocaleString()}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pending</p>
              <p className="text-2xl font-bold text-yellow-600">${totalPending.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
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
                placeholder="Search payments..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
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
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.clientName}</div>
                    <div className="text-sm text-gray-500 capitalize">{payment.paymentMethod.replace('_', ' ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${payment.serviceCost.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">${payment.paidAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${payment.pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${payment.pendingAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1">{payment.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setEditingPayment(payment);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePayment(payment._id)}
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

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding a new payment record.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Payment Form Modal */}
      {showForm && (
        <PaymentForm
          payment={editingPayment}
          onSubmit={editingPayment ? handleUpdatePayment : handleCreatePayment}
          onCancel={() => {
            setShowForm(false);
            setEditingPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default Payments;