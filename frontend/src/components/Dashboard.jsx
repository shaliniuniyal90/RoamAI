import { useState, useMemo } from 'react';
import { Clock, Wallet, RotateCcw, MapPin } from 'lucide-react';
import ItineraryIcon from './ItineraryIcon';

export default function Dashboard({ itinerary, tripMeta, onReset }) {
  const dayNumbers = useMemo(() => {
    const days = [...new Set(itinerary.map((item) => item.day))];
    return days.sort((a, b) => a - b);
  }, [itinerary]);

  const [activeDay, setActiveDay] = useState(dayNumbers[0] || 1);

  const activeDayItems = useMemo(
    () => itinerary.filter((item) => item.day === activeDay),
    [itinerary, activeDay]
  );

  const totalCost = useMemo(
    () => itinerary.reduce((sum, item) => sum + (Number(item.estimatedCostInINR) || 0), 0),
    [itinerary]
  );

  const dayCost = useMemo(
    () => activeDayItems.reduce((sum, item) => sum + (Number(item.estimatedCostInINR) || 0), 0),
    [activeDayItems]
  );

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-slide">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-journal-light text-sm font-medium mb-1.5">
            <MapPin className="w-4 h-4" />
            {tripMeta.destination}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-journal">
            Your {tripMeta.totalDays}-Day Itinerary
          </h1>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-ink/60 border border-paper-border hover:border-journal hover:text-journal transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Plan Another Trip
        </button>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* LEFT SIDEBAR: Day Navigation */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="bg-paper border border-paper-border rounded-2xl p-3 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            {dayNumbers.map((day) => {
              const isActive = day === activeDay;
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`shrink-0 text-left px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-journal text-paper shadow-md shadow-journal/20'
                      : 'text-ink/60 hover:bg-canvas hover:text-journal'
                  }`}
                >
                  Day {day}
                </button>
              );
            })}
          </div>

          {/* Cost Calculator Card */}
          <div className="mt-4 bg-journal text-paper rounded-2xl p-5">
            <div className="flex items-center gap-2 text-amber-soft text-xs font-medium uppercase tracking-wide mb-2">
              <Wallet className="w-3.5 h-3.5" />
              Total Trip Cost
            </div>
            <p className="font-mono-num text-3xl font-semibold">
              ₹{totalCost.toLocaleString('en-IN')}
            </p>
            <p className="text-paper/60 text-xs mt-1">
              Estimated for all {dayNumbers.length} day(s)
            </p>
          </div>
        </aside>

        {/* RIGHT FEED: Timeline */}
        <main>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl text-journal">Day {activeDay}</h2>
            <span className="font-mono-num text-sm text-amber-deep font-medium">
              ₹{dayCost.toLocaleString('en-IN')} today
            </span>
          </div>

          <div className="relative pl-2">
            {/* Vertical route line */}
            <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-paper-border" />

            <div className="space-y-5">
              {activeDayItems.map((item, idx) => (
                <div key={idx} className="relative flex gap-4 animate-fade-slide">
                  {/* Icon node on the route line */}
                  <div className="relative z-10 shrink-0 w-14 h-14 rounded-full bg-paper border-2 border-journal flex items-center justify-center text-journal">
                    <ItineraryIcon iconType={item.iconType} className="w-6 h-6" />
                  </div>

                  {/* Ticket-stub card */}
                  <div className="flex-1 bg-paper border border-paper-border rounded-2xl p-5 hover:shadow-lg hover:shadow-journal/5 hover:-translate-y-0.5 transition-all duration-200">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="flex items-center gap-1 text-xs font-medium text-journal-light bg-journal/5 px-2.5 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    </div>

                    <h3 className="font-display text-lg text-ink mb-1.5">
                      {item.activityTitle}
                    </h3>

                    <p className="text-sm text-ink/65 leading-relaxed mb-3">
                      {item.activityDescription}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-paper-border">
                      <span className="text-xs text-ink/45 uppercase tracking-wide">
                        Estimated Cost
                      </span>
                      <span className="font-mono-num font-semibold text-amber-deep">
                        ₹{Number(item.estimatedCostInINR).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {activeDayItems.length === 0 && (
                <p className="text-ink/50 text-sm py-8 text-center">
                  No activities found for this day.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}