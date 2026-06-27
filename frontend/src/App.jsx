import { useState } from 'react';
import { Compass } from 'lucide-react';
import MultiStepForm from './components/MultiStepForm';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import { generateTrip } from './services/tripApi';

const VIEW = {
  FORM: 'form',
  LOADING: 'loading',
  DASHBOARD: 'dashboard',
  ERROR: 'error',
};

export default function App() {
  const [view, setView] = useState(VIEW.FORM);
  const [itinerary, setItinerary] = useState([]);
  const [tripMeta, setTripMeta] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleFormSubmit(formData) {
    setView(VIEW.LOADING);
    setErrorMessage('');

    try {
      const result = await generateTrip(formData);
      setItinerary(result);
      setTripMeta({ destination: formData.destination, totalDays: formData.totalDays });
      setView(VIEW.DASHBOARD);
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
      setView(VIEW.ERROR);
    }
  }

  function handleReset() {
    setItinerary([]);
    setTripMeta(null);
    setErrorMessage('');
    setView(VIEW.FORM);
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      {/* Header / Brand */}
      {view !== VIEW.DASHBOARD && (
        <header className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-7 h-7 text-journal" strokeWidth={1.75} />
            <span className="font-display text-2xl text-journal">RoamAI</span>
          </div>
          <p className="text-ink/55 text-sm max-w-md">
            Your AI-powered travel companion — tell us your plans, and we'll map out the perfect itinerary.
          </p>
        </header>
      )}

      {/* View switcher */}
      {view === VIEW.FORM && (
        <MultiStepForm onSubmit={handleFormSubmit} isSubmitting={false} />
      )}

      {view === VIEW.LOADING && <LoadingSpinner />}

      {view === VIEW.DASHBOARD && tripMeta && (
        <Dashboard itinerary={itinerary} tripMeta={tripMeta} onReset={handleReset} />
      )}

      {view === VIEW.ERROR && (
        <div className="max-w-md mx-auto text-center bg-paper border border-paper-border rounded-2xl p-8">
          <p className="text-red-600 font-medium mb-4">{errorMessage}</p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-lg bg-journal text-paper font-medium text-sm hover:bg-journal-deep transition-all"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}