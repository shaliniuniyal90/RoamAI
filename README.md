# 🧭 RoamAI — Smart AI Travel Itinerary Planner

RoamAI is a full-stack web application that generates personalized, day-by-day travel itineraries using Google's Gemini AI. Users input their destination, trip duration, budget, and travel preferences, and the app returns a complete, structured itinerary with cost estimates.

**🔗 Live Demo:** [https://roam-ai-weld.vercel.app](https://roam-ai-weld.vercel.app)

## ✨ Features

- **3-Step Guided Form** — Collects destination, trip length, budget tier, and travel vibes through an intuitive multi-step wizard
- **AI-Generated Itineraries** — Uses Google Gemini (`gemini-2.5-flash`) to generate detailed, day-wise activity plans
- **Interactive Dashboard** — Day-by-day navigation with a vertical timeline view of activities
- **Cost Calculator** — Automatically sums estimated costs (in INR) across the entire trip
- **Secure Backend** — API key is never exposed to the client; all AI calls are handled server-side
- **Responsive Design** — Built with Tailwind CSS for a clean experience across devices

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Lucide React (icons)
- Axios

**Backend:**
- Node.js + Express.js
- Google Generative AI SDK (`@google/generative-ai`)
- CORS, dotenv

**Deployment:**
- Frontend hosted on Vercel
- Backend hosted on Render

## 📂 Project Structure
