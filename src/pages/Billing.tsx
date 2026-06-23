import React from 'react';
import { CreditCard, Download, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlanCard } from '../components/billing/PlanCard';
export function Billing() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-text">
          Billing & Plans
        </h1>
        <p className="text-muted">Manage your subscription and usage.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Plan */}
        <Card glass className="lg:col-span-1 border-brand/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-display font-bold text-text mb-1">
              Free Plan
            </h3>
            <p className="text-muted text-sm mb-6">No expiry — Free forever</p>
            <Button className="w-full">Upgrade to Pro</Button>
          </CardContent>
        </Card>

        {/* Usage */}
        <Card glass className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
            {
              label: 'Transactions this month',
              used: 432,
              limit: 500,
              percent: 86,
              color: 'bg-gold'
            },
            {
              label: 'Products',
              used: 87,
              limit: 100,
              percent: 87,
              color: 'bg-gold'
            },
            {
              label: 'Branches',
              used: 1,
              limit: 1,
              percent: 100,
              color: 'bg-brand'
            },
            {
              label: 'Team members',
              used: 2,
              limit: 2,
              percent: 100,
              color: 'bg-brand'
            }].
            map((metric, i) =>
            <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-text">{metric.label}</span>
                  <span className="text-muted">
                    {metric.used} / {metric.limit}
                  </span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                  className={`${metric.color} h-full rounded-full transition-all`}
                  style={{
                    width: `${metric.percent}%`
                  }} />
                
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Options */}
      <div>
        <h2 className="text-xl font-display font-bold text-text mb-6">
          Available Plans
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <PlanCard
            name="Free"
            price="KES 0"
            description="Perfect for small single-location shops just getting started."
            features={[
            '1 Branch',
            '2 Users',
            '500 transactions/mo',
            '100 Products',
            'Basic Reports']
            }
            cta="Current Plan"
            ctaVariant="secondary"
            isCurrent />
          
          <PlanCard
            name="Pro"
            price="KES 1,499"
            description="For growing businesses that need more power and insights."
            features={[
            'Up to 3 Branches',
            '10 Users',
            'Unlimited transactions',
            'Unlimited Products',
            'M-Pesa Till Integration',
            'AI Insights']
            }
            cta="Upgrade to Pro"
            isPopular />
          
          <PlanCard
            name="Business"
            price="KES 4,999"
            description="For large operations needing custom integrations."
            features={[
            'Unlimited Branches',
            'Unlimited Users',
            'KRA eTIMS Integration',
            'API Access',
            'Dedicated Account Manager']
            }
            cta="Contact Sales"
            ctaVariant="outline" />
          
        </div>
      </div>

      {/* Billing History */}
      <Card glass>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted">
            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No billing history yet. You are on the Free plan.</p>
          </div>
        </CardContent>
      </Card>
    </div>);

}