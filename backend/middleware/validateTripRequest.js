const VALID_BUDGETS = ['cheap', 'moderate', 'luxury'];
const MAX_DAYS = 21;

export function validateTripRequest(req, res, next) {
  const { destination, totalDays, budget, vibes } = req.body || {};

  const errors = [];

  if (!destination || typeof destination !== 'string' || destination.trim().length === 0) {
    errors.push('destination is required and must be a non-empty string.');
  }

  const numericDays = Number(totalDays);
  if (!totalDays || Number.isNaN(numericDays) || numericDays <= 0) {
    errors.push('totalDays is required and must be a positive number.');
  } else if (numericDays > MAX_DAYS) {
    errors.push(`totalDays cannot exceed ${MAX_DAYS}.`);
  }

  if (!budget || !VALID_BUDGETS.includes(String(budget).toLowerCase())) {
    errors.push(`budget is required and must be one of: ${VALID_BUDGETS.join(', ')}.`);
  }

  if (vibes !== undefined && !Array.isArray(vibes)) {
    errors.push('vibes must be an array of strings when provided.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request payload.',
      details: errors,
    });
  }

  req.body.totalDays = numericDays;
  req.body.budget = String(budget).toLowerCase();
  req.body.vibes = Array.isArray(vibes) ? vibes : [];
  req.body.destination = destination.trim();

  next();
}