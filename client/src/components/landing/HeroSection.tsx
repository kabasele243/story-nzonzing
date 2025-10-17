'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden">
      {/* Dotted Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff08_1px,transparent_1px)] bg-[length:24px_24px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-24 sm:pb-32">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-accent/10 border border-primary-accent/20 rounded-full mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4 text-primary-accent" />
            <span className="text-sm font-medium text-primary-accent">AI-Powered Storytelling</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Transform Ideas Into
            <br />
            <span className="text-primary-accent">Rich Narratives</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-xl sm:text-2xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Create compelling stories, series, and visual content with AI.
            From concept to scene-by-scene breakdowns with image prompts.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Button
              onClick={() => router.push('/dashboard')}
              className="flex text-lg px-7 py-3 min-w-[200px]"
            >
              <p>Get Started</p>
              <ArrowRight className="w-6 h-8 ml-3" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-lg px-6 py-3 min-w-[200px]"
            >
              Learn More
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-accent mb-2">∞</div>
              <div className="text-sm text-text-secondary">Stories Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-accent mb-2">6+</div>
              <div className="text-sm text-text-secondary">AI Workflows</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-accent mb-2">100%</div>
              <div className="text-sm text-text-secondary">Creative Freedom</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
