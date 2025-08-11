'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, DollarSign, Users, CreditCard, Briefcase, BarChart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';

export function AppSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/expenses', icon: DollarSign, label: 'Expenses' },
    { href: '/dashboard/clients', icon: Users, label: 'Clients' },
    { href: '/dashboard/payments', icon: CreditCard, label: 'Payments' },
    { href: '/dashboard/employees', icon: Briefcase, label: 'Employees' },
    { href: '/dashboard/analytics', icon: BarChart, label: 'Analytics' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
      <div className="text-2xl font-bold mb-8 text-center">
        ExpenseFlow
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant="ghost"
              className={`w-full justify-start text-lg py-6 ${
                pathname === item.href ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-lg py-6 hover:bg-gray-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
