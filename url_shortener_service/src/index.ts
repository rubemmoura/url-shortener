import express from 'express';
import authRoutes from './routes/authRoutes';
import shortRoutes from './routes/shortRoutes'

require('dotenv').config();

const app = express();
app.use(express.json());
// app.use('/analytics', authRoutes);
app.use('/', shortRoutes);

const port = 3001;
app.listen(port, () => {
    console.log(`Service is running at http://localhost:${port}`);
});
