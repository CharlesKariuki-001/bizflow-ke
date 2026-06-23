import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  PieChart,
  Activity } from
'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">
            Business Reports
          </h1>
          <p className="text-muted">
            Analyze your business performance and trends.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            leftIcon={<Calendar className="w-4 h-4" />}>
            
            Last 30 Days
          </Button>
          <Button leftIcon={<Download className="w-4 h-4" />}>
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card glass>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-brand/10 text-brand">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Total Revenue</p>
                <h3 className="text-2xl font-display font-bold text-text">
                  KES 1.2M
                </h3>
                <p className="text-sm text-brand flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" /> +15% vs last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Total Orders</p>
                <h3 className="text-2xl font-display font-bold text-text">
                  3,452
                </h3>
                <p className="text-sm text-brand flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" /> +8% vs last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gold/20 text-yellow-700 dark:text-gold">
                <PieChart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">
                  Average Order Value
                </p>
                <h3 className="text-2xl font-display font-bold text-text">
                  KES 347
                </h3>
                <p className="text-sm text-accent flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 rotate-180" /> -2% vs last
                  month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
              {
                name: 'Groceries',
                value: 45,
                color: 'bg-brand'
              },
              {
                name: 'Household',
                value: 25,
                color: 'bg-blue-500'
              },
              {
                name: 'Dairy',
                value: 15,
                color: 'bg-gold'
              },
              {
                name: 'Bakery',
                value: 10,
                color: 'bg-orange-500'
              },
              {
                name: 'Others',
                value: 5,
                color: 'bg-gray-500'
              }].
              map((item) =>
              <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-text">{item.name}</span>
                    <span className="text-muted">{item.value}%</span>
                  </div>
                  <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-2">
                    <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{
                      width: `${item.value}%`
                    }} />
                  
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
              {
                name: 'Unga wa Dola 2kg',
                qty: '450 units',
                revenue: 'KES 103,500'
              },
              {
                name: 'KCC Milk 500ml',
                qty: '320 units',
                revenue: 'KES 19,200'
              },
              {
                name: 'Supaloaf Bread 400g',
                qty: '280 units',
                revenue: 'KES 18,200'
              },
              {
                name: 'Menengai Soap 1kg',
                qty: '150 units',
                revenue: 'KES 27,000'
              },
              {
                name: 'Blue Band Margarine 250g',
                qty: '120 units',
                revenue: 'KES 21,600'
              }].
              map((item, i) =>
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5">
                
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-sm font-bold text-brand shadow-soft-sm">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted">{item.qty} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-text">
                      {item.revenue}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

}