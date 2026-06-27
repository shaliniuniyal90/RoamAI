const BUDGET_GUIDANCE = {
  cheap:
    'Cheap: Focus on street food, free sightseeing, public transport.',
  moderate:
    'Moderate: Standard cafes, paid monument entries, auto/cabs.',
  luxury:
    'Luxury: Fine dining, premium adventure activities, private transfers.',
};

const SYSTEM_INSTRUCTIONS = `Act as an expert global travel planner. Generate a highly detailed, personalized day-by-day itinerary based on the user's inputs.
You must respond STRICTLY with a valid JSON array of objects. Do not include any markdown formatting, markdown code blocks (like \`\`\`json), or conversational filler text.
The JSON array must follow this exact typescript schema:
Array<{
  day: number;
  time: string;
  activityTitle: string;
  activityDescription: string;
  estimatedCostInINR: number;
  iconType: 'hotel' | 'mountain' | 'utensils' | 'shopping' | 'compass';
}>
Budget constraints to guide your activity selections:
- Cheap: Focus on street food, free sightseeing, public transport.
- Moderate: Standard cafes, paid monument entries, auto/cabs.
- Luxury: Fine dining, premium adventure activities, private transfers.`;

export function buildItineraryPrompt({ destination, totalDays, budget, vibes }) {
  const normalizedBudget = (budget || 'moderate').toLowerCase();
  const budgetLine = BUDGET_GUIDANCE[normalizedBudget] || BUDGET_GUIDANCE.moderate;
  const vibesLine = Array.isArray(vibes) && vibes.length > 0
    ? vibes.join(', ')
    : 'General sightseeing';

  return `${SYSTEM_INSTRUCTIONS}

---
USER TRIP REQUEST:
- Destination: ${destination}
- Total Days: ${totalDays}
- Selected Budget Tier: ${normalizedBudget} (${budgetLine})
- Preferred Travel Vibes: ${vibesLine}

Generate exactly ${totalDays} day(s) worth of itinerary entries, with multiple time-blocked activities per day (e.g. Morning, Afternoon, Evening). Tailor activity selection to the requested vibes (${vibesLine}) and respect the budget tier described above. Return ONLY the raw JSON array — no prose, no markdown fences.`;
}