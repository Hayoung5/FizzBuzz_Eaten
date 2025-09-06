const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logFile = path.join(__dirname, '../../logs/app.log');
    this.ensureLogDir();
  }

  ensureLogDir() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data
    };
    return JSON.stringify(logEntry) + '\n';
  }

  writeLog(level, message, data = null) {
    const logEntry = this.formatMessage(level, message, data);
    
    // 콘솔에도 출력
    console.log(`[${level}] ${message}`, data || '');
    
    // 파일에 저장
    fs.appendFileSync(this.logFile, logEntry);
  }

  info(message, data = null) {
    this.writeLog('INFO', message, data);
  }

  error(message, data = null) {
    this.writeLog('ERROR', message, data);
  }

  debug(message, data = null) {
    this.writeLog('DEBUG', message, data);
  }

  warn(message, data = null) {
    this.writeLog('WARN', message, data);
  }

  getLogs(lines = 50) {
    try {
      if (!fs.existsSync(this.logFile)) {
        return [];
      }
      
      const content = fs.readFileSync(this.logFile, 'utf8');
      const logLines = content.trim().split('\n').filter(line => line);
      
      return logLines
        .slice(-lines)
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return { timestamp: new Date().toISOString(), level: 'RAW', message: line };
          }
        });
    } catch (error) {
      return [{ timestamp: new Date().toISOString(), level: 'ERROR', message: 'Failed to read logs', data: error.message }];
    }
  }
}

module.exports = new Logger();