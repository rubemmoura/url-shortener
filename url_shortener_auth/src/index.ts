import express from 'express';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
