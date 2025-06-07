// src/components/EnhancedSceneManager.js - 修复版本
import { chatManager } from './ChatManager.js';
import { createPainVisualizationScene } from '../scenes/PainVisualizationScene.js';
import { createEmotionRecognitionScene } from '../scenes/EmotionRecognitionScene.js';
import { createCognitiveLighthouseScene } from '../scenes/CognitiveLighthouseScene.js';
import { createSelfSanctuaryScene } from '../scenes/SelfSanctuaryScene.js';
import { createVRScenes } from '../scenes/VRScenes.js';

/**
 * 增强版场景管理器 - 统一管理所有场景和聊天功能
 */
export class EnhancedSceneManager {
  constructor() {
    this.currentScene = 1;
    this.previousScene = null;
    this.vrScenesInitialized = false;
    this.sceneComponents = new Map();
    
    // 场景配置
    this.sceneConfig = {
      1: {
        name: '心灵摆渡人的启程',
        templateId: 1,
        containerIds: ['scene1-container'],
        skyTexture: '#skyTexture1',
        hasChat: true,
        hasTool: false,
        isVRScene: true // 标记为VR场景
      },
      2: {
        name: '治愈之港',
        templateId: 2,
        containerIds: ['scene2-container'],
        panelId: 'pain-visualization-panel',
        skyTexture: '#skyTexture2',
        hasChat: true,
        hasTool: true,
        toolComponent: 'PainTool',
        isVRScene: false
      },
      3: {
        name: '情感之岛',
        templateId: 3,
        containerIds: [],
        panelId: 'emotion-recognition-panel',
        hasChat: true,
        hasTool: true,
        toolComponent: 'EmotionRecognition',
        isVRScene: false
      },
      4: {
        name: '认知灯塔',
        templateId: 4,
        containerIds: ['scene4-container'],
        panelId: 'cognitive-lighthouse-panel',
        skyTexture: '#skyTexture4',
        hasChat: true,
        hasTool: true,
        toolComponent: 'CognitiveTool',
        isVRScene: false
      },
      5: {
        name: '自我圣殿',
        templateId: 5,
        containerIds: ['scene5-container'],
        panelId: 'self-sanctuary-panel',
        skyTexture: '#skyTexture5',
        hasChat: true,
        hasTool: true,
        toolComponent: 'SelfSanctuary',
        isVRScene: false
      },
      6: {
        name: '希望彼岸',
        templateId: 6,
        containerIds: ['scene6-container'],
        skyTexture: '#skyTexture6',
        hasChat: true,
        hasTool: false,
        isVRScene: true // 标记为VR场景
      }
    };

    this.init();
  }

  // 初始化场景管理器
  init() {
    console.log('🎬 增强版场景管理器初始化');
    this.setupKeyboardControls();
    this.setupVRScenes();
    
    // 确保默认场景正确显示
    setTimeout(() => {
      this.initializeScene(1);
    }, 100);
  }

  // 切换到指定场景
  async switchTo(sceneNumber) {
    if (sceneNumber === this.currentScene) return;

    const sceneConfig = this.sceneConfig[sceneNumber];
    if (!sceneConfig) {
      console.error('无效的场景编号:', sceneNumber);
      return;
    }

    console.log(`🎬 切换到场景 ${sceneNumber}: ${sceneConfig.name}`);

    // 清理当前场景
    await this.cleanupCurrentScene();

    // 保存上一个场景
    this.previousScene = this.currentScene;
    this.currentScene = sceneNumber;

    // 隐藏所有面板和容器
    this.hideAllPanelsAndContainers();

    // 初始化新场景
    await this.initializeScene(sceneNumber);

    // 更新导航状态
    this.updateNavigationState(sceneNumber);

    // 隐藏导航
    if (window.Navigation) {
      window.Navigation.hide();
    }

    console.log(`✅ 场景切换完成: ${sceneConfig.name}`);
  }

