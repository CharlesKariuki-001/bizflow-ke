import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  CreditCard,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Sparkles,
  Clock } from
'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CountUp } from '../components/ui/CountUp';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
export function Dashboard() {
  const [isLive, setIsLive] = useState(true);
  const [chartData, setChartData] = useState([
  {
    time: '08:00',
    sales: 4000
  },
  {
    time: '09:00',
    sales: 7000
  },
  {
    time: '10:00',
    sales: 4500
  },
  {
    time: '11:00',
    sales: 9000
  },
  {
    time: '12:00',
    sales: 6500
  },
  {
    time: '13:00',
    sales: 8500
  },
  {
    time: '14:00',
    sales: 10000
  }]
  );
  const [transactions, setTransactions] = useState([
  {
    id: 'TRX-001',
    customer: 'John Kamau',
    amount: 1250,
    method: 'M-Pesa',
    time: 'Just now',
    status: 'Completed'
  },
  {
    id: 'TRX-002',
    customer: 'Sarah Wanjiku',
    amount: 4500,
    method: 'Cash',
    time: '25 mins ago',
    status: 'Completed'
  },
  {
    id: 'TRX-003',
    customer: 'Walk-in Customer',
    amount: 850,
    method: 'Card',
    time: '1 hour ago',
    status: 'Completed'
  },
  {
    id: 'TRX-004',
    customer: 'Peter Omondi',
    amount: 12000,
    method: 'M-Pesa',
    time: '2 hours ago',
    status: 'Pending'
  }]
  );
  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      // Add new chart data point
      setChartData((prev) => {
        const newData = [
        ...prev.slice(1),
        {
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          sales: Math.floor(Math.random() * 5000) + 5000
        }];

        return newData;
      });
      // Add new transaction
      const names = ['Akinyi', 'Mwangi', 'Otieno', 'Wanjiku', 'Kamau'];
      const methods = ['M-Pesa', 'Cash', 'Card'];
      const newTrx = {
        id: `TRX-${Math.floor(Math.random() * 1000).
        toString().
        padStart(3, '0')}`,
        customer: names[Math.floor(Math.random() * names.length)],
        amount: Math.floor(Math.random() * 5000) + 500,
        method: methods[Math.floor(Math.random() * methods.length)],
        time: 'Just now',
        status: 'Completed'
      };
      setTransactions((prev) => [newTrx, ...prev.slice(0, 3)]);
    }, 8000);
    return () => clearInterval(interval);
  }, [isLive]);
  const stats = [
  {
    title: "Today's Sales",
    value: 45230,
    prefix: 'KES ',
    change: '+12.5%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-brand',
    bg: 'bg-brand/10'
  },
  {
    title: 'Active Customers',
    value: 124,
    change: '+4.2%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'M-Pesa Payments',
    value: 32100,
    prefix: 'KES ',
    change: '-2.4%',
    trend: 'down',
    icon: CreditCard,
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  },
  {
    title: 'Low Stock Items',
    value: 12,
    change: 'Needs attention',
    trend: 'neutral',
    icon: Package,
    color: 'text-accent',
    bg: 'bg-accent/10'
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-text">
              Dashboard
            </h1>
            {isLive &&
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand/10 border border-brand/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                </span>
                <span className="text-[10px] font-bold text-brand uppercase tracking-wider">
                  Live
                </span>
              </div>
            }
          </div>
          <p className="text-muted">
            Welcome back! Here's what's happening at your store today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsLive(!isLive)}>
            {isLive ? 'Pause Updates' : 'Resume Updates'}
          </Button>
          <Button>New Sale</Button>
        </div>
      </div>

      {/* AI Insights Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="bg-gradient-to-r from-brand/10 via-brand/5 to-transparent border border-brand/20 rounded-2xl p-4 flex items-start sm:items-center gap-4">
        
        <div className="p-2 bg-brand/20 rounded-xl text-brand shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-text mb-0.5">
            BizFlow AI Insight
          </h4>
          <p className="text-sm text-muted">
            You are running low on{' '}
            <span className="font-semibold text-text">KCC Milk 500ml</span>.
            Based on current sales velocity, you will run out by 2 PM. Consider
            reordering 50 units now.
          </p>
        </div>
        <Button size="sm" variant="outline" className="hidden sm:flex shrink-0">
          Reorder Now
        </Button>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: i * 0.08,
                duration: 0.4
              }}>
              
              <Card
                glass
                className="h-full hover:shadow-soft-lg transition-shadow duration-300">
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {stat.trend !== 'neutral' &&
                    <span
                      className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-brand' : 'text-accent'}`}>
                      
                        {stat.trend === 'up' ?
                      <ArrowUpRight className="w-4 h-4 mr-1" /> :

                      <ArrowDownRight className="w-4 h-4 mr-1" />
                      }
                        {stat.change}
                      </span>
                    }
                    {stat.trend === 'neutral' &&
                    <span className="text-sm font-medium text-muted">
                        {stat.change}
                      </span>
                    }
                  </div>
                  <h3 className="text-muted text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-display font-bold text-text">
                    <CountUp end={stat.value} prefix={stat.prefix} />
                  </p>
                </CardContent>
              </Card>
            </motion.div>);

        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <Card className="lg:col-span-2" glass>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Revenue Overview</CardTitle>
            <select className="bg-surface border border-border rounded-lg text-sm px-3 py-1.5 text-text focus:outline-none focus:ring-2 focus:ring-brand">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0
                  }}>
                  
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--brand-green)"
                        stopOpacity={0.3} />
                      
                      <stop
                        offset="95%"
                        stopColor="var(--brand-green)"
                        stopOpacity={0} />
                      
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)" />
                  
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: 'var(--muted)',
                      fontSize: 12
                    }}
                    dy={10} />
                  
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: 'var(--muted)',
                      fontSize: 12
                    }}
                    tickFormatter={(value) => `K${value / 1000}`} />
                  
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      borderRadius: '12px',
                      boxShadow: 'var(--tw-shadow-soft)',
                      color: 'var(--text)'
                    }}
                    itemStyle={{
                      color: 'var(--brand-green)',
                      fontWeight: 'bold'
                    }}
                    formatter={(value: number) => [
                    `KES ${value.toLocaleString()}`,
                    'Sales']
                    } />
                  
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--brand-green)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    isAnimationActive={true}
                    animationDuration={1000} />
                  
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card glass className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
            <CardTitle>Live Feed</CardTitle>
            <button className="text-muted hover:text-text">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 overflow-y-auto no-scrollbar p-6 pt-0 space-y-3">
              <AnimatePresence initial={false}>
                {transactions.map((trx) =>
                <motion.div
                  key={trx.id}
                  initial={{
                    opacity: 0,
                    height: 0,
                    y: -20
                  }}
                  animate={{
                    opacity: 1,
                    height: 'auto',
                    y: 0
                  }}
                  exit={{
                    opacity: 0,
                    height: 0
                  }}
                  transition={{
                    duration: 0.3
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border shadow-soft-sm">
                  
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-sm shrink-0">
                        {trx.customer.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text truncate">
                          {trx.customer}
                        </p>
                        <p className="text-xs text-muted flex items-center gap-1">
                          {trx.method}{' '}
                          <span className="w-1 h-1 rounded-full bg-border" />{' '}
                          {trx.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-text">
                        KES {trx.amount.toLocaleString()}
                      </p>
                      <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${trx.status === 'Completed' ? 'bg-brand/10 text-brand' : 'bg-gold/20 text-yellow-700 dark:text-gold'}`}>
                      
                        {trx.status}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

}