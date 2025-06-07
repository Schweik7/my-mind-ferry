// src/components/AIChat.js
export class AIChat {
  static instance = null;
  static isVisible = false;
  static currentTemplate = null;
  static ws = null;
  static chatHistory = [];
  static messageQueue = [];
  static presetQA = {};

  static templates = {
    1: {
      id: 1,
      name: "心灵摆渡人",
      avatar: "⛵",
      color: "#4a90e2",
      firstMessage: "看到你来到这片宁静的海滩，我感受到了你内心的波动。作为心灵摆渡人，我想了解是什么样的情感让你踏上这趟旅程？",
      presetQA: {
        "你是谁？": "我是心灵摆渡人，一位专门为迷茫心灵指引方向的温暖引路者。我见证过无数心灵的痛苦与重生，深知每个人内心挣扎的珍贵价值。",
        "这里是什么地方？": "这里是心灵旅程的起点，一片能够抚慰心灵的宁静海滩。在这里，我们可以暂时远离喧嚣，专注于倾听你内心的声音。",
        "你能帮我做什么？": "我可以用温暖的话语抚慰你受伤的心灵，用智慧的光芒照亮你前行的道路，陪伴你走过心灵的风暴。每个心灵都值得被拯救，每个故事都值得被倾听。"
      }
    },
    2: {
      id: 2,
      name: "治愈守护者",
      avatar: "🏥",
      color: "#87ceeb",
      firstMessage: "我感知到你身体某个部位的不适正在影响着你的心情。能否告诉我，现在哪里让你感到不舒服呢？",
      presetQA: {
        "你是谁？": "我是治愈之港的守护者，专门守护着这片能够抚慰身心痛苦的圣地。我深深理解身体不适如何影响心灵平静，愿意陪伴你一起面对。",
        "这里有什么特别的？": "这里是治愈之港，一个专门抚慰身心疼痛的圣地。在这里，每一种不适都会被认真对待，每一声痛苦都能得到温柔的回应。",
        "你如何帮助我缓解不适？": "我会认真倾听你对身体感受的描述，帮你准确定位不适，教授简单的身心放松技巧，并在必要时提醒你寻求专业医疗帮助。"
      }
    },
    3: {
      id: 3,
      name: "镜像精灵",
      avatar: "💎",
      color: "#667eea",
      firstMessage: "我感受到你内心情感的波动，就像海浪拍打着岛屿。此刻，什么样的情感正在你心中涌动？",
      presetQA: {
        "你是谁？": "我是情感之岛的镜像精灵，能够感知和映射人类复杂的情感世界。我相信每种情感都有其存在的意义和价值，无论是快乐还是痛苦。",
        "这个岛屿很特别吗？": "是的，情感之岛是一个能够映射内心情感世界的神奇地方。在这里，你的每种情感都会被看见、理解和接纳，没有对错之分。",
        "你如何帮我处理情感？": "我会通过敏锐的感知为你识别当前的情感状态，帮你理解情感背后的需求，教你接纳和处理各种情绪，让你不再害怕感受。"
      }
    },
    4: {
      id: 4,
      name: "智慧守护者",
      avatar: "🗼",
      color: "#ff7b7b",
      firstMessage: "我从灯塔上看到你内心有些思维迷雾正在困扰着你。能分享一个最近让你感到困扰或焦虑的想法吗？",
      presetQA: {
        "你是谁？": "我是认知灯塔的智慧守护者，专门帮助人们识别和重构扭曲的思维模式。我相信清晰的思维是心灵平静的基础。",
        "这座灯塔有什么作用？": "认知灯塔发出理性的光芒，能够照亮思维中的迷雾，帮你识别各种认知扭曲，如灾难化思维、绝对化思维等，让你看清事物的真相。",
        "你如何帮我改善思维？": "我会引导你审视自动化的负面思维，识别逻辑谬误和认知扭曲，教你收集证据进行理性分析，用更平衡的方式重构思维模式。"
      }
    },
    5: {
      id: 5,
      name: "力量导师",
      avatar: "🏛️",
      color: "#a8e6cf",
      firstMessage: "在这座庄严的圣殿中，我感受到你内在蕴藏着巨大的力量。你认为自己最大的优势或天赋是什么？",
      presetQA: {
        "你是谁？": "我是自我圣殿的力量导师，致力于帮助每个人发现并建构属于自己的内在力量体系。我深信每个人内心都蕴藏着无限的潜能和智慧。",
        "这个圣殿代表什么？": "自我圣殿代表你内在力量的神圣空间，在这里我们将一起发掘你的优势、澄清价值观、构建支持网络，建造属于你的精神家园。",
        "你如何帮我发现力量？": "我会引导你识别被忽视的天赋和优势，帮你明确核心价值观，协助盘点支持资源，指导你回顾成长历程提取智慧，构建面向未来的清晰愿景。"
      }
    },
    6: {
      id: 6,
      name: "重生引导者",
      avatar: "🌸",
      color: "#ff7793",
      firstMessage: "看到你抵达这里，我为你的勇气和坚持感到由衷的骄傲！在这段心灵旅程中，你最大的收获和改变是什么？",
      presetQA: {
        "你是谁？": "我是希望彼岸的重生引导者，在这里见证每一个心灵的蜕变与重生。经历了心灵旅程的洗礼，你已经不再是当初那个迷茫的自己。",
        "这里是旅程的终点吗？": "这里是心灵治愈旅程的完成地，同时也是新生活的起点。你已经拥有了应对生活挑战的智慧和力量，未来的路将更加光明。",
        "我该如何保持这些收获？": "我会帮你整合旅程中的所有收获，确认你已掌握的应对技能，提醒你如何在日常生活中运用这些力量，让改变真正融入你的人生。"
      }
    }
  };

