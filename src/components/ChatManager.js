// src/components/ChatManager.js
import { wsClient, WebSocketEvents } from '../services/WebSocketClient.js';

export class ChatManager {
  constructor() {
    this.currentTemplate = null;
    this.chatHistory = [];
    this.isTyping = false;
    this.chatContainer = null;
    this.inputElement = null;
    this.sendButton = null;
    this.statusIndicator = null;
    this.currentStreamMessageEl = null; // 当前流式消息元素
    
    this.setupEventListeners();
  }

  // 初始化聊天界面
  initChatInterface(containerId, templateId) {
    console.log('=== 初始化聊天界面 ===');
    console.log('容器ID:', containerId);
    console.log('模板ID:', templateId);
    
    this.currentTemplate = templateId;
    this.chatContainer = document.getElementById(containerId);
    
    if (!this.chatContainer) {
      console.error('聊天容器不存在:', containerId);
      return;
    }

    console.log('找到聊天容器:', this.chatContainer);

    // 先清空容器
    this.chatContainer.innerHTML = '';
    
    this.createChatUI();
    
    // 确保UI创建完成后再初始化元素引用和连接
    setTimeout(() => {
      this.setupUIElements();
      this.connectToTemplate(templateId);
    }, 100);
  }

  // 创建聊天UI
  createChatUI() {
    console.log('创建聊天UI...');
    
    if (!this.chatContainer) {
      console.error('聊天容器不存在，无法创建UI');
      return;
    }

    this.chatContainer.innerHTML = `
      <div class="chat-interface">
        <div class="chat-header">
          <div class="chat-status">
            <span class="status-indicator" id="chat-status-indicator">●</span>
            <span class="status-text" id="chat-status-text">连接中...</span>
          </div>
          <button class="chat-clear-btn" onclick="chatManager.clearHistory()">清空对话</button>
        </div>
        
        <div class="chat-messages" id="chat-messages">
          <div class="welcome-message">
            <div class="message-avatar">🌟</div>
            <div class="message-content">
              <p>欢迎来到心灵絮语！我是您的AI伙伴，很高兴与您交流。</p>
            </div>
          </div>
        </div>
        
        <div class="chat-input-container">
          <div class="input-wrapper">
            <textarea 
              id="chat-input" 
              placeholder="在这里输入您的想法..." 
              rows="1"
              maxlength="2000"
            ></textarea>
            <button id="chat-send-btn" class="send-button">
              <span class="send-icon">🚀</span>
            </button>
          </div>
          <div class="input-info">
            <span class="char-count">0/2000</span>
            <span class="typing-indicator" id="typing-indicator" style="display: none;">AI正在思考...</span>
          </div>
        </div>
      </div>
    `;

    console.log('聊天UI已创建');
  }

  // 设置UI元素引用
  setupUIElements() {
    console.log('设置UI元素引用...');
    
    this.inputElement = document.getElementById('chat-input');
    this.sendButton = document.getElementById('chat-send-btn');
    this.statusIndicator = document.getElementById('chat-status-indicator');
    this.statusText = document.getElementById('chat-status-text');
    this.messagesContainer = document.getElementById('chat-messages');
    this.typingIndicator = document.getElementById('typing-indicator');
    this.charCount = document.querySelector('.char-count');

    console.log('UI元素状态:', {
      inputElement: !!this.inputElement,
      sendButton: !!this.sendButton,
      statusIndicator: !!this.statusIndicator,
      statusText: !!this.statusText,
      messagesContainer: !!this.messagesContainer,
      typingIndicator: !!this.typingIndicator,
      charCount: !!this.charCount
    });

    // 绑定输入事件
    if (this.inputElement) {
      this.inputElement.addEventListener('input', (e) => this.handleInputChange(e));
      this.inputElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
      console.log('输入事件已绑定');
    } else {
      console.error('输入元素不存在');
    }

    // 绑定发送按钮
    if (this.sendButton) {
      this.sendButton.addEventListener('click', () => this.sendMessage());
      console.log('发送按钮事件已绑定');
    } else {
      console.error('发送按钮不存在');
    }
  }

