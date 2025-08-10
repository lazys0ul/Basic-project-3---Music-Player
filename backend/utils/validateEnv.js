import dotenv from 'dotenv'
import logger from '../utils/logger.js'

dotenv.config()

// Validate required environment variables
const requiredEnvVars = [
  'MONGO_URL',
  'DB_NAME', 
  'JWT_SECRET',
  'PORT'
]

// Optional environment variables with defaults
const optionalEnvVars = {
  NODE_ENV: 'development',
  BCRYPT_ROUNDS: '12',
  RATE_LIMIT_WINDOW: '15',
  RATE_LIMIT_MAX_REQUESTS: '1000',
  MAX_FILE_SIZE: '10485760',
  UPLOAD_DIRECTORY: 'uploads',
  ALLOWED_ORIGINS: 'http://localhost:3000'
}

const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])
  
  if (missing.length > 0) {
    logger.error('Missing required environment variables', { missing })
    console.error('❌ Missing required environment variables:', missing.join(', '))
    console.error('📄 Please check your .env file and ensure all required variables are set.')
    process.exit(1)
  }

  // Set default values for optional variables
  Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue
      logger.info(`Set default value for ${key}`, { value: defaultValue })
    }
  })

  // Validate JWT secret strength
  if (process.env.JWT_SECRET.length < 32) {
    logger.error('JWT_SECRET is too short for production use')
    console.error('❌ JWT_SECRET must be at least 32 characters long for production use.')
    process.exit(1)
  }

  // Check for weak or default secrets
  const weakSecrets = [
    'super_secure_jwt_secret_key_for_production_use_minimum_64_characters_random_string_2024',
    'your_super_secure_jwt_secret_key_here',
    'REPLACE_WITH_SECURE_RANDOM_64_CHARACTER_STRING_IN_PRODUCTION'
  ]
  
  if (weakSecrets.includes(process.env.JWT_SECRET)) {
    logger.error('Detected weak or default JWT secret')
    console.error('❌ Default JWT secret detected. Please generate a secure random secret.')
    console.error('💡 Run: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"')
    process.exit(1)
  }

  // Validate numeric environment variables
  const numericVars = ['PORT', 'BCRYPT_ROUNDS', 'RATE_LIMIT_WINDOW', 'RATE_LIMIT_MAX_REQUESTS', 'MAX_FILE_SIZE']
  numericVars.forEach(envVar => {
    if (process.env[envVar] && isNaN(Number(process.env[envVar]))) {
      logger.error(`Invalid numeric value for ${envVar}`, { value: process.env[envVar] })
      process.exit(1)
    }
  })

  logger.info('Environment validation passed', { 
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    jwtSecretLength: process.env.JWT_SECRET.length
  })
}

export default validateEnvironment
