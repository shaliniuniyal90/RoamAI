import { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

const LOADING_MESSAGES = [
  'AI is mapping your coordinates...',
  'Scouting the best local spots...',
  'Calculating your daily budget...',
  'Packing your itinerary with adventure...',
  'Almost there, finalizing your route...',
];

export default function LoadingSpinner() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-journal/15"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-journal animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Compass className="w-8 h-8 text-amber-deep" strokeWidth={1.75} />
        </div>
      </div>

      <p className="font-display text-xl text-journal text-center transition-opacity duration-300">
        {LOADING_MESSAGES[messageIndex]}
      </p>

      <p className="font-mono-num text-xs text-ink/50 tracking-wide uppercase">
        Crafting your journey
      </p>
    </div>
  );
}