  // 连接到模板
  async connectToTemplate(templateId) {
    try {
      console.log(`正在连接到模板 ${templateId}...`);
      this.updateStatus('connecting', '连接中...');
      
      // 断开现有连接
      if (wsClient.isConnected) {
        wsClient.disconnect();
        // 等待断开完成
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      await wsClient.connect(templateId);
    } catch (error) {
      console.error('连接失败:', error);
      this.updateStatus('error', '连接失败');
    }
  }

  // 设置WebSocket事件监听
  setupEventListeners() {
    wsClient.on(WebSocketEvents.CONNECTED, () => {
      console.log('WebSocket连接已建立');
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

    wsClient.on(WebSocketEvents.MESSAGE_SENT, (data) => {
      console.log('消息已发送:', data);
      // 不在这里添加用户消息，因为在sendMessage方法中已经添加了
    });

    wsClient.on(WebSocketEvents.MESSAGE_RECEIVED, (data) => {
      console.log('收到AI消息:', data);
      this.addMessage('assistant', data.content);
    });

    // 流式响应事件处理
    wsClient.on(WebSocketEvents.STREAM_START, () => {
      console.log('开始接收流式响应');
      this.currentStreamMessageEl = this.createStreamMessage();
      this.hideTypingIndicator();
    });

    wsClient.on(WebSocketEvents.STREAM_CHUNK, (data) => {
      console.log('收到流式数据块:', data.content);
      if (this.currentStreamMessageEl) {
        this.updateStreamMessage(this.currentStreamMessageEl, data.accumulated);
      }
    });

    wsClient.on(WebSocketEvents.STREAM_END, (data) => {
      console.log('流式响应结束:', data.content);
      this.hideTypingIndicator();
      
      if (this.currentStreamMessageEl) {
        this.finalizeStreamMessage(this.currentStreamMessageEl, data.content);
        this.currentStreamMessageEl = null;
        
        // 流式消息完成后添加到历史记录
        this.chatHistory.push({
          role: 'assistant',
          content: data.content,
          timestamp: data.timestamp || new Date().toISOString()
        });
      }
    });

    wsClient.on(WebSocketEvents.TYPING_START, () => {
      console.log('AI开始输入');
      this.showTypingIndicator();
    });

    wsClient.on(WebSocketEvents.TYPING_STOP, () => {
      console.log('AI停止输入');
      this.hideTypingIndicator();
    });

    wsClient.on(WebSocketEvents.ERROR, (data) => {
      console.error('WebSocket错误:', data);
      this.updateStatus('error', `错误: ${data.message}`);
      this.showErrorMessage(data.message);
      this.hideTypingIndicator();
    });

    wsClient.on(WebSocketEvents.DISCONNECTED, () => {
      console.log('WebSocket连接已断开');
      this.updateStatus('disconnected', '连接已断开');
      this.hideTypingIndicator();
    });
  }

  // 处理输入变化
  handleInputChange(event) {
    const text = event.target.value;
    const length = text.length;
    
    // 更新字符计数
    if (this.charCount) {
      this.charCount.textContent = `${length}/2000`;
    }
    
    // 更新发送按钮状态 - 只有在连接状态下才启用
    if (this.sendButton) {
      const isConnected = wsClient.isConnected;
    //   this.sendButton.disabled = !isConnected || length === 0 || length > 2000;
    }
    
    // 自动调整文本框高度
    this.autoResizeTextarea(event.target);
  }

  // 处理键盘事件
  handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  // 自动调整文本框高度
  autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  // 发送消息
  sendMessage() {
    if (!this.inputElement) return;
    
    const content = this.inputElement.value.trim();
    if (!content || content.length > 2000) return;
    
    // 检查连接状态
    if (!wsClient.isConnected) {
      this.showErrorMessage('WebSocket未连接，请等待连接建立');
      return;
    }
    
    console.log('准备发送消息:', content);
    
    // 立即添加用户消息到界面
    this.addMessage('user', content);
    
    // 清空输入框
    this.clearInput();
    
    // 发送到WebSocket
    wsClient.sendMessage(content);
    
    // 添加到历史记录
    this.chatHistory.push({
      role: 'user',
      content: content,
      timestamp: new Date().toISOString()
    });
  }

  // 格式化消息内容
  formatMessage(content) {
    // 简单的文本格式化
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }

  // 添加消息到聊天界面
  addMessage(role, content, timestamp = null) {
    if (!this.messagesContainer) {
      console.error('消息容器不存在');
      return;
    }

    console.log('添加消息:', role, content.substring(0, 50) + '...');

    const messageEl = document.createElement('div');
    messageEl.className = `message ${role}-message`;
    
    const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
    
    // 根据角色选择头像
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
    
    // 使用 requestAnimationFrame 确保DOM更新后执行动画
    requestAnimationFrame(() => {
      messageEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      messageEl.style.opacity = '1';
      messageEl.style.transform = 'translateY(0)';
    });
    
    // 只为assistant消息添加到历史记录，user消息在sendMessage中已经添加
    if (role === 'assistant') {
      this.chatHistory.push({
        role,
        content,
        timestamp: timestamp || new Date().toISOString()
      });
    }
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
    
    // 更新时间戳
    const timeEl = messageEl.querySelector('.message-time');
    if (timeEl) {
      timeEl.textContent = new Date().toLocaleTimeString();
    }
  }

  // 显示错误消息
  showErrorMessage(message) {
    this.addMessage('system', `❌ ${message}`);
  }

  // 显示输入指示器
  showTypingIndicator() {
    this.isTyping = true;
    if (this.typingIndicator) {
      this.typingIndicator.style.display = 'block';
    }
  }

  // 隐藏输入指示器
  hideTypingIndicator() {
    this.isTyping = false;
    if (this.typingIndicator) {
      this.typingIndicator.style.display = 'none';
    }
  }

  // 更新连接状态
  updateStatus(status, text) {
    console.log('更新状态:', status, text);
    
    if (this.statusIndicator && this.statusText) {
      const statusColors = {
        connecting: '#FFA500',
        connected: '#4CAF50',
        disconnected: '#757575',
        error: '#F44336'
      };

      this.statusIndicator.style.color = statusColors[status] || '#757575';
      this.statusText.textContent = text;
    }
    
    // 更新发送按钮状态
    if (this.sendButton) {
      if (status === 'connected') {
        const inputValue = this.inputElement ? this.inputElement.value.trim() : '';
        this.sendButton.disabled = inputValue.length === 0;
      } else {
        // this.sendButton.disabled = true;
      }
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
      if (this.sendButton) {
        const isConnected = wsClient.isConnected;
        // this.sendButton.disabled = !isConnected;
      }
    }
  }

  // 滚动到底部
  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  // 自动调整文本框高度
  autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
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
    wsClient.disconnect();
    this.currentTemplate = null;
  }

  // 切换模板
  switchTemplate(templateId) {
    console.log(`切换模板从 ${this.currentTemplate} 到 ${templateId}`);
    
    if (this.currentTemplate !== templateId) {
      this.currentTemplate = templateId;
      this.disconnect();
      this.clearHistory();
      
      // 延迟重新连接，确保旧连接完全断开
      setTimeout(() => {
        this.connectToTemplate(templateId);
      }, 200);
    }
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

// 导出给HTML使用的全局函数
window.ChatManager = {
  clearHistory: () => chatManager.clearHistory(),
  sendMessage: () => chatManager.sendMessage(),
  switchTemplate: (templateId) => chatManager.switchTemplate(templateId)
};