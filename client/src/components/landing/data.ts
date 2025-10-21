import {
  Film,
  Sparkles,
  Image,
  Play,
  Layers,
  BookOpen,
  Video,
  Mic,
  PenTool,
} from 'lucide-react';

export const features = [
  {
    icon: Sparkles,
    title: 'AI Story Generation',
    description: 'Transform your core idea into a complete narrative with AI-powered creativity.',
  },
  {
    icon: Layers,
    title: 'Story Construction Menu',
    description: 'Choose from tailored options for protagonist, conflict, setting, and theme.',
  },
  {
    icon: BookOpen,
    title: 'Multiple Story Lengths',
    description: 'Generate stories from 5 to 40 minutes, perfect for any reading experience.',
  },
  {
    icon: PenTool,
    title: 'Instant Templates',
    description: 'Start quickly with pre-made story templates or create from scratch.',
  },
  {
    icon: Image,
    title: 'Easy Sharing',
    description: 'Share your stories with one click or download in multiple formats.',
  },
  {
    icon: Play,
    title: 'Auto-Save Progress',
    description: 'Never lose your work with automatic saving of all your story selections.',
  },
];

export const benefits = [
  'AI-powered story generation',
  'Multi-angle image prompts',
  'Character continuity tracking',
  'Series and episode management',
  'Scene-by-scene breakdowns',
  'Customizable story duration',
];

export const testimonials = [
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

export const pricingPlans = [
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

export const faqs = [
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

export const useCases = [
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

export const howItWorks = [
  {
    step: 1,
    title: 'Share Your Idea',
    description: 'Enter your core story concept and choose the desired reading length (5-40 minutes).',
  },
  {
    step: 2,
    title: 'Choose Story Elements',
    description: 'Select from AI-generated options for protagonist, conflict, setting, and theme tailored to your idea.',
  },
  {
    step: 3,
    title: 'Get Your Story',
    description: 'Receive a complete, polished narrative ready to read, share, or download instantly.',
  },
];
