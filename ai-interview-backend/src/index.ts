import express from 'express';
import { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import setupRoutes from './routes';

dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:5173', // Chỉ định frontend URL
    credentials: true, // Cho phép gửi credentials (cookies, headers)
  }),
);
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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
