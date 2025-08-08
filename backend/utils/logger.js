import fs from 'fs'
import path from 'path'

// Simple logging utility for development
class Logger {
  constructor() {
    this.logsDir = path.join(process.cwd(), 'logs')
    this.ensureLogsDirectory()
  }

  ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true })
    }
  }

  log(level, message, meta = {}) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    }

    // Console output
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, meta)

    // File output (optional for small projects)
    if (process.env.NODE_ENV === 'production') {
      const logFile = path.join(this.logsDir, `${new Date().toISOString().split('T')[0]}.log`)
      fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n')
    }
  }

  info(message, meta) {
    this.log('info', message, meta)
  }

  error(message, meta) {
    this.log('error', message, meta)
  }

  warn(message, meta) {
    this.log('warn', message, meta)
  }
}

export default new Logger()
