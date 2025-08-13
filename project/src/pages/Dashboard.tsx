import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Receipt, 
  CreditCard,
  Activity,
  Calendar
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  totalProfit: number;
  totalClients: number;
  pendingPayments: number;
  activeEmployees: number;
}

interface RecentActivity {
  id: string;
  type: 'payment' | 'expense' | 'client' | 'employee';
  description: string;
  amount?: number;
  date: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    totalProfit: 0,
    totalClients: 0,
    pendingPayments: 0,
    activeEmployees: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API call with demo data
      setTimeout(() => {
        setStats({
          totalIncome: 125000,
          totalExpenses: 45000,
          totalProfit: 80000,
          totalClients: 24,
          pendingPayments: 15000,
          activeEmployees: 8,
        });

        setRecentActivities([
          {
            id: '1',
            type: 'payment',
            description: 'Payment received from Acme Corp',
            amount: 5000,
            date: '2025-01-09'
          },
          {
            id: '2',
            type: 'expense',
            description: 'Office maintenance expense',
            amount: 800,
            date: '2025-01-08'
          },
          {
            id: '3',
            type: 'client',
            description: 'New client added: Tech Solutions Inc',
            date: '2025-01-08'
          },
          {
            id: '4',
            type: 'employee',
            description: 'Employee assigned to new project',
            date: '2025-01-07'
          },
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: [12000, 15000, 18000, 16000, 14000, 19000, 22000, 25000, 21000, 18000, 20000, 24000],
        backgroundColor: '#3B82F6',
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: [4000, 4500, 5000, 4200, 3800, 5200, 5800, 6000, 5500, 4900, 5300, 5900],
        backgroundColor: '#EF4444',
        borderRadius: 4,
      },
    ],
  };

  const expenseCategoriesData = {
    labels: ['Client Services', 'Maintenance', 'Marketing', 'Operations', 'Other'],
    datasets: [
      {
        data: [35, 25, 15, 20, 5],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        borderWidth: 0,
      },
    ],
  };

  const profitTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Profit Trend',
        data: [8000, 10500, 13000, 11800, 10200, 13800],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const statCards = [
    {
      title: 'Total Income',
      value: `$${stats.totalIncome.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12.5%',
      changeType: 'increase'
    },
    {
      title: 'Total Expenses',
      value: `$${stats.totalExpenses.toLocaleString()}`,
      icon: Receipt,
      color: 'bg-red-500',
      change: '+5.2%',
      changeType: 'increase'
    },
    {
      title: 'Net Profit',
      value: `$${stats.totalProfit.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-blue-500',
      change: '+18.3%',
      changeType: 'increase'
    },
    {
      title: 'Total Clients',
      value: stats.totalClients.toString(),
      icon: Users,
      color: 'bg-purple-500',
      change: '+3',
      changeType: 'increase'
    },
    {
      title: 'Pending Payments',
      value: `$${stats.pendingPayments.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-yellow-500',
      change: '-8.1%',
      changeType: 'decrease'
    },
    {
      title: 'Active Employees',
      value: stats.activeEmployees.toString(),
      icon: Users,
      color: 'bg-indigo-500',
      change: '+1',
      changeType: 'increase'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Expense Manager</h1>
        <p className="text-blue-100">Track your business finances and manage expenses efficiently</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <div className="flex items-center mt-2">
                    {card.changeType === 'increase' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.change}
                    </span>
                  </div>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expenses */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Income vs Expenses</h3>
          <div className="h-80">
            <Bar 
              data={monthlyData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + value.toLocaleString();
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
          <div className="h-80">
            <Doughnut 
              data={expenseCategoriesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profit Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Trend</h3>
          <div className="h-64">
            <Line 
              data={profitTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + value.toLocaleString();
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const getActivityIcon = (type: string) => {
                switch (type) {
                  case 'payment':
                    return <CreditCard className="w-4 h-4 text-green-500" />;
                  case 'expense':
                    return <Receipt className="w-4 h-4 text-red-500" />;
                  case 'client':
                    return <Users className="w-4 h-4 text-blue-500" />;
                  case 'employee':
                    return <Activity className="w-4 h-4 text-purple-500" />;
                  default:
                    return <Activity className="w-4 h-4 text-gray-500" />;
                }
              };

              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    {activity.amount && (
                      <p className="text-sm font-medium text-green-600">
                        ${activity.amount.toLocaleString()}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;