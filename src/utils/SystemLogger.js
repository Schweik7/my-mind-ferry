// src/utils/SystemLogger.js - 系统日志器
export class SystemLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // 最大日志数量
    this.logLevel = 'info'; // 日志级别
  }

  // 记录信息日志
  info(message, ...args) {
    this.log('info', message, ...args);
    console.log(`ℹ️ ${message}`, ...args);
  }

  // 记录成功日志
  success(message, ...args) {
    this.log('success', message, ...args);
    console.log(`✅ ${message}`, ...args);
  }

  // 记录警告日志
  warn(message, ...args) {
    this.log('warn', message, ...args);
    console.warn(`⚠️ ${message}`, ...args);
  }

  // 记录错误日志
  error(message, ...args) {
    this.log('error', message, ...args);
    console.error(`❌ ${message}`, ...args);
  }

  // 记录调试日志
  debug(message, ...args) {
    if (this.logLevel === 'debug') {
      this.log('debug', message, ...args);
      console.debug(`🐛 ${message}`, ...args);
    }
  }

  // 基础日志记录方法
  log(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      args: args.length > 0 ? args : undefined,
      stack: level === 'error' ? new Error().stack : undefined
    };

    this.logs.push(logEntry);

    // 保持日志数量在限制内
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  // 获取所有日志
  getLogs() {
    return [...this.logs];
  }

  // 按级别获取日志
  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level);
  }

  // 按时间范围获取日志
  getLogsByTimeRange(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime >= start && logTime <= end;
    });
  }

  // 清空日志
  clear() {
    this.logs = [];
    this.info('日志已清空');
  }

  // 导出日志
  export() {
    const exportData = {
      exportTime: new Date().toISOString(),
      totalLogs: this.logs.length,
      logs: this.logs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.success('日志导出成功');
  }

  // 设置日志级别
  setLogLevel(level) {
    this.logLevel = level;
    this.info(`日志级别设置为: ${level}`);
  }

  // 获取日志统计
  getStats() {
    const stats = {
      total: this.logs.length,
      info: 0,
      success: 0,
      warn: 0,
      error: 0,
      debug: 0
    };

    this.logs.forEach(log => {
      if (stats.hasOwnProperty(log.level)) {
        stats[log.level]++;
      }
    });

    return stats;
  }
}