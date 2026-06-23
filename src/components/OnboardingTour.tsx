import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
interface OnboardingTourProps {
  onComplete: () => void;
}
export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(1);
  const handleNext = () => setStep((prev) => prev + 1);
  const handleSkip = () => onComplete();
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {step === 1 &&
        <motion.div
          key="step1"
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 0.95
          }}
          className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          
            <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-display font-bold text-text mb-2">
              Karibu, Wanjiku! 👋
            </h2>
            <p className="text-muted mb-8">
              Let's set up your business in 3 minutes so you can start selling.
            </p>
            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={handleNext}>
                Take the tour
              </Button>
              <Button size="lg" variant="ghost" onClick={handleSkip}>
                Skip for now
              </Button>
            </div>
          </motion.div>
        }

        {step === 2 &&
        <motion.div
          key="step2"
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: -20
          }}
          className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-8">
          
            <h2 className="text-xl font-display font-bold text-text mb-6">
              Business Profile
            </h2>
            <div className="space-y-4 mb-8">
              <Input
              label="Business Name"
              defaultValue="Mama John Supermarket" />
            
              <Input label="KRA PIN" defaultValue="P051234567X" />
              <Input label="Phone Number" defaultValue="0712 345 678" />
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleSkip}>
                Skip
              </Button>
              <Button onClick={handleNext}>Continue</Button>
            </div>
          </motion.div>
        }

        {step === 3 &&
        <motion.div
          key="step3"
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 0.95
          }}
          className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-display font-bold text-text mb-2">
              🎉 You're all set!
            </h2>
            <p className="text-muted mb-8">
              Your store is ready. We've loaded some demo data so you can
              explore.
            </p>
            <Button size="lg" className="w-full" onClick={onComplete}>
              Go to Dashboard
            </Button>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}