'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  const router = useRouter();

  return (
    <section className="py-24 bg-sidebar-bg">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold text-foreground mb-6">
          Ready to Bring Your Stories to Life?
        </h2>
        <p className="text-xl text-text-secondary mb-8">
          Join creators who are transforming their ideas into compelling narratives
        </p>
        <Button
          onClick={() => router.push('/dashboard')}
          className="text-lg px-10 py-6"
        >
          Get Started for Free
        </Button>
      </motion.div>
    </section>
  );
}
