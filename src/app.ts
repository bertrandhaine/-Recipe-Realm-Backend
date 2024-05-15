// src/app.ts
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import apiRouter from './routes';

const app = new Hono();

app.use(
  '/api/*',
  cors({
    origin: '*', // Allow all domains to access this API
  })
);

app.route('/api', apiRouter);

// Start the server
serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Default port is 3000
});
