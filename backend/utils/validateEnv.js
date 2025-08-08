import dotenv from 'dotenv'
import logger from '../utils/logger.js'

dotenv.config()

// Validate required environment variables
const requiredEnvVars = [
  'MONGO_URL',
  'JWT_SECRET'
]

const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])
  
  if (missing.length > 0) {
    logger.error('Missing required environment variables', { missing })
    console.error('❌ Missing required environment variables:', missing.join(', '))
    console.error('📄 Please check your .env file and ensure all required variables are set.')
    process.exit(1)
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET.length < 32) {
    logger.warn('JWT_SECRET is too short. Consider using a longer secret for better security.')
  }

  logger.info('Environment validation passed')
}

export default validateEnvironment
