import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import connectDB from './config/mongoDB.js'
import authRouter from './routes/authRoutes.js'
import musicRouter from './routes/musicRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import validateEnvironment from './utils/validateEnv.js'
import requestLogger from './middleware/requestLogger.js'
import path from 'path'

dotenv.config()

// Validate environment variables before starting
validateEnvironment()

// Global error handlers for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error(' UNCAUGHT EXCEPTION! Shutting down...', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error(' UNHANDLED REJECTION! Shutting down...', error);
    process.exit(1);
});

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware (essential for any web app)
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow audio files to load
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], 
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      mediaSrc: ["'self'", "blob:"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}))

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Remove server info in production
  if (process.env.NODE_ENV === 'production') {
    res.removeHeader('X-Powered-By');
    res.setHeader('Server', '');
  }
  
  next();
});

// Rate limiting (prevent abuse) - relaxed for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // increased limit for development
  message: { success: false, message: 'Too many requests, please try again later.' }
})
app.use('/api/', limiter)

// Middleware
app.use(express.json({ limit: '1mb' })) // Reduced from 10mb
app.use(express.urlencoded({ extended: true, limit: '1mb' })) // Reduced from 10mb

// Security request logging
app.use(requestLogger)

app.use(cors({
  origin: function(origin, callback) {
    // In development, be more restrictive - don't allow no origin requests for security
    if (!origin && process.env.NODE_ENV === 'production') return callback(null, true);
    if (!origin && process.env.NODE_ENV !== 'production') return callback(new Error('Origin required in development'));
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:3000'];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range', 'Accept', 'Accept-Ranges'],
  exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length', 'Content-Type']
}))

// CORS middleware specifically for uploads
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Static file serving with proper headers and security
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads'), {
  maxAge: '1d', // Cache for 1 day
  dotfiles: 'deny', // Deny access to dotfiles
  index: false, // Don't serve directory indexes
  setHeaders: (res, filePath) => {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    
    // Audio file headers
    if (filePath.endsWith('.mp3') || filePath.endsWith('.wav') || filePath.endsWith('.ogg')) {
      res.setHeader('Content-Type', 'audio/mpeg')
      res.setHeader('Accept-Ranges', 'bytes')
    }
  }
}))

// API Routes
app.use('/api/auth', authRouter) 
app.use('/api/music', musicRouter)
app.use('/api/admin', adminRouter)

// Dedicated audio streaming endpoint with explicit CORS
app.get('/stream/:filename', async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(path.resolve(), 'uploads', filename);
  
  // Set CORS headers explicitly
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');
  
  // Set audio headers
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Accept-Ranges', 'bytes');
  
  // Stream the file
  const fs = await import('fs');
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    const range = req.headers.range;
    
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
      res.setHeader('Content-Length', chunksize);
      
      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      res.setHeader('Content-Length', stat.size);
      fs.createReadStream(filePath).pipe(res);
    }
  } else {
    res.status(404).send('File not found');
  }
});

// Health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Music Player API Server', 
        status: 'running',
        version: '1.0.0'
    })
})

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
    })
})

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('Error:', err.stack)
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    })
})

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    })
})

// Connect to database and start server
connectDB()
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
            console.log(`Static files served from: ${path.join(path.resolve(), 'uploads')}`)
            
            // Show CORS origins in development only
            if (process.env.NODE_ENV !== 'production') {
                const origins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000';
                console.log(`CORS enabled for: ${origins.split(',')[0]}${origins.includes(',') ? ' and others' : ''}`);
            }
        })
        
        // Set server timeout to 30 seconds for regular requests
        server.timeout = 30000;
        
        // Set keep-alive timeout
        server.keepAliveTimeout = 65000;
        server.headersTimeout = 66000;
        
        // Graceful shutdown handling
        const gracefulShutdown = (signal) => {
            console.log(`\n${signal} received. Shutting down gracefully...`)
            server.close(async () => {
                console.log('HTTP server closed.')
                await mongoose.connection.close()
                console.log('MongoDB connection closed.')
                process.exit(0)
            })
        }
        
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
        process.on('SIGINT', () => gracefulShutdown('SIGINT'))
    })
    .catch((error) => {
        console.error('Failed to connect to database:', error)
        process.exit(1)
    })