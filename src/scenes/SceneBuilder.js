// src/scenes/SceneBuilder.js - 场景构建器模块
export class SceneBuilder {
  constructor() {
    this.chatSectionTemplate = this.createChatSectionTemplate();
  }

  // 创建聊天区域模板
  createChatSectionTemplate() {
    return (sceneNumber) => `
      <div class="scene-chat-section">
        <div class="chat-toggle-btn" onclick="window.enhancedSceneManager.toggleChat(${sceneNumber})">
          <span class="chat-icon">💬</span>
          <span class="chat-text">与AI对话</span>
        </div>
        <div class="scene-chat-container" id="scene-chat-container-${sceneNumber}" style="display: block;">
          <!-- 聊天界面将在这里动态生成 -->
        </div>
      </div>
    `;
  }

  // 构建完整场景内容
  buildSceneContent(sceneNumber, baseContent, hasChat = false) {
    let fullContent = baseContent;
    
    if (hasChat) {
      fullContent += this.chatSectionTemplate(sceneNumber);
    }
    
    return fullContent;
  }

  // 创建通用场景容器
  createSceneContainer(title, subtitle, content) {
    return `
      <div class="scene-container">
        <div class="scene-header">
          <h1 class="scene-title">${title}</h1>
          <p class="scene-subtitle">${subtitle}</p>
        </div>
        ${content}
      </div>
    `;
  }

  // 创建通用控制区域
  createControlSection(title, content) {
    return `
      <div class="control-section">
        <h3>${title}</h3>
        ${content}
      </div>
    `;
  }

  // 创建通用按钮
  createButton(text, onclick, className = 'wave-button') {
    return `<button class="${className}" onclick="${onclick}">${text}</button>`;
  }

  // 创建历史记录容器
  createHistoryContainer(id, emptyMessage = '暂无记录') {
    return `
      <div class="pain-history" id="${id}">
        <p style="text-align: center; color: rgba(255,255,255,0.7);">${emptyMessage}</p>
      </div>
    `;
  }

  // 创建输入区域
  createInputArea(id, placeholder, rows = 3) {
    return `
      <textarea 
        id="${id}" 
        class="thought-input" 
        placeholder="${placeholder}"
        rows="${rows}"
      ></textarea>
    `;
  }
}

// 导出单例
export const sceneBuilder = new SceneBuilder();