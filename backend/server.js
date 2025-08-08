import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import connectDB from './config/mongoDB.js'
import authRouter from './routes/authRoutes.js'
import musicRouter from './routes/musicRoutes.js'
import validateEnvironment from './utils/validateEnv.js'
import path from 'path'

dotenv.config()

// Validate environment variables before starting
validateEnvironment()

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

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
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
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`)
            console.log(`📁 Static files served from: ${path.join(path.resolve(), 'uploads')}`)
            console.log(`🌐 CORS enabled for: http://localhost:3000`)
        })
    })
    .catch((error) => {
        console.error('Failed to connect to database:', error)
        process.exit(1)
    })