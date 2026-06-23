import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
interface PlanCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  ctaVariant?: 'primary' | 'secondary' | 'outline';
  isPopular?: boolean;
  isCurrent?: boolean;
  onCtaClick?: () => void;
}
export function PlanCard({
  name,
  price,
  period = '/mo',
  description,
  features,
  cta,
  ctaVariant = 'primary',
  isPopular,
  isCurrent,
  onCtaClick
}: PlanCardProps) {
  return (
    <Card
      glass
      className={`relative flex flex-col h-full ${isPopular ? 'border-brand shadow-soft-lg' : ''}`}>
      
      {isPopular &&
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          MOST POPULAR
        </div>
      }
      {isCurrent &&
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface border border-border text-text text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          CURRENT PLAN
        </div>
      }

      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-display font-bold text-text mb-2">
          {name}
        </h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-display font-bold text-text">
            {price}
          </span>
          {price !== 'Custom' &&
          <span className="text-muted text-sm">{period}</span>
          }
        </div>
        <p className="text-sm text-muted">{description}</p>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <ul className="space-y-3 mb-8 flex-1">
          {features.map((feature, i) =>
          <li key={i} className="flex items-start gap-3 text-sm text-text">
              <Check className="w-5 h-5 text-brand shrink-0" />
              <span>{feature}</span>
            </li>
          )}
        </ul>

        <Button
          variant={ctaVariant}
          className="w-full"
          disabled={isCurrent}
          onClick={onCtaClick}>
          
          {cta}
        </Button>
      </div>
    </Card>);

}