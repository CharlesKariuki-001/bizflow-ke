import React, { useState } from 'react';
import { Store, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useTheme } from '../components/ThemeProvider';
interface LoginProps {
  onLogin: () => void;
  onBack?: () => void;
}
export function Login({ onLogin, onBack }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };
  return (
    <div className="min-h-screen bg-background bg-kenya-pattern flex items-center justify-center p-4 relative">
      {onBack &&
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-muted hover:text-text transition-colors z-20">
        
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>
      }

      <div className="w-full max-w-md relative z-10">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gold/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <Card glass className="p-8 relative overflow-hidden">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand via-gold to-accent" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand/10 text-brand mb-4">
              <Store className="w-8 h-8" />
            </div>
            <h1 className="font-display text-3xl font-bold text-text tracking-tight mb-2">
              Welcome to BizFlow <span className="text-brand">KE</span>
            </h1>
            <p className="text-muted">Manage your Kenyan business with ease.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="jambo@business.co.ke"
              leftIcon={<Mail className="w-5 h-5" />}
              required />
            

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-5 h-5" />}
                required />
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-brand hover:text-brand-soft font-medium">
                  
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}>
              
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onLogin}
              className="text-sm font-medium text-brand bg-brand/10 px-4 py-2 rounded-full hover:bg-brand/20 transition-colors">
              
              Skip login & try the demo →
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-muted">
            Don't have an account?{' '}
            <button className="text-brand font-semibold hover:underline">
              Register your business
            </button>
          </div>
        </Card>
      </div>
    </div>);

}