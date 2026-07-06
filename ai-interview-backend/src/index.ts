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

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
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

// Graceful Shutdown: Đảm bảo tiến trình đang chạy dở của Worker không bị cắt đứt đột ngột khi tắt Server
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  server.close(async () => {
    console.log('HTTP server closed.');
    await notificationWorker.close(); // Chờ Worker lưu lại Progress
    console.log('BullMQ Worker closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