  static init() {
    this.createAIAvatar();
    this.createChatPanel();
    this.bindEvents();
  }

  static createAIAvatar() {
    // 为每个场景创建AI头像
    const avatar = document.createElement('div');
    avatar.id = 'ai-avatar';
    avatar.className = 'ai-avatar hidden';
    avatar.innerHTML = `
      <div class="avatar-container">
        <div class="avatar-icon">⛵</div>
        <div class="avatar-pulse"></div>
        <div class="avatar-greeting">点击与我对话</div>
      </div>
    `;
    document.body.appendChild(avatar);
  }

  static createChatPanel() {
    const chatPanel = document.createElement('div');
    chatPanel.id = 'ai-chat-panel';
    chatPanel.className = 'chat-panel hidden';
    chatPanel.innerHTML = `
      <div class="chat-header">
        <div class="chat-avatar">
          <span class="chat-avatar-icon">⛵</span>
          <div class="chat-info">
            <h3 class="chat-name">心灵摆渡人</h3>
            <p class="chat-status">在线</p>
          </div>
        </div>
        <button class="chat-close" onclick="AIChat.hideChat()">×</button>
      </div>
      
      <div class="chat-body">
        <div class="preset-questions" id="preset-questions">
          <div class="preset-title">💬 快速了解</div>
          <div class="preset-list" id="preset-list"></div>
        </div>
        
        <div class="chat-messages" id="chat-messages"></div>
      </div>
      
      <div class="chat-footer">
        <div class="chat-input-container">
          <textarea id="chat-input" placeholder="输入您的问题..." rows="1"></textarea>
          <button id="chat-send" onclick="AIChat.sendMessage()">发送</button>
        </div>
        <div class="chat-status-bar">
          <span class="connection-status" id="connection-status">连接中...</span>
        </div>
      </div>
    `;
    document.body.appendChild(chatPanel);
  }

  static bindEvents() {
    // AI头像点击事件
    document.getElementById('ai-avatar').addEventListener('click', () => {
      this.showChat();
    });

    // 输入框事件
    const chatInput = document.getElementById('chat-input');
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // 自动调整输入框高度
    chatInput.addEventListener('input', (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    });
  }

