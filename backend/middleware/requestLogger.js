import logger from '../utils/logger.js';

// Sensitive fields that should never be logged
const SENSITIVE_FIELDS = ['password', 'token', 'authorization', 'jwt', 'secret', 'key'];

// Helper to sanitize request data
const sanitizeData = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = { ...obj };
  
  Object.keys(sanitized).forEach(key => {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  });
  
  return sanitized;
};

// Helper to sanitize headers
const sanitizeHeaders = (headers) => {
  const sanitized = { ...headers };
  
  Object.keys(sanitized).forEach(key => {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

const requestLogger = (req, res, next) => {
  // Skip logging for health checks and static files
  if (req.path === '/health' || req.path.startsWith('/uploads/')) {
    return next();
  }

  const startTime = Date.now();

  // Log incoming request (sanitized)
  const requestData = {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    headers: sanitizeHeaders(req.headers),
    body: sanitizeData(req.body),
    query: sanitizeData(req.query),
    timestamp: new Date().toISOString()
  };

  // Only log detailed info in development
  if (process.env.NODE_ENV === 'development') {
    logger.info('Incoming Request', requestData);
  }

  // Log response when finished
  const originalSend = res.send;
  res.send = function(body) {
    const responseTime = Date.now() - startTime;
    
    const responseData = {
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: body ? body.length : 0
    };

    // Log different levels based on status code
    if (res.statusCode >= 500) {
      logger.error('Server Error Response', { 
        request: requestData, 
        response: responseData 
      });
    } else if (res.statusCode >= 400) {
      logger.warn('Client Error Response', { 
        request: requestData, 
        response: responseData 
      });
    } else if (process.env.NODE_ENV === 'development') {
      logger.info('Successful Response', responseData);
    }

    return originalSend.call(this, body);
  };

  next();
};

export default requestLogger;
