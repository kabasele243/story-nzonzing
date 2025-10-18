'use client';

import { motion } from 'framer-motion';
import { useCases } from './data';

export function UseCasesSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Built for Creators
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Whether you&apos;re making videos, podcasts, films, or writing books
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={index}
                className={`p-8 rounded-2xl bg-gradient-to-br ${useCase.color} border border-border`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <Icon className="w-12 h-12 text-primary-accent mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-3">{useCase.title}</h3>
                <p className="text-text-secondary">{useCase.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
