'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Zap, Film, Image, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { benefits } from './data';

export function BenefitsSection() {
  const router = useRouter();

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Why Choose Nzonzing?
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Our AI-powered platform combines cutting-edge technology with intuitive design
              to help you create professional-quality stories and visual content.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <CheckCircle2 className="w-6 h-6 text-primary-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-6"
              >
                Start Creating Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-accent/20 to-primary-accent/5 border border-primary-accent/20 p-8 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                {[
                  { icon: Zap, delay: 0 },
                  { icon: Film, delay: 0.1 },
                  { icon: Image, delay: 0.2 },
                  { icon: Users, delay: 0.3 },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="aspect-square rounded-lg bg-bg border border-border p-4 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.delay, duration: 0.5 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <item.icon className="w-12 h-12 text-primary-accent" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
