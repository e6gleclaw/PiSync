import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import syncEventRoutes from './routes/syncEvent.js';
import deviceRoutes from './routes/device.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Swagger setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PiSync API',
      version: '1.0.0',
      description: 'API documentation for PiSync backend',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 3000}` },
    ],
  },
  apis: [path.join(__dirname, './routes/*.js')],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/sync-event', syncEventRoutes);
app.use('/device', deviceRoutes);

app.get('/', (req, res) => {
  res.send('PiSync backend is running. Visit /api-docs for API documentation.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
