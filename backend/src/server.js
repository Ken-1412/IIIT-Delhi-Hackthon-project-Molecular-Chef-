import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import authRoutes from './routes/auth.js';
// import recipeRoutes from './routes/recipes.js';
import flavordbRoutes from './routes/flavordb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);  // Disabled until Prisma is set up
// app.use('/api/recipes', recipeRoutes);  // Disabled until Prisma is set up
app.use('/api/flavordb', flavordbRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`🚀 MolecularChef Backend running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 FlavorDB API: ${process.env.FOODOSCOPE_FLAVORDB_BASE}`);
    console.log(`\n✅ FlavorDB proxy endpoints ready at /api/flavordb/*`);
    console.log(`⚠️  Auth & Recipe endpoints disabled (Prisma setup pending)`);
});
