// Optional: use Lumen tokens as Tailwind utilities (bg-accent, text-label-secondary, rounded-xl, text-headline…)
import lumen from '@lumen/tokens/tailwind';

export default {
  presets: [lumen],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
};
