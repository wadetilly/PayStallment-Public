import { BarChart3, DollarSign, Package, ShoppingBag } from 'lucide-react';
import { cn } from '../../lib/utils';

const stats = [
  {
    name: 'Total Revenue',
    value: '$45,231.89',
    icon: DollarSign,
    change: '+20.1%',
    changeType: 'positive',
  },
  {
    name: 'Active Products',
    value: '256',
    icon: ShoppingBag,
    change: '+12.5%',
    changeType: 'positive',
  },
  {
    name: 'Package Sales',
    value: '3,427',
    icon: Package,
    change: '+4.75%',
    changeType: 'positive',
  },
  {
    name: 'Monthly Growth',
    value: '23.1%',
    icon: BarChart3,
    change: '+2.4%',
    changeType: 'positive',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Your business at a glance</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className={cn(
                "p-2 rounded-full",
                "bg-blue-50"
              )}>
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <div className="flex items-center space-x-1">
                  <span className={cn(
                    "text-sm",
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}