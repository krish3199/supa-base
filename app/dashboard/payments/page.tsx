'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Payment, PaymentInput } from '@/models/Payment';
import { Client } from '@/models/Client';
import { useAuth } from '@/components/auth-provider';

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clients, setClients] = useState<Client[]>([]); // To select client for new payment
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<PaymentInput>>({
    clientId: '',
    amount: 0,
    currency: 'USD',
    paymentDate: new Date().toISOString().split('T')[0],
    method: '',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      fetchPaymentsAndClients();
    }
  }, [user]);

  const fetchPaymentsAndClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const [paymentsResponse, clientsResponse] = await Promise.all([
        fetch('/api/payments', { headers: { 'Authorization': `Bearer ${await user?.getIdToken()}` } }),
        fetch('/api/clients', { headers: { 'Authorization': `Bearer ${await user?.getIdToken()}` } }),
      ]);

      if (!paymentsResponse.ok) throw new Error('Failed to fetch payments');
      if (!clientsResponse.ok) throw new Error('Failed to fetch clients');

      const paymentsData = await paymentsResponse.json();
      const clientsData = await clientsResponse.json();

      setPayments(paymentsData);
      setClients(clientsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewPayment((prev) => ({
      ...prev,
      [id]: id === 'amount' ? parseFloat(value) : value,
    }));
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('User not authenticated.');
      return;
    }

    try {
      const paymentData: PaymentInput = {
        clientId: newPayment.clientId || '',
        amount: newPayment.amount || 0,
        currency: newPayment.currency || 'USD',
        paymentDate: newPayment.paymentDate || new Date().toISOString().split('T')[0],
        method: newPayment.method || '',
        notes: newPayment.notes || '',
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Failed to add payment');
      }

      setNewPayment({
        clientId: '',
        amount: 0,
        currency: 'USD',
        paymentDate: new Date().toISOString().split('T')[0],
        method: '',
        notes: '',
      });
      setIsModalOpen(false);
      fetchPaymentsAndClients(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'N/A';
  };

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payments</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Record New Payment</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPayment} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientId" className="text-right">
                  Client
                </Label>
                <select
                  id="clientId"
                  value={newPayment.clientId}
                  onChange={handleInputChange}
                  className="col-span-3 border rounded-md p-2"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newPayment.amount}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currency" className="text-right">
                  Currency
                </Label>
                <Input
                  id="currency"
                  value={newPayment.currency}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentDate" className="text-right">
                  Date
                </Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={newPayment.paymentDate}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">
                  Method
                </Label>
                <Input
                  id="method"
                  value={newPayment.method}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="notes"
                  value={newPayment.notes}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Record Payment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{getClientName(payment.clientId)}</TableCell>
                  <TableCell>{payment.amount} {payment.currency}</TableCell>
                  <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{payment.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