  static switchScene(sceneNumber) {
    const template = this.templates[sceneNumber];
    if (!template) return;

    this.currentTemplate = template;
    this.chatHistory = [];

    // 更新头像
    const avatar = document.getElementById('ai-avatar');
    const avatarIcon = avatar.querySelector('.avatar-icon');
    avatarIcon.textContent = template.avatar;
    avatarIcon.style.background = `linear-gradient(45deg, ${template.color}, ${template.color}aa)`;

    // 更新聊天面板
    const chatAvatar = document.querySelector('.chat-avatar-icon');
    const chatName = document.querySelector('.chat-name');
    chatAvatar.textContent = template.avatar;
    chatName.textContent = template.name;

    // 更新预设问题
    this.updatePresetQuestions();

    // 显示头像
    avatar.classList.remove('hidden');

    // 关闭WebSocket连接
    this.disconnectWebSocket();

    // 清空聊天记录
    this.clearChatMessages();
  }

  static updatePresetQuestions() {
    const presetList = document.getElementById('preset-list');
    const questions = Object.keys(this.currentTemplate.presetQA);

    presetList.innerHTML = questions.map(question => `
      <button class="preset-question" onclick="AIChat.askPresetQuestion('${question}')">
        ${question}
      </button>
    `).join('');
  }

  static askPresetQuestion(question) {
    const answer = this.currentTemplate.presetQA[question];

    // 添加用户问题
    this.addMessage('user', question);

    // 添加AI回答
    setTimeout(() => {
      this.addMessage('assistant', answer);
    }, 500);

    // 隐藏预设问题
    document.getElementById('preset-questions').style.display = 'none';
  }

  static showChat() {
    const chatPanel = document.getElementById('ai-chat-panel');
    chatPanel.classList.remove('hidden');

    // 如果是第一次打开且没有聊天记录，发送欢迎消息
    if (this.chatHistory.length === 0) {
      setTimeout(() => {
        this.addMessage('assistant', this.currentTemplate.firstMessage);
      }, 500);
    }

    // 连接WebSocket
    this.connectWebSocket();
  }

  static hideChat() {
    const chatPanel = document.getElementById('ai-chat-panel');
    chatPanel.classList.add('hidden');

    // 显示预设问题
    document.getElementById('preset-questions').style.display = 'block';
  }

  static connectWebSocket() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // TODO
    const host = import.meta.env.DEV ? '127.0.0.1:8000' : window.location.host;

    const wsUrl = `${protocol}//${host}/api/v1/xinling/chat/ws/${this.currentTemplate.id}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket连接已建立');
      this.updateConnectionStatus('已连接', 'connected');

      // 发送队列中的消息
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        this.ws.send(JSON.stringify(message));
      }
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleWebSocketMessage(data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket连接已关闭');
      this.updateConnectionStatus('连接断开', 'disconnected');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket错误:', error);
      this.updateConnectionStatus('连接错误', 'error');
    };
  }

  static disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  static handleWebSocketMessage(data) {
    switch (data.type) {
      case 'message':
        this.addMessage('assistant', data.content);
        break;
      case 'error':
        this.addMessage('system', `错误：${data.message}`);
        break;
      case 'typing':
        this.showTypingIndicator();
        break;
      case 'stop_typing':
        this.hideTypingIndicator();
        break;
    }
  }

  static sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // 添加用户消息
    this.addMessage('user', message);

    // 发送到WebSocket
    const messageData = {
      type: 'user_message',
      content: message,
      template_id: this.currentTemplate.id
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(messageData));
    } else {
      this.messageQueue.push(messageData);
      this.connectWebSocket();
    }

    // 清空输入框
    input.value = '';
    input.style.height = 'auto';

    // 显示输入指示器
    this.showTypingIndicator();
  }

  static addMessage(role, content) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const timestamp = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${content}</p>
      </div>
      <div class="message-time">${timestamp}</div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 保存到历史记录
    this.chatHistory.push({ role, content, timestamp });
  }

  static showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');

    // 移除现有的输入指示器
    const existingIndicator = messagesContainer.querySelector('.typing-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  static hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  static updateConnectionStatus(status, type) {
    const statusElement = document.getElementById('connection-status');
    statusElement.textContent = status;
    statusElement.className = `connection-status ${type}`;
  }

  static clearChatMessages() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = '';
  }

  static hideAvatar() {
    const avatar = document.getElementById('ai-avatar');
    avatar.classList.add('hidden');
  }
}