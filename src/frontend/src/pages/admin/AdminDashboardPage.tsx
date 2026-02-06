import { Users, ShoppingCart, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import AdminNav from '../../components/admin/AdminNav';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const controlPanelCards = [
    {
      title: 'Vendor Management',
      description: 'View all vendors, approve/reject applications, manage outlet status, and view documents',
      icon: Users,
      path: '/admin/vendors',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Orders Panel',
      description: 'View all orders, filter by city (Kanpur, Unnao), and track order status',
      icon: ShoppingCart,
      path: '/admin/orders',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminNav />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
          <Users className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Control Panel
          </h1>
          <p className="text-muted-foreground">Manage your marketplace operations</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {controlPanelCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.path}
              className="border-2 hover:border-primary/50 hover:shadow-soft-lg transition-all cursor-pointer group"
              onClick={() => navigate({ to: card.path })}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-3 rounded-xl ${card.bgColor}`}>
                    <Icon className={`h-8 w-8 ${card.color}`} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="text-xl">{card.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Open {card.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => navigate({ to: '/admin/products' })}
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Products
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => navigate({ to: '/admin/vendors' })}
          >
            <Users className="h-4 w-4 mr-2" />
            View All Vendors
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
