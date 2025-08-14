// Enhanced graceful shutdown utility
import logger from './logger.js';
import mongoose from 'mongoose';

let server = null;

export const setServer = (httpServer) => {
  server = httpServer;
};

export const gracefulShutdown = async (signal, error = null) => {
  logger.error(`Received ${signal}. Starting graceful shutdown...`, { error: error?.message });
  
  let exitCode = 0;
  
  try {
    // Stop accepting new requests
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
      logger.info('HTTP server closed');
    }
    
    // Close database connections
    await mongoose.connection.close();
    logger.info('Database connections closed');
    
    // Clean up other resources (Redis, etc.)
    // Add cleanup for blacklist, file handles, etc.
    
  } catch (shutdownError) {
    logger.error('Error during shutdown', { error: shutdownError.message });
    exitCode = 1;
  }
  
  logger.info('Graceful shutdown completed');
  process.exit(exitCode);
};

// Enhanced error handlers
export const setupErrorHandlers = () => {
  process.on('uncaughtException', (error) => {
    gracefulShutdown('UNCAUGHT_EXCEPTION', error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at Promise', { reason, promise });
    gracefulShutdown('UNHANDLED_REJECTION', reason);
  });

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

export default {
  setServer,
  gracefulShutdown,
  setupErrorHandlers
};
