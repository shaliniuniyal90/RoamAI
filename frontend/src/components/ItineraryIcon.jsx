import { Hotel, Mountain, UtensilsCrossed, ShoppingBag, Compass } from 'lucide-react';

const ICON_MAP = {
  hotel: Hotel,
  mountain: Mountain,
  utensils: UtensilsCrossed,
  shopping: ShoppingBag,
  compass: Compass,
};

export default function ItineraryIcon({ iconType, className = 'w-5 h-5' }) {
  const Icon = ICON_MAP[iconType] || Compass;
  return <Icon className={className} strokeWidth={1.75} />;
}