// src/services/WebSocketClient.js - 简化版本
/**
 * WebSocket客户端管理器 - 移除复杂的连接状态检测，假设后台一直运行
 */
export class WebSocketClient {
  constructor() {
    this.ws = null;
    this.sessionId = null;
    this.templateId = null;
    this.eventListeners = new Map();
    this.currentStreamContent = ''; // 用于累积流式内容
  }

  // 连接WebSocket
  async connect(templateId) {
    console.log('=== WebSocket连接请求 ===');
    console.log('模板ID:', templateId);
    
    // 如果已连接到不同模板，先断开
    if (this.ws && this.templateId !== templateId) {
      console.log('断开现有连接...');
      this.disconnect();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 如果已经连接到相同模板，直接返回
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.templateId === templateId) {
      console.log('WebSocket已连接到相同模板，跳过重连');
      return;
    }

    this.templateId = templateId;
    const wsUrl = `ws://localhost:8000/api/v1/xinling/chat/ws/${templateId}`;

    try {
      console.log('连接WebSocket:', wsUrl);
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => this.handleOpen();
      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onclose = (event) => this.handleClose(event);
      this.ws.onerror = (error) => this.handleError(error);

    } catch (error) {
      console.error('WebSocket连接失败:', error);
      this.emit('error', { message: 'WebSocket连接失败' });
    }
  }

  // 处理连接打开
  handleOpen() {
    console.log('WebSocket连接已建立');
    this.emit('connected', { templateId: this.templateId });
  }

  // 处理收到的消息
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      console.log('收到WebSocket消息:', data);

      switch (data.type) {
        case 'connected':
          this.sessionId = data.session_id;
          this.emit('session_created', data);
          break;
        
        case 'message':
          this.emit('message_received', {
            role: data.role,
            content: data.content,
            timestamp: data.timestamp
          });
          break;
        
        // 流式响应处理
        case 'stream_start':
          this.currentStreamContent = '';
          this.emit('stream_start', data);
          break;
        
        case 'stream_chunk':
          this.currentStreamContent += data.content || '';
          this.emit('stream_chunk', {
            content: data.content,
            accumulated: this.currentStreamContent
          });
          break;
        
        case 'stream_end':
          this.emit('stream_end', {
            content: this.currentStreamContent,
            timestamp: data.timestamp
          });
          // 流式结束后发送完整消息事件
          this.emit('message_received', {
            role: 'assistant',
            content: this.currentStreamContent,
            timestamp: data.timestamp || new Date().toISOString()
          });
          this.currentStreamContent = '';
          break;
        
        case 'typing':
          this.emit('typing_start');
          break;
        
        case 'stop_typing':
          this.emit('typing_stop');
          break;
        
        case 'error':
          this.emit('error', data);
          break;
        
        case 'pong':
          this.emit('pong', data);
          break;
        
        default:
          console.warn('未知消息类型:', data.type);
      }
    } catch (error) {
      console.error('解析WebSocket消息失败:', error);
    }
  }

  // 处理连接关闭
  handleClose(event) {
    console.log('WebSocket连接已关闭:', event.code, event.reason);
    this.emit('disconnected', { 
      code: event.code, 
      reason: event.reason 
    });
  }

  // 处理连接错误
  handleError(error) {
    console.error('WebSocket错误:', error);
    this.emit('error', { message: 'WebSocket连接错误' });
  }

  // 发送消息
  sendMessage(content) {
    const message = {
      type: 'user_message',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      console.log('WebSocket发送消息:', message);
    } else {
      console.warn('WebSocket未连接或连接状态异常，无法发送消息');
      this.emit('error', { message: 'WebSocket连接异常，请稍后重试' });
    }
  }

  // 发送ping
  sendPing() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping' }));
    }
  }

  // 断开连接
  disconnect() {
    console.log('=== 断开WebSocket连接 ===');
    
    if (this.ws) {
      this.ws.close(1000, '用户主动断开');
      this.ws = null;
      console.log('WebSocket连接已关闭');
    }
    
    this.sessionId = null;
    this.templateId = null;
    this.currentStreamContent = '';
    
    console.log('WebSocket状态已重置');
  }

  // 事件监听
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  // 移除事件监听
  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // 触发事件
  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`事件监听器错误 (${event}):`, error);
        }
      });
    }
  }

  // 获取连接状态
  getStatus() {
    return {
      isConnected: this.ws && this.ws.readyState === WebSocket.OPEN,
      sessionId: this.sessionId,
      templateId: this.templateId,
      readyState: this.ws ? this.ws.readyState : null
    };
  }

  // 简化的连接状态检查
  get isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// 单例实例
export const wsClient = new WebSocketClient();

// 导出类型定义
export const WebSocketEvents = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  SESSION_CREATED: 'session_created',
  MESSAGE_SENT: 'message_sent',
  MESSAGE_RECEIVED: 'message_received',
  STREAM_START: 'stream_start',
  STREAM_CHUNK: 'stream_chunk',
  STREAM_END: 'stream_end',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  ERROR: 'error',
  PONG: 'pong'
};