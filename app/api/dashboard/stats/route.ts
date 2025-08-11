import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin'; // Firebase Admin SDK

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Fetch total clients
    const clientsSnapshot = await adminDb.collection('clients').get();
    const totalClients = clientsSnapshot.size;

    // Fetch total expenses
    const expensesSnapshot = await adminDb.collection('expenses').where('userId', '==', userId).get();
    let totalExpenses = 0;
    const expenseCategoriesMap = new Map<string, number>();
    expensesSnapshot.forEach(doc => {
      const data = doc.data();
      totalExpenses += data.amount || 0;
      const category = data.category || 'Other';
      expenseCategoriesMap.set(category, (expenseCategoriesMap.get(category) || 0) + data.amount);
    });
    const expenseCategories = Array.from(expenseCategoriesMap.entries()).map(([name, value]) => ({ name, value }));

    // Fetch total payments and pending payments
    const paymentsSnapshot = await adminDb.collection('payments').get();
    let totalIncome = 0;
    let pendingPayments = 0;
    paymentsSnapshot.forEach(doc => {
      const data = doc.data();
      totalIncome += data.paidAmount || 0;
      pendingPayments += data.pendingAmount || 0;
    });

    // Fetch total employees
    const employeesSnapshot = await adminDb.collection('employees').get();
    const totalEmployees = employeesSnapshot.size;

    const profit = totalIncome - totalExpenses;

    // Aggregate monthly data for charts
    const monthlyDataMap = new Map<string, { income: number; expenses: number; profit: number }>();
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize monthly data for the last 6 months
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = months[date.getMonth()];
      monthlyDataMap.set(monthName, { income: 0, expenses: 0, profit: 0 });
    }

    // Populate monthly income
    paymentsSnapshot.forEach(doc => {
      const data = doc.data();
      const paymentDate = data.paymentDate?.toDate();
      if (paymentDate && paymentDate.getFullYear() === currentYear) {
        const monthName = months[paymentDate.getMonth()];
        const currentMonthData = monthlyDataMap.get(monthName) || { income: 0, expenses: 0, profit: 0 };
        currentMonthData.income += data.paidAmount || 0;
        monthlyDataMap.set(monthName, currentMonthData);
      }
    });

    // Populate monthly expenses
    expensesSnapshot.forEach(doc => {
      const data = doc.data();
      const expenseDate = data.expenseDate?.toDate();
      if (expenseDate && expenseDate.getFullYear() === currentYear) {
        const monthName = months[expenseDate.getMonth()];
        const currentMonthData = monthlyDataMap.get(monthName) || { income: 0, expenses: 0, profit: 0 };
        currentMonthData.expenses += data.amount || 0;
        monthlyDataMap.set(monthName, currentMonthData);
      }
    });

    // Calculate profit for each month
    const monthlyData = Array.from(monthlyDataMap.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        profit: data.income - data.expenses,
      }))
      .sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month)); // Sort by month order

    // Fetch recent activities (last 4 expenses/payments)
    const recentExpensesSnapshot = await adminDb.collection('expenses').where('userId', '==', userId).orderBy('createdAt', 'desc').limit(2).get();
    const recentPaymentsSnapshot = await adminDb.collection('payments').get(); // Assuming payments are global or linked later

    const recentActivities = [
      ...recentExpensesSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'expense',
        description: doc.data().expenseDetails,
        amount: doc.data().amount,
        date: doc.data().createdAt?.toDate().toISOString(),
      })),
      ...recentPaymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'income',
        description: `Payment from ${doc.data().clientName}`,
        amount: doc.data().paidAmount,
        date: doc.data().createdAt?.toDate().toISOString(),
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);

    return NextResponse.json({
      totalIncome,
      totalExpenses,
      profit,
      totalClients,
      totalEmployees,
      pendingPayments,
      monthlyData,
      expenseCategories,
      recentActivities,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
