'use client';

import { Film, Image, Layers, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function ScreenshotsSection() {
  return (
    <section className="py-24 bg-sidebar-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            See Nzonzing in Action
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Intuitive interface designed for creators
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Main Dashboard Preview */}
          <motion.div
            className="rounded-2xl border-2 border-primary-accent/20 overflow-hidden bg-bg shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-hover p-4 border-b border-border flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="flex-1 text-center text-sm text-text-secondary">Dashboard</div>
            </div>
            <div className="aspect-video bg-gradient-to-br from-sidebar-bg to-bg p-8 flex items-center justify-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
                <div className="aspect-square rounded-lg bg-hover border border-border p-6 flex flex-col items-center justify-center">
                  <Film className="w-12 h-12 text-primary-accent mb-3" />
                  <div className="text-sm font-semibold text-foreground">New Series</div>
                </div>
                <div className="aspect-square rounded-lg bg-hover border border-border p-6 flex flex-col items-center justify-center">
                  <Layers className="w-12 h-12 text-primary-accent mb-3" />
                  <div className="text-sm font-semibold text-foreground">New Story</div>
                </div>
                <div className="aspect-square rounded-lg bg-hover border border-border p-6 flex flex-col items-center justify-center">
                  <Sparkles className="w-12 h-12 text-primary-accent mb-3" />
                  <div className="text-sm font-semibold text-foreground">Expand Text</div>
                </div>
                <div className="aspect-square rounded-lg bg-hover border border-border p-6 flex flex-col items-center justify-center">
                  <Image className="w-12 h-12 text-primary-accent mb-3" />
                  <div className="text-sm font-semibold text-foreground">Generate Scenes</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="rounded-xl border border-border overflow-hidden bg-bg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-hover p-3 border-b border-border">
                <div className="text-xs text-text-secondary">Series Creator</div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-primary-accent/10 to-transparent p-6 flex items-center justify-center">
                <div className="text-center">
                  <Film className="w-16 h-16 text-primary-accent mx-auto mb-4" />
                  <div className="text-sm text-foreground font-semibold mb-2">Multi-Episode Series</div>
                  <div className="text-xs text-text-secondary">Character tracking & plot threads</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl border border-border overflow-hidden bg-bg"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-hover p-3 border-b border-border">
                <div className="text-xs text-text-secondary">Scene Generator</div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-primary-accent/10 to-transparent p-6 flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-16 h-16 text-primary-accent mx-auto mb-4" />
                  <div className="text-sm text-foreground font-semibold mb-2">Multi-Angle Prompts</div>
                  <div className="text-xs text-text-secondary">6 camera perspectives per scene</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
