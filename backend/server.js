import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { buildItineraryPrompt } from './promptBuilder.js';
import { generateItineraryFromPrompt } from './geminiService.js';
import { validateTripRequest } from './middleware/validateTripRequest.js';

const app = express();

app.use(
  cors({
    origin: config.clientOrigin,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', model: config.geminiModel });
});

app.post('/api/generate-trip', validateTripRequest, async (req, res) => {
  const { destination, totalDays, budget, vibes } = req.body;

  try {
    const prompt = buildItineraryPrompt({ destination, totalDays, budget, vibes });
    const itinerary = await generateItineraryFromPrompt(prompt);

    return res.status(200).json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    console.error('[generate-trip] Failed to generate itinerary:', error.message);

    const isParsingError = error instanceof SyntaxError || /JSON/i.test(error.message);

    return res.status(502).json({
      success: false,
      error: isParsingError
        ? 'The AI returned a response we could not parse. Please try again.'
        : 'Failed to generate itinerary. Please try again in a moment.',
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

app.listen(config.port, () => {
  console.log(`🧭 RoamAI backend running on http://localhost:${config.port}`);
  console.log(`   Using Gemini model: ${config.geminiModel}`);
});