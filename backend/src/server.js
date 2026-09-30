import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { transitRouter } from './routes/transitRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/transit', transitRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'GoRide Multi-Modal Mobility API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 2rem; background: #0f172a; color: #f8fafc; min-height: 100vh;">
      <h1 style="color: #10b981;">GoRide Backend API is Running 🚀</h1>
      <p>Endpoints available:</p>
      <ul>
        <li><code>GET /api/health</code> - Health check</li>
        <li><code>GET /api/transit/modes</code> - Available transit options</li>
        <li><code>GET /api/transit/stations</code> - Transit stations and stops</li>
        <li><code>POST /api/transit/search</code> - Route calculation</li>
        <li><code>POST /api/transit/book</code> - Ride and Pass booking</li>
      </ul>
    </div>
  `);
});

// Start listening
app.listen(PORT, () => {
  console.log(`GoRide API server running on http://localhost:${PORT}`);
});
