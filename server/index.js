import express from 'express';
import userRoutes from './routes/user.route.js';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/auth', userRoutes)

export default app;