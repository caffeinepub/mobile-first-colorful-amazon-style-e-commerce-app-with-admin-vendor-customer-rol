import { Shield, Award, Truck, HeadphonesIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">About ShopHub</h1>
          <p className="text-lg text-muted-foreground">
            Your trusted online marketplace for quality products at great prices
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            At ShopHub, we're committed to providing a seamless shopping experience that connects customers with
            quality products from trusted vendors. We believe in transparency, reliability, and customer
            satisfaction above all else. Our platform empowers both buyers and sellers to thrive in a secure and
            user-friendly environment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Secure Shopping</h3>
                  <p className="text-sm text-muted-foreground">
                    Your data and transactions are protected with industry-leading security measures
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-secondary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Quality Guarantee</h3>
                  <p className="text-sm text-muted-foreground">
                    All vendors are verified and products meet our quality standards
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Quick and reliable shipping to get your products to you on time
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-chart-3/10 flex items-center justify-center">
                    <HeadphonesIcon className="h-6 w-6 text-chart-3" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Our customer support team is always here to help you
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <img
            src="/assets/generated/trust-badges-set.dim_1024x256.png"
            alt="Trust badges"
            className="mx-auto max-w-full h-auto"
          />
        </section>
      </div>
    </div>
  );
}
