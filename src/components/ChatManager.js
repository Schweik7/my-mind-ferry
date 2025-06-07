// src/components/ChatManager.js - 简化版聊天管理器
import { wsClient, WebSocketEvents } from '../services/WebSocketClient.js';

export class ChatManager {
  constructor() {
    this.currentTemplate = null;
    this.chatHistory = [];
    this.isTyping = false;
    this.chatContainer = null;
    this.inputElement = null;
    this.sendButton = null;
    this.currentStreamMessageEl = null;
    this.connectionRetries = 0;
    this.maxRetries = 3;
    
    this.setupEventListeners();
  }

  // 初始化聊天界面 - 简化版本
  initChatInterface(containerId, templateId) {
    console.log('=== 初始化聊天界面 ===');
    console.log('容器ID:', containerId, '模板ID:', templateId);
    
    // 如果已经是相同模板，不重复初始化
    if (this.currentTemplate === templateId && 
        this.chatContainer && 
        this.chatContainer.id === containerId) {
      console.log('聊天界面已存在，跳过初始化');
      return;
    }
    
    this.currentTemplate = templateId;
    this.chatContainer = document.getElementById(containerId);
    
    if (!this.chatContainer) {
      console.error('聊天容器不存在:', containerId);
      return;
    }

    // 创建聊天UI
    this.createChatUI();
    
    // 设置UI元素
    this.setupUIElements();
    
    // 连接WebSocket
    this.connectToTemplate(templateId);
  }

  // 创建聊天UI - 简化版本
  createChatUI() {
    if (!this.chatContainer) return;

    this.chatContainer.innerHTML = `
      <div class="chat-interface">
        <div class="chat-header">
          <div class="chat-status">
            <span class="status-indicator connecting">●</span>
            <span class="status-text">连接中...</span>
          </div>
          <button class="chat-clear-btn" onclick="window.chatManager.clearHistory()">清空</button>
        </div>
        
        <div class="chat-messages" id="chat-messages-${this.chatContainer.id}">
          <div class="welcome-message">
            <div class="message-avatar">🌟</div>
            <div class="message-content">
              <p>欢迎来到心灵絮语！我是您的AI伙伴。</p>
            </div>
          </div>
        </div>
        
        <div class="chat-input-container">
          <div class="input-wrapper">
            <textarea 
              id="chat-input-${this.chatContainer.id}" 
              placeholder="在这里输入您的想法..." 
              rows="1"
              maxlength="2000"
            ></textarea>
            <button id="chat-send-btn-${this.chatContainer.id}" class="send-button">
              <span class="send-icon">🚀</span>
            </button>
          </div>
          <div class="input-info">
            <span class="char-count">0/2000</span>
            <span class="typing-indicator" id="typing-indicator-${this.chatContainer.id}" style="display: none;">AI正在思考...</span>
          </div>
        </div>
      </div>
    `;
  }

