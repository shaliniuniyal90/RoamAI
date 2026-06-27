import { useState } from 'react';
import {
  MapPin,
  Calendar,
  Wallet,
  Compass,
  Mountain,
  Waves,
  Landmark,
  UtensilsCrossed,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

const BUDGET_OPTIONS = [
  {
    id: 'cheap',
    label: 'Cheap',
    description: 'Street food, free sights, public transport',
    icon: Wallet,
  },
  {
    id: 'moderate',
    label: 'Moderate',
    description: 'Cafes, paid entries, cabs & autos',
    icon: Compass,
  },
  {
    id: 'luxury',
    label: 'Luxury',
    description: 'Fine dining, premium experiences, private transfers',
    icon: Landmark,
  },
];

const VIBE_OPTIONS = [
  { id: 'Adventure', label: 'Adventure', icon: Mountain },
  { id: 'Relaxation', label: 'Relaxation', icon: Waves },
  { id: 'Historical', label: 'Historical', icon: Landmark },
  { id: 'Foodie', label: 'Foodie', icon: UtensilsCrossed },
];

const TOTAL_STEPS = 3;

export default function MultiStepForm({ onSubmit, isSubmitting }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: '',
    totalDays: '',
    budget: '',
    vibes: [],
  });
  const [stepError, setStepError] = useState('');

  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setStepError('');
  }

  function toggleVibe(vibeId) {
    setFormData((prev) => {
      const exists = prev.vibes.includes(vibeId);
      return {
        ...prev,
        vibes: exists ? prev.vibes.filter((v) => v !== vibeId) : [...prev.vibes, vibeId],
      };
    });
    setStepError('');
  }

  function validateStep() {
    if (step === 1) {
      if (!formData.destination.trim()) return 'Please tell us where you want to go.';
      if (!formData.totalDays || Number(formData.totalDays) <= 0)
        return 'Please enter a valid number of days.';
      if (Number(formData.totalDays) > 21) return 'Trips longer than 21 days aren\'t supported yet.';
    }
    if (step === 2) {
      if (!formData.budget) return 'Please select a budget tier.';
    }
    if (step === 3) {
      if (formData.vibes.length === 0) return 'Please select at least one travel vibe.';
    }
    return '';
  }

  function handleNext() {
    const error = validateStep();
    if (error) {
      setStepError(error);
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function handleBack() {
    setStepError('');
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    const error = validateStep();
    if (error) {
      setStepError(error);
      return;
    }
    onSubmit({
      destination: formData.destination.trim(),
      totalDays: Number(formData.totalDays),
      budget: formData.budget,
      vibes: formData.vibes,
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress tracker */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {Array.from({ length: TOTAL_STEPS }).map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === step;
          const isComplete = stepNum < step;
          return (
            <div key={stepNum} className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono-num text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-journal text-paper scale-110 shadow-lg shadow-journal/30'
                    : isComplete
                    ? 'bg-amber text-ink'
                    : 'bg-paper-border text-ink/40'
                }`}
              >
                {stepNum}
              </div>
              {stepNum < TOTAL_STEPS && (
                <div
                  className={`w-10 h-0.5 rounded transition-colors duration-300 ${
                    isComplete ? 'bg-amber' : 'bg-paper-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Card container */}
      <div className="bg-paper border border-paper-border rounded-2xl shadow-xl shadow-journal/5 p-8 sm:p-10 animate-fade-slide">
        {/* STEP 1: Destination + Days */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-journal mb-1">
                Where to, and for how long?
              </h2>
              <p className="text-ink/60 text-sm">Tell us the basics of your trip.</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-ink/80 mb-2">
                <MapPin className="w-4 h-4 text-journal-light" />
                Destination
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => updateField('destination', e.target.value)}
                placeholder="e.g. Goa, India"
                className="w-full px-4 py-3 rounded-xl border border-paper-border bg-canvas focus:outline-none focus:ring-2 focus:ring-journal/40 focus:border-journal transition-all text-ink placeholder:text-ink/35"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-ink/80 mb-2">
                <Calendar className="w-4 h-4 text-journal-light" />
                Total Days
              </label>
              <input
                type="number"
                min="1"
                max="21"
                value={formData.totalDays}
                onChange={(e) => updateField('totalDays', e.target.value)}
                placeholder="e.g. 5"
                className="w-full px-4 py-3 rounded-xl border border-paper-border bg-canvas focus:outline-none focus:ring-2 focus:ring-journal/40 focus:border-journal transition-all text-ink placeholder:text-ink/35 font-mono-num"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Budget */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-journal mb-1">
                What's your travel budget?
              </h2>
              <p className="text-ink/60 text-sm">This shapes the kind of experiences we plan.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {BUDGET_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = formData.budget === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateField('budget', opt.id)}
                    className={`group text-left p-5 rounded-xl border-2 transition-all duration-200 hover:-translate-y-1 ${
                      isSelected
                        ? 'border-journal bg-journal/5 shadow-md shadow-journal/10'
                        : 'border-paper-border bg-canvas hover:border-journal-light/50'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mb-3 ${
                        isSelected ? 'text-journal' : 'text-ink/40 group-hover:text-journal-light'
                      }`}
                      strokeWidth={1.75}
                    />
                    <p className={`font-display text-lg mb-1 ${isSelected ? 'text-journal' : 'text-ink'}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-ink/55 leading-snug">{opt.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Vibes */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-journal mb-1">
                What's your travel vibe?
              </h2>
              <p className="text-ink/60 text-sm">Pick as many as you like.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {VIBE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = formData.vibes.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleVibe(opt.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5 ${
                      isSelected
                        ? 'border-amber-deep bg-amber/10'
                        : 'border-paper-border bg-canvas hover:border-amber/50'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-amber text-ink' : 'bg-paper-border text-ink/50'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
                    </div>
                    <span className={`font-medium text-sm ${isSelected ? 'text-ink' : 'text-ink/70'}`}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Error message */}
        {stepError && (
          <p className="mt-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            {stepError}
          </p>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-paper-border">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              step === 1
                ? 'opacity-0 pointer-events-none'
                : 'text-ink/60 hover:text-journal hover:bg-canvas'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg font-medium text-sm bg-journal text-paper hover:bg-journal-deep transition-all duration-200 hover:shadow-lg hover:shadow-journal/20"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm bg-amber-deep text-ink hover:bg-amber-deep/90 transition-all duration-200 hover:shadow-lg hover:shadow-amber/30 disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Planning...
                </>
              ) : (
                <>
                  Generate My Trip
                  <Compass className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}