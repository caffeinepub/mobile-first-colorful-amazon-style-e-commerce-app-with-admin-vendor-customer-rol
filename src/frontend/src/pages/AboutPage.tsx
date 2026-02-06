import { Shield, Users, TrendingUp, CheckCircle, Lock, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            About Us – Quick Bazar
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Quick Bazar is a modern multi-vendor digital marketplace designed to connect local shops with nearby customers on a single, easy-to-use platform. Our goal is to make local shopping fast, convenient, and trustworthy.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mt-4">
            Through Quick Bazar, vendors can create and manage their own shops, list products, and control pricing, while customers can discover nearby stores by category and purchase products directly from them.
          </p>
        </section>

        <section className="surface-primary-tint rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <ul className="space-y-3 text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>To bring local shops online and help them grow digitally</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>To provide customers with a fast, simple, and secure shopping experience</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>To build transparency and trust between vendors and customers</span>
            </li>
          </ul>
        </section>

        <section className="surface-secondary-tint rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            To create a strong local digital marketplace where every neighborhood shop can reach more customers and every customer can shop locally with ease.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Why Quick Bazar?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-soft-lg transition-all border-2 hover:border-primary/30">
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Multiple vendors on one platform</h3>
                  <p className="text-sm text-muted-foreground">
                    Access multiple local shops and vendors all in one convenient marketplace
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-soft-lg transition-all border-2 hover:border-secondary/30">
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center border-2 border-secondary/30">
                    <TrendingUp className="h-6 w-6 text-secondary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Category-wise shops and products</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse shops organized by categories for easy discovery
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-soft-lg transition-all border-2 hover:border-accent/30">
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border-2 border-accent/30">
                    <CheckCircle className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Easy vendor registration and approval</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple onboarding process with admin verification for quality assurance
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-soft-lg transition-all border-2 hover:border-chart-3/30">
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chart-3/20 to-chart-3/10 flex items-center justify-center border-2 border-chart-3/30">
                    <Shield className="h-6 w-6 text-chart-3" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Simple, fast, and secure user experience</h3>
                  <p className="text-sm text-muted-foreground">
                    Intuitive interface with robust security for peace of mind
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-soft-lg transition-all border-2 hover:border-primary/30 md:col-span-2">
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Strong support for local businesses</h3>
                  <p className="text-sm text-muted-foreground">
                    Empowering neighborhood shops to thrive in the digital economy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="surface-accent-tint rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Trust & Security</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            All vendors on Quick Bazar are verified and approved by the admin before going live. We prioritize data security, privacy, and a reliable experience for both customers and vendors.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-5 w-5 text-accent" />
            <span className="font-medium">Your data is protected with industry-leading security</span>
          </div>
        </section>

        <section className="text-center surface-primary-tint rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Our Belief</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We believe local businesses are the backbone of a strong economy.
          </p>
          <p className="text-lg font-semibold mt-4 text-foreground">
            Quick Bazar is not just an app—it's a bridge between local vendors and customers, built on trust and simplicity.
          </p>
        </section>
      </div>
    </div>
  );
}