  // 初始化场景
  async initializeScene(sceneNumber) {
    const config = this.sceneConfig[sceneNumber];
    
    try {
      // 设置天空盒
      this.setSkyTexture(config.skyTexture);
      
      if (config.isVRScene) {
        // VR场景处理
        this.showVRContainers(config.containerIds);
        // 为VR场景创建聊天界面
        if (config.hasChat) {
          await this.createVRSceneChat(sceneNumber, config);
        }
      } else {
        // 普通2D场景处理
        await this.createSceneContent(sceneNumber);
        this.showVRContainers(config.containerIds);
        
        // 初始化工具组件
        if (config.hasTool && config.toolComponent) {
          this.initializeToolComponent(config.toolComponent);
        }
        
        // 初始化聊天功能
        if (config.hasChat) {
          await this.initializeChat(sceneNumber, config);
        }
      }

    } catch (error) {
      console.error(`场景 ${sceneNumber} 初始化失败:`, error);
    }
  }

  // 为VR场景创建聊天界面
  async createVRSceneChat(sceneNumber, config) {
    // 检查是否已经存在VR聊天界面
    let vrChatContainer = document.getElementById('vr-scene-chat');
    
    if (!vrChatContainer) {
      // 创建VR场景的聊天界面
      vrChatContainer = document.createElement('div');
      vrChatContainer.id = 'vr-scene-chat';
      vrChatContainer.className = 'vr-scene-chat-overlay';
      vrChatContainer.innerHTML = `
        <div class="vr-chat-toggle-btn" onclick="EnhancedSceneManager.toggleVRChat()">
          <span class="chat-icon">💬</span>
          <span class="chat-text">与${config.name}对话</span>
        </div>
        <div class="vr-chat-container" id="vr-chat-container" style="display: none;">
          <!-- 聊天界面将在这里动态生成 -->
        </div>
      `;
      
      // 添加样式
      vrChatContainer.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        z-index: 1000;
        max-width: 400px;
        width: 100%;
      `;
      
      document.body.appendChild(vrChatContainer);
    }
    
    // 更新聊天按钮文本
    const chatText = vrChatContainer.querySelector('.chat-text');
    if (chatText) {
      chatText.textContent = `与${config.name}对话`;
    }
    
    // 确保VR聊天界面可见
    vrChatContainer.style.display = 'block';
    
    // 初始化聊天功能
    if (config.hasChat) {
      setTimeout(() => {
        try {
          chatManager.disconnect();
          const chatContainer = document.getElementById('vr-chat-container');
          if (chatContainer) {
            chatContainer.innerHTML = '';
            chatManager.initChatInterface('vr-chat-container', config.templateId);
          }
          console.log(`✅ VR场景 ${sceneNumber} 聊天功能初始化完成`);
        } catch (error) {
          console.error(`VR场景 ${sceneNumber} 聊天功能初始化失败:`, error);
        }
      }, 200);
    }
  }

  // 创建场景内容
  async createSceneContent(sceneNumber) {
    const config = this.sceneConfig[sceneNumber];
    
    if (!config.panelId) return;

    const panel = document.getElementById(config.panelId);
    if (!panel) return;

    // 如果面板为空，创建内容
    if (!panel.innerHTML.trim()) {
      let sceneHTML = '';
      
      switch (sceneNumber) {
        case 2:
          sceneHTML = createPainVisualizationScene();
          break;
        case 3:
          sceneHTML = createEmotionRecognitionScene();
          break;
        case 4:
          sceneHTML = createCognitiveLighthouseScene();
          break;
        case 5:
          sceneHTML = createSelfSanctuaryScene();
          break;
      }

      if (sceneHTML) {
        // 添加聊天区域
        const chatSection = this.createChatSection();
        panel.innerHTML = sceneHTML + chatSection;
      }
    }
    
    // 显示面板
    panel.style.display = 'block';
  }

  // 创建聊天区域
  createChatSection() {
    return `
      <div class="scene-chat-section">
        <div class="chat-toggle-btn" onclick="EnhancedSceneManager.toggleChat()">
          <span class="chat-icon">💬</span>
          <span class="chat-text">与AI对话</span>
        </div>
        <div class="scene-chat-container" id="scene-chat-container" style="display: none;">
          <!-- 聊天界面将在这里动态生成 -->
        </div>
      </div>
    `;
  }

  // 初始化聊天功能
  async initializeChat(sceneNumber, config) {
    const chatContainerId = 'scene-chat-container';
    
    try {
      console.log(`初始化场景 ${sceneNumber} 的聊天功能, 模板ID: ${config.templateId}`);
      
      // 等待聊天容器创建完成
      const chatContainer = document.getElementById(chatContainerId);
      if (!chatContainer) {
        console.error('聊天容器不存在:', chatContainerId);
        return;
      }
      
      // 确保聊天容器可见
      chatContainer.style.display = 'block';
      
      // 延迟初始化，确保DOM完全准备好
      setTimeout(() => {
        try {
          // 断开旧连接
          chatManager.disconnect();
          
          // 清空容器
          chatContainer.innerHTML = '';
          
          // 初始化新的聊天界面
          chatManager.initChatInterface(chatContainerId, config.templateId);
          
          console.log(`✅ 场景 ${sceneNumber} 聊天功能初始化完成`);
        } catch (error) {
          console.error(`场景 ${sceneNumber} 聊天功能初始化失败:`, error);
        }
      }, 200);
      
    } catch (error) {
      console.error(`场景 ${sceneNumber} 聊天功能初始化失败:`, error);
    }
  }

  // 初始化工具组件
  initializeToolComponent(componentName) {
    try {
      const component = window[componentName];
      if (component && typeof component.init === 'function') {
        component.init();
        console.log(`✅ ${componentName} 组件初始化完成`);
      }
    } catch (error) {
      console.error(`${componentName} 组件初始化失败:`, error);
    }
  }

  // 设置VR场景
  setupVRScenes() {
    if (!this.vrScenesInitialized) {
      createVRScenes();
      this.vrScenesInitialized = true;
      console.log('✅ VR场景初始化完成');
    }
  }

  // 显示VR容器
  showVRContainers(containerIds) {
    // 隐藏所有VR容器
    Object.values(this.sceneConfig).forEach(config => {
      config.containerIds?.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.setAttribute('visible', false);
        }
      });
    });

    // 显示当前场景的VR容器
    containerIds?.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.setAttribute('visible', true);
      }
    });
  }

  // 设置天空盒纹理
  setSkyTexture(texture) {
    if (!texture) return;
    
    const sky = document.getElementById('scene-sky');
    if (sky) {
      sky.setAttribute('src', texture);
    }
  }

  // 隐藏所有面板和容器
  hideAllPanelsAndContainers() {
    // 隐藏所有面板
    document.querySelectorAll('.scene-panel').forEach(panel => {
      panel.style.display = 'none';
    });

    // 隐藏VR聊天界面
    const vrChat = document.getElementById('vr-scene-chat');
    if (vrChat) {
      vrChat.style.display = 'none';
    }

    // 隐藏所有VR容器
    Object.values(this.sceneConfig).forEach(config => {
      config.containerIds?.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.setAttribute('visible', false);
        }
      });
    });
  }

  // 清理当前场景
  async cleanupCurrentScene() {
    const currentConfig = this.sceneConfig[this.currentScene];
    
    if (currentConfig?.hasTool && currentConfig.toolComponent) {
      try {
        const component = window[currentConfig.toolComponent];
        if (component && typeof component.cleanup === 'function') {
          component.cleanup();
        }
      } catch (error) {
        console.error(`清理 ${currentConfig.toolComponent} 失败:`, error);
      }
    }
    
    // 如果当前场景是VR场景，隐藏VR聊天界面
    if (currentConfig?.isVRScene) {
      const vrChat = document.getElementById('vr-scene-chat');
      if (vrChat) {
        vrChat.style.display = 'none';
      }
    }
  }

  // 更新导航状态
  updateNavigationState(sceneNumber) {
    document.querySelectorAll('.journey-item').forEach((item, index) => {
      item.classList.toggle('active', index === sceneNumber - 1);
    });
  }

  // 设置键盘控制
  setupKeyboardControls() {
    document.addEventListener('keydown', (event) => {
      // 数字键1-6切换场景
      if (event.key >= '1' && event.key <= '6') {
        const sceneNumber = parseInt(event.key);
        this.switchTo(sceneNumber);
      }
      // ESC键隐藏导航
      else if (event.key === 'Escape' && window.Navigation) {
        window.Navigation.hide();
      }
      // 空格键或Tab键切换导航
      else if ((event.key === ' ' || event.key === 'Tab') && window.Navigation) {
        event.preventDefault();
        window.Navigation.toggle();
      }
    });
  }

  // 切换聊天显示状态
  toggleChat() {
    const chatContainer = document.getElementById('scene-chat-container');
    const toggleBtn = document.querySelector('.chat-toggle-btn');
    
    if (!chatContainer || !toggleBtn) {
      console.error('聊天容器或切换按钮不存在');
      return;
    }
    
    const isVisible = chatContainer.style.display !== 'none';
    
    if (isVisible) {
      chatContainer.style.display = 'none';
      toggleBtn.innerHTML = `
        <span class="chat-icon">💬</span>
        <span class="chat-text">与AI对话</span>
      `;
    } else {
      chatContainer.style.display = 'block';
      toggleBtn.innerHTML = `
        <span class="chat-icon">📖</span>
        <span class="chat-text">隐藏对话</span>
      `;
      
      // 如果聊天界面为空或者没有正确初始化，重新初始化
      if (!chatContainer.querySelector('.chat-interface')) {
        console.log('重新初始化聊天界面');
        const currentConfig = this.sceneConfig[this.currentScene];
        if (currentConfig && currentConfig.hasChat) {
          this.initializeChat(this.currentScene, currentConfig);
        }
      }
    }
  }

  // 切换VR场景聊天显示状态
  toggleVRChat() {
    const chatContainer = document.getElementById('vr-chat-container');
    const toggleBtn = document.querySelector('.vr-chat-toggle-btn');
    
    if (!chatContainer || !toggleBtn) {
      console.error('VR聊天容器或切换按钮不存在');
      return;
    }
    
    const isVisible = chatContainer.style.display !== 'none';
    
    if (isVisible) {
      chatContainer.style.display = 'none';
      toggleBtn.innerHTML = `
        <span class="chat-icon">💬</span>
        <span class="chat-text">与${this.sceneConfig[this.currentScene].name}对话</span>
      `;
    } else {
      chatContainer.style.display = 'block';
      toggleBtn.innerHTML = `
        <span class="chat-icon">📖</span>
        <span class="chat-text">隐藏对话</span>
      `;
      
      // 如果聊天界面为空或者没有正确初始化，重新初始化
      if (!chatContainer.querySelector('.chat-interface')) {
        console.log('重新初始化VR聊天界面');
        const currentConfig = this.sceneConfig[this.currentScene];
        if (currentConfig && currentConfig.hasChat) {
          setTimeout(() => {
            chatManager.disconnect();
            chatContainer.innerHTML = '';
            chatManager.initChatInterface('vr-chat-container', currentConfig.templateId);
          }, 100);
        }
      }
    }
  }

  // 返回上一个场景
  goToPreviousScene() {
    if (this.previousScene && this.previousScene !== this.currentScene) {
      this.switchTo(this.previousScene);
    }
  }

  // 获取场景信息
  getSceneInfo(sceneNumber = null) {
    const targetScene = sceneNumber || this.currentScene;
    return {
      current: this.currentScene,
      previous: this.previousScene,
      config: this.sceneConfig[targetScene],
      available: Object.keys(this.sceneConfig).map(Number)
    };
  }

  // 预加载场景资源
  async preloadScene(sceneNumber) {
    const config = this.sceneConfig[sceneNumber];
    if (!config) return;

    console.log(`🔄 预加载场景 ${sceneNumber}: ${config.name}`);
    
    try {
      // 预加载纹理
      if (config.skyTexture) {
        const img = new Image();
        img.src = config.skyTexture.replace('#', '/assets/');
      }
      
      // 预加载场景内容但不显示
      if (config.panelId && !config.isVRScene) {
        const panel = document.getElementById(config.panelId);
        if (panel && !panel.innerHTML.trim()) {
          await this.createSceneContent(sceneNumber);
          panel.style.display = 'none'; // 保持隐藏
        }
      }
      
      console.log(`✅ 场景 ${sceneNumber} 预加载完成`);
    } catch (error) {
      console.error(`场景 ${sceneNumber} 预加载失败:`, error);
    }
  }

  // 批量预加载场景
  async preloadAllScenes() {
    console.log('🔄 开始预加载所有场景...');
    
    const preloadPromises = Object.keys(this.sceneConfig)
      .map(Number)
      .filter(sceneNumber => sceneNumber !== this.currentScene)
      .map(sceneNumber => this.preloadScene(sceneNumber));
    
    try {
      await Promise.allSettled(preloadPromises);
      console.log('✅ 所有场景预加载完成');
    } catch (error) {
      console.error('❌ 场景预加载过程中出现错误:', error);
    }
  }

  // 获取聊天历史
  getChatHistory() {
    return chatManager.getHistory();
  }

  // 导出场景数据
  exportSceneData() {
    const data = {
      currentScene: this.currentScene,
      chatHistory: this.getChatHistory(),
      timestamp: new Date().toISOString(),
      sceneConfig: this.sceneConfig
    };
    
    return JSON.stringify(data, null, 2);
  }

  // 重置所有场景
  resetAllScenes() {
    console.log('🔄 重置所有场景...');
    
    // 清理聊天
    chatManager.clearHistory();
    
    // 清理所有工具组件
    Object.values(this.sceneConfig).forEach(config => {
      if (config.hasTool && config.toolComponent) {
        try {
          const component = window[config.toolComponent];
          if (component && typeof component.cleanup === 'function') {
            component.cleanup();
          }
        } catch (error) {
          console.error(`重置 ${config.toolComponent} 失败:`, error);
        }
      }
    });
    
    // 切换到第一个场景
    this.switchTo(1);
    
    console.log('✅ 所有场景重置完成');
  }

  // 销毁场景管理器
  destroy() {
    console.log('🗑️ 销毁场景管理器...');
    
    // 断开聊天连接
    chatManager.disconnect();
    
    // 清理所有组件
    this.resetAllScenes();
    
    // 清理事件监听器
    document.removeEventListener('keydown', this.keyboardHandler);
    
    // 清理VR聊天界面
    const vrChat = document.getElementById('vr-scene-chat');
    if (vrChat) {
      vrChat.remove();
    }
    
    console.log('✅ 场景管理器已销毁');
  }
}

// 创建全局实例
export const enhancedSceneManager = new EnhancedSceneManager();

// 导出给HTML使用的全局函数
window.EnhancedSceneManager = {
  switchTo: (sceneNumber) => enhancedSceneManager.switchTo(sceneNumber),
  toggleChat: () => enhancedSceneManager.toggleChat(),
  toggleVRChat: () => enhancedSceneManager.toggleVRChat(),
  goToPreviousScene: () => enhancedSceneManager.goToPreviousScene(),
  resetAllScenes: () => enhancedSceneManager.resetAllScenes(),
  getSceneInfo: (sceneNumber) => enhancedSceneManager.getSceneInfo(sceneNumber),
  exportSceneData: () => enhancedSceneManager.exportSceneData()
};

// 页面加载完成后开始预加载
document.addEventListener('DOMContentLoaded', () => {
  // 延迟预加载，避免影响初始加载速度
  setTimeout(() => {
    enhancedSceneManager.preloadAllScenes();
  }, 2000);
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
  enhancedSceneManager.destroy();
});