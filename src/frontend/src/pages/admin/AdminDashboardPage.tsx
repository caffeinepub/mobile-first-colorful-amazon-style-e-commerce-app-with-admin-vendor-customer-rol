import { Users, ShoppingCart, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PrimaryCtaButton from '../../components/buttons/PrimaryCtaButton';
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
      gradient: 'from-primary to-secondary',
      bgGradient: 'from-primary/15 to-secondary/15',
    },
    {
      title: 'Orders Panel',
      description: 'View all orders, filter by city (Kanpur, Unnao), and track order status',
      icon: ShoppingCart,
      path: '/admin/orders',
      gradient: 'from-accent to-highlight',
      bgGradient: 'from-accent/15 to-highlight/15',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminNav />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-soft">
          <Users className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Control Panel
          </h1>
          <p className="text-muted-foreground font-semibold">Manage your marketplace operations</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {controlPanelCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.path}
              className={`marketplace-card cursor-pointer tap-scale bg-gradient-to-br ${card.bgGradient}`}
              onClick={() => navigate({ to: card.path })}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-soft`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="text-xl font-extrabold">{card.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed font-medium">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PrimaryCtaButton className="w-full font-extrabold rounded-xl">
                  Open {card.title}
                </PrimaryCtaButton>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="marketplace-card">
        <CardHeader>
          <CardTitle className="font-extrabold">Quick Actions</CardTitle>
          <CardDescription className="font-medium">Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <PrimaryCtaButton
            variant="outline"
            className="justify-start font-bold rounded-xl"
            onClick={() => navigate({ to: '/admin/products' })}
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Products
          </PrimaryCtaButton>
          <PrimaryCtaButton
            variant="outline"
            className="justify-start font-bold rounded-xl"
            onClick={() => navigate({ to: '/admin/vendors' })}
          >
            <Users className="h-4 w-4 mr-2" />
            View All Vendors
          </PrimaryCtaButton>
        </CardContent>
      </Card>
    </div>
  );
}
