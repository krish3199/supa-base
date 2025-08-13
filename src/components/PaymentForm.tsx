import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

interface PaymentFormProps {
  payment: Payment | null;
  onSubmit: (paymentData: Omit<Payment, '_id' | 'createdAt' | 'pendingAmount'>) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ payment, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    serviceCost: 0,
    paidAmount: 0,
    paymentDate: '',
    status: 'pending' as 'pending' | 'completed' | 'overdue',
    paymentMethod: 'bank_transfer' as 'cash' | 'check' | 'bank_transfer' | 'credit_card',
    notes: ''
  });

  const demoClients = [
    { id: '1', name: 'Acme Corporation' },
    { id: '2', name: 'Tech Solutions Inc' },
    { id: '3', name: 'StartupCo' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit_card', label: 'Credit Card' }
  ];

  useEffect(() => {
    if (payment) {
      setFormData({
        clientId: payment.clientId,
        clientName: payment.clientName,
        serviceCost: payment.serviceCost,
        paidAmount: payment.paidAmount,
        paymentDate: payment.paymentDate,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        notes: payment.notes || ''
      });
    } else {
      setFormData(prev => ({
        ...prev,
        paymentDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [payment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-determine status based on amounts
    let status = formData.status;
    if (formData.paidAmount >= formData.serviceCost) {
      status = 'completed';
    } else if (formData.paidAmount > 0) {
      status = 'pending';
    }

    onSubmit({
      ...formData,
      status
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'clientId') {
      const selectedClient = demoClients.find(client => client.id === value);
      setFormData(prev => ({
        ...prev,
        clientId: value,
        clientName: selectedClient ? selectedClient.name : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['serviceCost', 'paidAmount'].includes(name) ? parseFloat(value) || 0 : value
      }));
    }
  };

  const pendingAmount = formData.serviceCost - formData.paidAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onCancel}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {payment ? 'Edit Payment' : 'Add New Payment'}
              </h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                  Client *
                </label>
                <select
                  id="clientId"
                  name="clientId"
                  required
                  value={formData.clientId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select client</option>
                  {demoClients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="serviceCost" className="block text-sm font-medium text-gray-700">
                  Service Cost ($) *
                </label>
                <input
                  type="number"
                  id="serviceCost"
                  name="serviceCost"
                  required
                  min="0"
                  step="0.01"
                  value={formData.serviceCost}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700">
                  Paid Amount ($) *
                </label>
                <input
                  type="number"
                  id="paidAmount"
                  name="paidAmount"
                  required
                  min="0"
                  max={formData.serviceCost}
                  step="0.01"
                  value={formData.paidAmount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Pending Amount Display */}
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Pending Amount:</span>
                  <span className={`text-sm font-bold ${pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${pendingAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                  Payment Date *
                </label>
                <input
                  type="date"
                  id="paymentDate"
                  name="paymentDate"
                  required
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                  Payment Method *
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  required
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Status will be automatically set based on payment amounts
                </p>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes about the payment..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {payment ? 'Update Payment' : 'Create Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;