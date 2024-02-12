import express from 'express';
import authRoutes from './routes/authRoutes';
import swaggerRouter from './routes/swaggerRoutes';

require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api', swaggerRouter);
app.use('/auth', authRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Authenticator is running at http://localhost:${port}`);
    console.log(`API Docs is provided at http://localhost:${port}/api/swagger`);
});
