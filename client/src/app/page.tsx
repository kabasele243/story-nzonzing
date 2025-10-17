'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Film,
  Image,
  Play,
  ArrowRight,
  CheckCircle2,
  Layers,
  Zap,
  Users,
  BookOpen,
  Star,
  Quote,
  Check,
  ChevronDown,
  Video,
  Mic,
  PenTool,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Film,
      title: 'Series Creator',
      description: 'Build multi-episode series with consistent characters and evolving plot threads.',
    },
    {
      icon: Sparkles,
      title: 'Story Expander',
      description: 'Transform brief summaries into rich, detailed narratives with AI assistance.',
    },
    {
      icon: Image,
      title: 'Scene Generator',
      description: 'Break stories into visual scenes with multi-angle image prompts for creators.',
    },
    {
      icon: Layers,
      title: 'Complete Pipeline',
      description: 'One-click workflow from idea to full story with scenes and prompts.',
    },
    {
      icon: Play,
      title: 'Episode Writer',
      description: 'Write episodes with full continuity tracking and character consistency.',
    },
    {
      icon: BookOpen,
      title: 'Character Management',
      description: 'Create and maintain consistent characters across all your stories.',
    },
  ];

  const benefits = [
    'AI-powered story generation',
    'Multi-angle image prompts',
    'Character continuity tracking',
    'Series and episode management',
    'Scene-by-scene breakdowns',
    'Customizable story duration',
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Content Creator',
      avatar: '👩‍🎨',
      rating: 5,
      text: 'Nzonzing transformed how I create content. What used to take days now takes hours. The AI-generated scenes are incredibly detailed!',
    },
    {
      name: 'Michael Chen',
      role: 'Indie Filmmaker',
      avatar: '🎬',
      rating: 5,
      text: 'The multi-angle image prompts are a game-changer for pre-visualization. This tool has become essential to my creative workflow.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'YouTube Creator',
      avatar: '📹',
      rating: 5,
      text: 'Creating series with consistent characters was always a challenge. Nzonzing makes it effortless. My audience loves the continuity!',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '5 stories per month',
        'Basic story expansion',
        'Scene generation',
        'Community support',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'For serious creators',
      features: [
        'Unlimited stories',
        'Advanced AI features',
        'Multi-episode series',
        'Priority support',
        'Export in multiple formats',
        'Custom character templates',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Studio',
      price: '$99',
      period: 'per month',
      description: 'For teams and agencies',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'API access',
        'Custom workflows',
        'Dedicated support',
        'White-label options',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: 'How does the AI story generation work?',
      answer: 'Our AI uses advanced language models trained on narrative structures to help expand your ideas into full stories. You provide the summary or concept, and the AI generates detailed narratives while maintaining consistency in characters, plot, and tone.',
    },
    {
      question: 'Can I edit the AI-generated content?',
      answer: 'Absolutely! All generated content is fully editable. The AI serves as your creative assistant, providing a strong foundation that you can refine and customize to match your exact vision.',
    },
    {
      question: 'What are multi-angle image prompts?',
      answer: 'Multi-angle prompts provide 6 different camera perspectives for each scene (main, close-up, wide-shot, over-shoulder, dutch-angle, birds-eye). This is perfect for filmmakers, animators, and content creators who need comprehensive visual references.',
    },
    {
      question: 'How does character continuity work across episodes?',
      answer: 'Our system maintains a master character database for each series, tracking visual descriptions, personality traits, and story arcs. This ensures your characters remain consistent across all episodes in a series.',
    },
    {
      question: 'Can I export my stories?',
      answer: 'Yes! Pro and Studio plans include export features in multiple formats including PDF, Word documents, and plain text. You can also copy content directly from the interface.',
    },
    {
      question: 'Is there a limit to story length?',
      answer: 'Free users can create stories up to 10 minutes in duration (approximately 1,500 words). Pro users have unlimited length, and you can customize duration to match your needs (5, 10, or 30-minute formats).',
    },
  ];

  const useCases = [
    {
      icon: Video,
      title: 'Video Content Creators',
      description: 'Generate scripts with scene breakdowns and visual prompts for YouTube, TikTok, or streaming platforms.',
      color: 'from-red-500/20 to-pink-500/20',
    },
    {
      icon: Mic,
      title: 'Podcast Producers',
      description: 'Develop episode narratives and story arcs for serialized podcast content with character continuity.',
      color: 'from-purple-500/20 to-blue-500/20',
    },
    {
      icon: PenTool,
      title: 'Writers & Authors',
      description: 'Overcome writer\'s block and expand story ideas into full narratives with consistent world-building.',
      color: 'from-green-500/20 to-teal-500/20',
    },
    {
      icon: Film,
      title: 'Filmmakers & Animators',
      description: 'Pre-visualize scenes with detailed camera angle prompts and maintain visual consistency across shots.',
      color: 'from-orange-500/20 to-yellow-500/20',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Start with Your Idea',
      description: 'Enter a brief summary or concept for your story, series, or episode.',
    },
    {
      step: 2,
      title: 'AI Expands Your Vision',
      description: 'Our AI analyzes your input and generates rich narratives with detailed scenes and characters.',
    },
    {
      step: 3,
      title: 'Refine & Customize',
      description: 'Edit the generated content, adjust characters, and fine-tune the story to match your vision.',
    },
    {
      step: 4,
      title: 'Export & Create',
      description: 'Download your story, use the image prompts for visuals, or continue building your series.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
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

      {/* Screenshots/App Preview Section */}
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

      {/* How It Works Section */}
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
              How It Works
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              From idea to finished story in four simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-accent/20 border-2 border-primary-accent flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-accent">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-text-secondary">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-accent/50 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-sidebar-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Powerful Tools for Storytellers
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Everything you need to create, expand, and visualize your stories
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-6 bg-bg border border-border rounded-lg hover:border-primary-accent transition-all group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-accent/20 flex items-center justify-center mb-4 group-hover:bg-primary-accent/30 transition-colors">
                    <Icon className="w-6 h-6 text-primary-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
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
              Whether you're making videos, podcasts, films, or writing books
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

      {/* Testimonials Section */}
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
              Loved by Creators
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              See what our community has to say
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 bg-bg rounded-xl border border-border"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary-accent text-primary-accent" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary-accent/30 mb-3" />
                <p className="text-text-secondary mb-6 italic">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-accent/20 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-text-secondary">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
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
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Choose the plan that fits your creative needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`p-8 rounded-2xl border-2 ${plan.highlighted
                  ? 'border-primary-accent bg-primary-accent/5'
                  : 'border-border bg-bg'
                  } relative`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-accent text-bg text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-text-secondary">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => router.push('/dashboard')}
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-sidebar-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-text-secondary">
              Everything you need to know about Nzonzing
            </p>
          </motion.div>

          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-bg border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-hover transition-colors"
                >
                  <span className="font-semibold text-foreground pr-8">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-text-secondary transition-transform flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-text-secondary">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
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

      {/* CTA Section */}
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
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-text-secondary text-sm">
              © 2025 Nzonzing. AI-Powered Storytelling Platform.
            </div>
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Sparkles className="w-4 h-4 text-primary-accent" />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
