import React from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Smartphone,
  Package,
  BarChart3,
  WifiOff,
  Users,
  Sparkles,
  Play,
  CheckCircle2 } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { PlanCard } from '../components/billing/PlanCard';
interface LandingProps {
  onNavigate: (view: 'login' | 'landing') => void;
}
export function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="min-h-screen bg-background text-text font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand">
            <Store className="w-6 h-6" />
            <span className="font-display font-bold text-xl text-text tracking-tight">
              BizFlow <span className="text-brand">KE</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <a href="#features" className="hover:text-text transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-text transition-colors">
              Pricing
            </a>
            <a
              href="#testimonials"
              className="hover:text-text transition-colors">
              
              Customers
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="hidden sm:flex"
              onClick={() => onNavigate('login')}>
              
              Sign In
            </Button>
            <Button onClick={() => onNavigate('login')}>
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-kenya-pattern opacity-50 pointer-events-none" />
        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5
            }}
            className="max-w-2xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6 border border-brand/20">
              <span>🇰🇪</span> Made for Kenyan SMEs
            </div>
            <h1 className="text-5xl sm:text-6xl font-display font-bold tracking-tight text-text leading-[1.1] mb-6">
              Run your duka <br />
              <span className="text-brand">like a pro.</span>
            </h1>
            <p className="text-lg text-muted mb-8 leading-relaxed">
              The all-in-one Business OS for shops, pharmacies, agro-vets and
              restaurants. M-Pesa, inventory, sales and KRA — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="lg" onClick={() => onNavigate('login')}>
                Start free — no card needed
              </Button>
              <Button
                size="lg"
                variant="secondary"
                leftIcon={<Play className="w-4 h-4" />}>
                
                Watch 2-min demo
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) =>
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-surface border-2 border-background flex items-center justify-center text-xs font-bold text-brand shadow-sm">
                  
                    {String.fromCharCode(64 + i)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-text">
                  Trusted by 1,200+ businesses
                </p>
                <p className="flex items-center gap-1 text-gold">
                  ★★★★★ <span className="text-muted">4.9/5 rating</span>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }}
            className="relative lg:h-[500px] flex items-center justify-center">
            
            <motion.div
              animate={{
                y: [0, -8, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
              
              <div className="h-12 bg-black/5 dark:bg-white/5 border-b border-border flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-accent/50" />
                <div className="w-3 h-3 rounded-full bg-gold/50" />
                <div className="w-3 h-3 rounded-full bg-brand/50" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-32 h-6 bg-black/5 dark:bg-white/5 rounded-md" />
                  <div className="w-16 h-6 bg-brand/10 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-black/5 dark:bg-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 bg-brand/10 rounded-lg" />
                    <div className="w-20 h-4 bg-black/10 dark:bg-white/10 rounded" />
                  </div>
                  <div className="h-24 bg-black/5 dark:bg-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg" />
                    <div className="w-16 h-4 bg-black/10 dark:bg-white/10 rounded" />
                  </div>
                </div>
                <div className="h-40 bg-black/5 dark:bg-white/5 rounded-xl" />
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, 10, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1
              }}
              className="absolute -right-4 top-20 bg-surface border border-border p-3 rounded-xl shadow-lg flex items-center gap-3">
              
              <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted">New Sale</p>
                <p className="text-sm font-bold text-text">KES 1,250</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-border bg-black/5 dark:bg-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <p className="text-center text-sm font-medium text-muted mb-6 uppercase tracking-wider">
            Trusted by growing Kenyan businesses
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale font-display font-bold text-lg">
            <span>Mama John Supermarket</span>
            <span>Jamhuri Pharmacy</span>
            <span>Kilimani Agro</span>
            <span>Soko Kuu</span>
            <span>Nakuru Hardware</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text mb-4">
            Everything you need to grow
          </h2>
          <p className="text-lg text-muted">
            BizFlow replaces your notebook, calculator, and scattered
            spreadsheets with one powerful, easy-to-use system.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
          {
            icon: Smartphone,
            title: 'Lipa na M-Pesa',
            desc: 'Accept M-Pesa payments with Till Numbers. STK push, automatic reconciliation.'
          },
          {
            icon: Package,
            title: 'Smart Inventory',
            desc: 'Track stock across branches with low-stock and expiry alerts.'
          },
          {
            icon: BarChart3,
            title: 'Beautiful Reports',
            desc: 'Daily Z-reports, profit margins, top sellers — KRA-ready.'
          },
          {
            icon: WifiOff,
            title: 'Works Offline',
            desc: 'Sell even when the internet goes down. Auto-syncs when reconnected.'
          },
          {
            icon: Users,
            title: 'Team & Roles',
            desc: 'Owner, manager, cashier roles with clock-in and performance tracking.'
          },
          {
            icon: Sparkles,
            title: 'AI Insights',
            desc: 'Get suggestions on reordering, bundling and pricing — powered by your data.'
          }].
          map((f, i) =>
          <motion.div
            key={i}
            whileHover={{
              y: -5
            }}
            className="bg-surface border border-border p-6 rounded-2xl shadow-soft-sm hover:border-brand/50 hover:shadow-soft transition-all">
            
              <div className="w-12 h-12 bg-brand/10 text-brand rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text mb-2">{f.title}</h3>
              <p className="text-muted">{f.desc}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black/5 dark:bg-white/5 rounded-3xl my-12">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted">
            Start for free, upgrade when you need more power.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
            cta="Start Free"
            ctaVariant="outline"
            onCtaClick={() => onNavigate('login')} />
          
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
            cta="Start 14-Day Trial"
            isPopular
            onCtaClick={() => onNavigate('login')} />
          
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
            ctaVariant="secondary" />
          
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-brand rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-kenya-pattern opacity-20 mix-blend-overlay" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Karibu — start running your business better today.
            </h2>
            <p className="text-brand-100 text-lg mb-8 text-white/80">
              Join thousands of Kenyan businesses growing with BizFlow.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-brand hover:bg-gray-100"
              onClick={() => onNavigate('login')}>
              
              Start free, upgrade when you grow
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-brand">
            <Store className="w-6 h-6" />
            <span className="font-display font-bold text-xl text-text tracking-tight">
              BizFlow <span className="text-brand">KE</span>
            </span>
          </div>
          <p className="text-sm text-muted">
            © 2026 BizFlow KE. Built in Nairobi 🇰🇪.
          </p>
        </div>
      </footer>
    </div>);

}