  // 设置UI元素引用
  setupUIElements() {
    const containerId = this.chatContainer.id;
    this.inputElement = document.getElementById(`chat-input-${containerId}`);
    this.sendButton = document.getElementById(`chat-send-btn-${containerId}`);
    this.statusIndicator = this.chatContainer.querySelector('.status-indicator');
    this.statusText = this.chatContainer.querySelector('.status-text');
    this.messagesContainer = document.getElementById(`chat-messages-${containerId}`);
    this.typingIndicator = document.getElementById(`typing-indicator-${containerId}`);
    this.charCount = this.chatContainer.querySelector('.char-count');

    // 绑定事件
    if (this.inputElement) {
      this.inputElement.addEventListener('input', (e) => this.handleInputChange(e));
      this.inputElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    if (this.sendButton) {
      this.sendButton.addEventListener('click', () => this.sendMessage());
    }
  }

  // 连接到模板
  async connectToTemplate(templateId) {
    try {
      console.log(`连接到模板 ${templateId}...`);
      this.updateStatus('connecting', '连接中...');
      
      // 强制断开现有连接
      wsClient.disconnect();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // 建立新连接
      await wsClient.connect(templateId);
      
    } catch (error) {
      console.error('连接失败:', error);
      this.updateStatus('error', '连接失败');
    }
  }

  // 设置WebSocket事件监听
  setupEventListeners() {
    // 清除旧的监听器
    wsClient.eventListeners.clear();
    
    wsClient.on(WebSocketEvents.CONNECTED, () => {
      this.updateStatus('connecting', '建立会话中...');
    });

    wsClient.on(WebSocketEvents.SESSION_CREATED, (data) => {
      console.log('会话已创建:', data);
      this.updateStatus('connected', '已连接');
      
      // 显示AI的首条消息
      if (data.template?.ai_first_message) {
        setTimeout(() => {
          this.addMessage('assistant', data.template.ai_first_message);
        }, 500);
      }
    });

    wsClient.on(WebSocketEvents.MESSAGE_RECEIVED, (data) => {
      if (!this.currentStreamMessageEl) {
        this.addMessage('assistant', data.content);
      }
    });

    // 流式响应处理
    wsClient.on(WebSocketEvents.STREAM_START, () => {
      this.currentStreamMessageEl = this.createStreamMessage();
      this.hideTypingIndicator();
    });

    wsClient.on(WebSocketEvents.STREAM_CHUNK, (data) => {
      if (this.currentStreamMessageEl) {
        this.updateStreamMessage(this.currentStreamMessageEl, data.accumulated);
      }
    });

    wsClient.on(WebSocketEvents.STREAM_END, (data) => {
      this.hideTypingIndicator();
      
      if (this.currentStreamMessageEl) {
        this.finalizeStreamMessage(this.currentStreamMessageEl, data.content);
        this.currentStreamMessageEl = null;
        
        this.chatHistory.push({
          role: 'assistant',
          content: data.content,
          timestamp: data.timestamp || new Date().toISOString()
        });
      }
    });

    wsClient.on(WebSocketEvents.TYPING_START, () => {
      this.showTypingIndicator();
    });

    wsClient.on(WebSocketEvents.TYPING_STOP, () => {
      this.hideTypingIndicator();
    });

    wsClient.on(WebSocketEvents.ERROR, (data) => {
      console.error('WebSocket错误:', data);
      this.updateStatus('error', `错误: ${data.message}`);
      this.showErrorMessage(data.message);
      this.hideTypingIndicator();
    });

    wsClient.on(WebSocketEvents.DISCONNECTED, () => {
      this.updateStatus('disconnected', '连接已断开');
      this.hideTypingIndicator();
    });
  }

  // 处理输入变化
  handleInputChange(event) {
    const text = event.target.value;
    const length = text.length;
    
    if (this.charCount) {
      this.charCount.textContent = `${length}/2000`;
    }
    
    // 自动调整文本框高度
    event.target.style.height = 'auto';
    event.target.style.height = Math.min(event.target.scrollHeight, 120) + 'px';
  }

  // 处理键盘事件
  handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  // 发送消息
  sendMessage() {
    if (!this.inputElement) return;
    
    const content = this.inputElement.value.trim();
    if (!content || content.length > 2000) return;
    
    if (!wsClient.isConnected) {
      this.showErrorMessage('连接已断开，正在重新连接...');
      this.connectToTemplate(this.currentTemplate);
      return;
    }
    
    // 添加用户消息到界面
    this.addMessage('user', content);
    
    // 清空输入框
    this.clearInput();
    
    // 发送到WebSocket
    try {
      wsClient.sendMessage(content);
      
      this.chatHistory.push({
        role: 'user',
        content: content,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('发送消息失败:', error);
      this.showErrorMessage('发送消息失败，请重试');
    }
  }

  // 添加消息到聊天界面
  addMessage(role, content, timestamp = null) {
    if (!this.messagesContainer) return;

    const messageEl = document.createElement('div');
    messageEl.className = `message ${role}-message`;
    
    const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
    
    const avatars = {
      'user': '👤',
      'assistant': '🤖',
      'system': '⚠️'
    };
    
    messageEl.innerHTML = `
      <div class="message-avatar">${avatars[role] || '🤖'}</div>
      <div class="message-content">
        <div class="message-text">${this.formatMessage(content)}</div>
        <div class="message-time">${timeStr}</div>
      </div>
    `;

    this.messagesContainer.appendChild(messageEl);
    this.scrollToBottom();
    
    // 添加动画效果
    messageEl.style.opacity = '0';
    messageEl.style.transform = 'translateY(10px)';
    
    requestAnimationFrame(() => {
      messageEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      messageEl.style.opacity = '1';
      messageEl.style.transform = 'translateY(0)';
    });
    
    if (role === 'assistant') {
      this.chatHistory.push({
        role,
        content,
        timestamp: timestamp || new Date().toISOString()
      });
    }
  }

  // 格式化消息内容
  formatMessage(content) {
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }

  // 创建流式消息元素
  createStreamMessage() {
    if (!this.messagesContainer) return null;

    const messageEl = document.createElement('div');
    messageEl.className = 'message assistant-message streaming';
    
    messageEl.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="message-text streaming-text"></div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
      </div>
    `;

    this.messagesContainer.appendChild(messageEl);
    this.scrollToBottom();
    
    return messageEl;
  }

  // 更新流式消息内容
  updateStreamMessage(messageEl, content) {
    const textEl = messageEl.querySelector('.message-text');
    if (textEl) {
      textEl.innerHTML = this.formatMessage(content) + '<span class="stream-cursor">|</span>';
      this.scrollToBottom();
    }
  }

  // 完成流式消息
  finalizeStreamMessage(messageEl, finalContent) {
    const textEl = messageEl.querySelector('.message-text');
    if (textEl) {
      textEl.innerHTML = this.formatMessage(finalContent);
      textEl.classList.remove('streaming-text');
      messageEl.classList.remove('streaming');
    }
    
    const timeEl = messageEl.querySelector('.message-time');
    if (timeEl) {
      timeEl.textContent = new Date().toLocaleTimeString();
    }
  }

  // 显示错误消息
  showErrorMessage(message) {
    this.addMessage('system', `❌ ${message}`);
  }

  // 显示/隐藏输入指示器
  showTypingIndicator() {
    this.isTyping = true;
    if (this.typingIndicator) {
      this.typingIndicator.style.display = 'block';
    }
  }

  hideTypingIndicator() {
    this.isTyping = false;
    if (this.typingIndicator) {
      this.typingIndicator.style.display = 'none';
    }
  }

  // 更新连接状态
  updateStatus(status, text) {
    if (this.statusIndicator && this.statusText) {
      const statusColors = {
        connecting: '#FFA500',
        connected: '#4CAF50',
        disconnected: '#757575',
        error: '#F44336'
      };

      this.statusIndicator.style.color = statusColors[status] || '#4CAF50';
      this.statusIndicator.className = `status-indicator ${status}`;
      this.statusText.textContent = text;
    }
  }

  // 清空输入框
  clearInput() {
    if (this.inputElement) {
      this.inputElement.value = '';
      this.inputElement.style.height = 'auto';
      if (this.charCount) {
        this.charCount.textContent = '0/2000';
      }
    }
  }

  // 滚动到底部
  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  // 清空聊天历史
  clearHistory() {
    if (this.messagesContainer) {
      this.messagesContainer.innerHTML = `
        <div class="welcome-message">
          <div class="message-avatar">🌟</div>
          <div class="message-content">
            <p>对话已清空，我们重新开始吧！</p>
          </div>
        </div>
      `;
    }
    this.chatHistory = [];
  }

  // 获取聊天历史
  getHistory() {
    return [...this.chatHistory];
  }

  // 断开连接
  disconnect() {
    console.log('断开聊天连接');
    wsClient.disconnect();
    this.currentTemplate = null;
    this.connectionRetries = 0;
  }

  // 清理资源
  cleanup() {
    this.disconnect();
    if (this.chatContainer) {
      this.chatContainer.innerHTML = '';
    }
  }
}

// 全局聊天管理器实例
export const chatManager = new ChatManager();

// 将chatManager暴露到全局作用域
window.chatManager = chatManager;