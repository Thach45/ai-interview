import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import setupRoutes from './routes';

import { apiLimiter } from './middlewares/rate-limit.middleware';

const app: Express = express();
const port: number = parseInt(process.env.PORT || '3000', 10);
const corsDomain = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: corsDomain,
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(apiLimiter);
app.use(express.static('public'));
app.use(cookieParser());

setupRoutes(app);

// Global Error Handler
import { globalErrorHandler } from './middlewares/error.middleware';
import { NotFoundException } from './exceptions';

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new NotFoundException(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// --- BULLMQ WORKERS ---
import { notificationWorker } from './workers/notification.worker';
import { emailWorker } from './workers/email.worker';
import { analysisCvWorker } from './workers/analysis-cv.worker';
import { optimizeCvWorker } from './workers/optimize-cv.worker';
import { interviewTimerWorker } from './workers/interview-timer.worker';
import { interviewAnalysisWorker } from './workers/interview-analysis.worker';
// Graceful Shutdown: Đảm bảo tiến trình đang chạy dở của Worker không bị cắt đứt đột ngột khi tắt Server
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  server.close(async () => {
    console.log('HTTP server closed.');
    await Promise.all([
      notificationWorker.close(),
      emailWorker.close(),
      analysisCvWorker.close(),
      optimizeCvWorker.close(),
      interviewTimerWorker.close(),
      interviewAnalysisWorker.close(),
    ]);
    console.log('BullMQ Workers closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
