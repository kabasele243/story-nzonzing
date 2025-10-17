// Theme configuration based on design.json

export const theme = {
  colors: {
    background: '#0a0a0a',        // Deep black
    sidebarBg: '#1a1a1a',         // Dark gray/black
    cardBg: '#1f1f1f',            // Card background
    text: '#ffffff',               // White text
    textSecondary: '#a0a0a0',     // Light gray
    primaryAccent: '#10b981',     // Bright green
    border: '#2a2a2a',            // Subtle borders
    hover: '#252525',             // Hover states
    error: '#ef4444',             // Error red
    success: '#10b981',           // Success green
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    weights: {
      regular: 400,
      semibold: 600,
      bold: 700,
    },
  },
} as const;
