import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import fs from 'fs';
import beauty from './routes/Beauty.route.js';
import book from './routes/bookshop.route.js';
import cloth from './routes/cloth.route.js';
import product from './routes/product.rotue.js';
import promotionRoute from './routes/Promotion.route.js';
import authRoute from './routes/Auth.route.js';
import shopRoute from './routes/Shop.route.js';
import itemRoute from './routes/Item.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

console.log('Server starting...');

const app = express();

// CORS configuration
app.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://shopping-mall-dun.vercel.app',
        process.env.FRONTEND_URL
    ].filter(Boolean);
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Increase payload size limit for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server (Vercel will handle this automatically in production)
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

// Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        message: 'Server is running successfully',
        debug: {
            hasMongoUri: !!process.env.MONGO,
            hasJwtSecret: !!process.env.JWT_SECRET,
            nodeEnv: process.env.NODE_ENV,
            mongoConnected: mongoose.connection.readyState === 1
        }
    });
});

// Serve uploaded images via API endpoint
app.get('/uploads/shop-logos/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, 'uploads', 'shop-logos', filename);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Image not found' });
        }
        
        // Set cache headers
        res.set({
            'Cache-Control': 'public, max-age=31536000', // 1 year
            'Content-Type': 'image/jpeg' // Default, could be improved with proper detection
        });
        
        // Send file
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error serving image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.use('/api/beauty', beauty);
app.use('/api/book', book);
app.use('/api/cloth', cloth);
app.use('/api/product', product);
app.use('/api/promotion', promotionRoute);
app.use('/api/auth', authRoute);
app.use('/api/shops', shopRoute);
app.use('/api/item', itemRoute);

// Error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
});

// Connect to MongoDB after server starts
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.log('MongoDB connection error:', err.message);
    console.log('Please check:');
    console.log('1. Internet connection');
    console.log('2. MongoDB Atlas cluster status');
    console.log('3. Database credentials');
    console.log('4. IP whitelist in MongoDB Atlas');
    console.log('Server will continue running without database connection...');
});

// Export for Vercel
export default app;