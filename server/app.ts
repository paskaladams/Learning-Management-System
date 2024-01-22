require('dotenv').config();
// Mengimport modul Express JS
import express, { Request, Response, NextFunction } from 'express';
// Membuat app instance dari Express JS
export const app = express();
// Mengimport modul cors
import cors from 'cors';
// Mengimport modul cookie parser
import cookieParser from 'cookie-parser';
// Mengimport Error Handler
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.route';
import courseRouter from './routes/course.route';
import orderRouter from './routes/order.route';
import notificationRouter from './routes/notification.route';
import analyticsRouter from './routes/analytics.route';
import layoutRouter from './routes/layout.route';

// Body parser
app.use(express.json());
// app.use(express.json({ limit: '50mb' }));

// Cookie parser
app.use(cookieParser());

// Cors
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

// Routes
app.use('/api/v1', userRouter, courseRouter, orderRouter, notificationRouter, analyticsRouter, layoutRouter);

// Testing API
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: true,
		message: 'API is working',
	});
});

// Unknown route
app.all('*', (req: Request, res: Response, next: NextFunction) => {
	const err = new Error(`Route ${req.originalUrl} not found`) as any;
	err.statusCode = 404;
	next(err);
});

app.use(ErrorMiddleware);
