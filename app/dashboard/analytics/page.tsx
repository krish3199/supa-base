'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, CreditCard, Activity, TrendingUp, TrendingDown, BarChartIcon, LineChartIcon, PieChartIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/components/auth-provider'

interface AnalyticsData {
  totalRevenue: number
  totalExpenses: number
  totalClients: number
  totalEmployees: number
  revenueByMonth: { month: string; revenue: number }[]
  expensesByMonth: { month: string; expenses: number }[]
  clientStatusDistribution: { status: string; count: number }[]
  expenseCategoryDistribution: { category: string; count: number }[]
  expensesByCategory: { category: string; amount: number }[]
  monthlyExpenses: { month: string; amount: number }[]
}

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A28DFF', '#FF6B6B']; // More colors for categories

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/dashboard/stats', { // Reusing stats API for demo
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data = await response.json()

        // Mocking more detailed analytics data based on existing stats
        const mockAnalytics: AnalyticsData = {
          totalRevenue: data.totalIncome, // Renamed from totalRevenue to totalIncome in stats API
          totalExpenses: data.totalExpenses,
          totalClients: data.totalClients,
          totalEmployees: data.totalEmployees,
          revenueByMonth: data.monthlyData.map((item: any) => ({ month: item.month, revenue: item.income })),
          expensesByMonth: data.monthlyData.map((item: any) => ({ month: item.month, expenses: item.expenses })),
          clientStatusDistribution: [
            { status: 'active', count: Math.floor(data.totalClients * 0.7) },
            { status: 'pending', count: Math.floor(data.totalClients * 0.2) },
            { status: 'inactive', count: Math.floor(data.totalClients * 0.1) },
          ],
          expenseCategoryDistribution: data.expenseCategories.map((item: any) => ({ category: item.name, count: item.value })),
          expensesByCategory: [
            { category: 'Software', amount: data.totalExpenses * 0.4 },
            { category: 'Travel', amount: data.totalExpenses * 0.25 },
            { category: 'Office', amount: data.totalExpenses * 0.15 },
            { category: 'Marketing', amount: data.totalExpenses * 0.2 },
          ],
          monthlyExpenses: [
            { month: 'Jan', amount: 1200 },
            { month: 'Feb', amount: 1500 },
            { month: 'Mar', amount: 1300 },
            { month: 'Apr', amount: 1800 },
            { month: 'May', amount: 1600 },
            { month: 'Jun', amount: 2000 },
            { month: 'Jul', amount: data.totalExpenses }, // Current month
          ],
        }
        setAnalyticsData(mockAnalytics)
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching analytics data:', err)
        toast({
          title: "Error",
          description: "Failed to load analytics data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error: {error}
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No analytics data available.
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Analytics Overview</h1>
      
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline-block h-3 w-3 mr-1 text-green-500" />
              +5.2% this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline-block h-3 w-3 mr-1 text-red-500" />
              -1.8% this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.clientStatusDistribution.find(c => c.status === 'active')?.count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total: {analyticsData.totalClients}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Team size
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Distributions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex flex-col justify-center items-center">
              {/* Placeholder for a line chart */}
              <p className="text-lg font-semibold">Line Chart Placeholder</p>
              <ul className="text-sm text-muted-foreground mt-2 flex gap-4">
                {analyticsData.revenueByMonth.map((item, index) => (
                  <li key={index}>{item.month}: ${item.revenue.toFixed(2)}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Distribution of expenses across categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex flex-col justify-center items-center">
              {/* Placeholder for a pie chart */}
              <p className="text-lg font-semibold">Pie Chart Placeholder</p>
              <ul className="text-sm text-muted-foreground mt-2">
                {analyticsData.expensesByCategory.map((item, index) => (
                  <li key={index}>{item.category}: ${item.amount.toFixed(2)}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Client Status Breakdown</CardTitle>
            <CardDescription>Current status of your clients.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex flex-col justify-center items-center">
              {/* Placeholder for a bar chart */}
              <p className="text-lg font-semibold">Bar Chart Placeholder</p>
              <ul className="text-sm text-muted-foreground mt-2">
                {analyticsData.clientStatusDistribution.map((item, index) => (
                  <li key={index}>{item.status}: {item.count}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
            <CardDescription>Monthly expenses over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex flex-col justify-center items-center">
              {/* Placeholder for a line chart */}
              <p className="text-lg font-semibold">Line Chart Placeholder</p>
              <ul className="text-sm text-muted-foreground mt-2 flex gap-4">
                {analyticsData.monthlyExpenses.map((item, index) => (
                  <li key={index}>{item.month}: ${item.amount.toFixed(2)}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
