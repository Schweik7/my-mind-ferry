// src/components/EnhancedSceneManager.js - 修复聊天界面生成问题
import { chatManager } from './ChatManager.js';
import { createPainVisualizationScene } from '../scenes/PainVisualizationScene.js';
import { createEmotionRecognitionScene } from '../scenes/EmotionRecognitionScene.js';
import { createCognitiveLighthouseScene } from '../scenes/CognitiveLighthouseScene.js';
import { createSelfSanctuaryScene } from '../scenes/SelfSanctuaryScene.js';
import { createVRScenes } from '../scenes/VRScenes.js';
import { VRInteractionSystem } from '../vr/VRInteractionSystem.js';

/**
 * 增强版场景管理器 - 修复版
 */
export class EnhancedSceneManager {
  constructor() {
    this.currentScene = 1;
    this.previousScene = null;
    this.vrScenesInitialized = false;
    this.sceneComponents = new Map();
    this.vrInteraction = null; // VR交互系统
    
    // 场景配置
    this.sceneConfig = {
      1: {
        name: '心灵摆渡人的启程',
        templateId: null,
        containerIds: ['scene1-container'],
        skyTexture: '#skyTexture1',
        hasChat: false,
        hasTool: false,
        hasVRIntroduction: true,
        isVRScene: true
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
        isVRScene: true
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
        
        // 场景1特殊处理：VR交互式介绍
        if (sceneNumber === 1 && config.hasVRIntroduction) {
          await this.setupVRIntroduction();
        } else if (config.hasChat) {
          // 其他VR场景创建聊天界面
          await this.createVRSceneChat(sceneNumber, config);
        }
      } else {
        // 普通2D场景处理
        console.log(`初始化2D场景 ${sceneNumber}`);
        await this.createSceneContent(sceneNumber);
        this.showVRContainers(config.containerIds);
        
        // 初始化工具组件
        if (config.hasTool && config.toolComponent) {
          this.initializeToolComponent(config.toolComponent);
        }
        
        // 修复关键问题：强制初始化聊天功能
        if (config.hasChat) {
          console.log(`强制初始化场景 ${sceneNumber} 的聊天功能`);
          await this.forceInitializeChat(sceneNumber, config);
        }
      }

    } catch (error) {
      console.error(`场景 ${sceneNumber} 初始化失败:`, error);
    }
  }

  // 设置VR场景1的射线交互
  async setupVRIntroduction() {
    console.log('设置VR射线交互');
    
    // 等待A-Frame场景完全加载
    await this.waitForAFrameReady();
    
    // 初始化VR交互系统
    if (!this.vrInteraction) {
      this.vrInteraction = new VRInteractionSystem();
    }
    
    // 设置摆渡人模型交互
    const ferrymanModel = document.getElementById('ferryman-model');
    if (ferrymanModel) {
      this.vrInteraction.addInteractiveObject(ferrymanModel, {
        onHover: () => {
          console.log('摆渡人模型 hover');
          ferrymanModel.setAttribute('animation__hover', 'property: scale; to: 1.1 1.1 1.1; dur: 300');
        },
        onHoverEnd: () => {
          ferrymanModel.setAttribute('animation__hover', 'property: scale; to: 1 1 1; dur: 300');
        },
        onClick: () => {
          console.log('摆渡人模型被点击！');
          ferrymanModel.setAttribute('animation__click', 'property: scale; to: 0.95 0.95 0.95; dur: 150; dir: alternate');
          this.showVRIntroductionCards();
        }
      });
    }
    
    console.log('VR射线交互设置完成');
  }

  // 等待A-Frame准备就绪
  waitForAFrameReady() {
    return new Promise((resolve) => {
      const scene = document.querySelector('a-scene');
      if (scene && scene.hasLoaded) {
        resolve();
      } else {
        const checkReady = () => {
          const scene = document.querySelector('a-scene');
          if (scene && scene.hasLoaded) {
            resolve();
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      }
    });
  }

  // 创建场景内容 - 修复版本
  async createSceneContent(sceneNumber) {
    const config = this.sceneConfig[sceneNumber];
    
    if (!config.panelId) {
      console.log(`场景 ${sceneNumber} 没有panelId，跳过内容创建`);
      return;
    }

    const panel = document.getElementById(config.panelId);
    if (!panel) {
      console.error(`场景 ${sceneNumber} 的面板不存在:`, config.panelId);
      return;
    }

    console.log(`创建场景 ${sceneNumber} 内容，面板ID: ${config.panelId}`);

    // 生成场景HTML内容
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
      console.log(`为场景 ${sceneNumber} 生成了HTML内容`);
      
      // 关键修复：先设置基础内容，再添加聊天区域
      panel.innerHTML = sceneHTML;
      
      // 如果有聊天功能，动态插入聊天区域
      if (config.hasChat) {
        this.insertChatSection(panel, sceneNumber);
      }
    }
    
    // 显示面板
    panel.style.display = 'block';
    console.log(`场景 ${sceneNumber} 面板已显示`);
  }

  // 插入聊天区域到场景 - 新方法
  insertChatSection(panel, sceneNumber) {
    const chatId = `scene-chat-container-${sceneNumber}`;
    console.log(`插入聊天区域，ID: ${chatId}`);
    
    // 创建聊天区域HTML
    const chatSectionHTML = `
      <div class="scene-chat-section">
        <div class="chat-toggle-btn" onclick="window.enhancedSceneManager.toggleChat(${sceneNumber})">
          <span class="chat-icon">💬</span>
          <span class="chat-text">与AI对话</span>
        </div>
        <div class="scene-chat-container" id="${chatId}" style="display: block;">
          <!-- 聊天界面将在这里动态生成 -->
        </div>
      </div>
    `;
    
    // 将聊天区域插入到面板末尾
    const chatDiv = document.createElement('div');
    chatDiv.innerHTML = chatSectionHTML;
    panel.appendChild(chatDiv.firstElementChild);
    
    console.log(`聊天区域已插入到场景 ${sceneNumber}`);
  }

  // 强制初始化聊天功能 - 修复版本
  async forceInitializeChat(sceneNumber, config) {
    const chatContainerId = `scene-chat-container-${sceneNumber}`;
    
    try {
      console.log(`=== 强制初始化场景 ${sceneNumber} 聊天功能 ===`);
      console.log(`聊天容器ID: ${chatContainerId}`);
      console.log(`模板ID: ${config.templateId}`);
      
      // 等待DOM更新完成
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const chatContainer = document.getElementById(chatContainerId);
      if (!chatContainer) {
        console.error(`聊天容器不存在: ${chatContainerId}`);
        // 如果容器不存在，尝试重新创建
        const panel = document.getElementById(config.panelId);
        if (panel) {
          this.insertChatSection(panel, sceneNumber);
          // 再次等待DOM更新
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      // 再次查找容器
      const finalChatContainer = document.getElementById(chatContainerId);
      if (!finalChatContainer) {
        console.error('聊天容器创建失败');
        return;
      }
      
      console.log(`找到聊天容器:`, finalChatContainer);
      
      // 确保聊天容器可见
      finalChatContainer.style.display = 'block';
      
      // 强制断开旧连接
      chatManager.disconnect();
      
      // 清空容器
      finalChatContainer.innerHTML = '';
      
      // 延迟初始化，确保断开完成
      setTimeout(() => {
        try {
          console.log(`开始初始化聊天界面: ${chatContainerId} -> 模板 ${config.templateId}`);
          chatManager.initChatInterface(chatContainerId, config.templateId);
          console.log(`✅ 场景 ${sceneNumber} 聊天功能强制初始化完成`);
        } catch (error) {
          console.error(`场景 ${sceneNumber} 聊天功能初始化失败:`, error);
        }
      }, 1000);
      
    } catch (error) {
      console.error(`场景 ${sceneNumber} 强制聊天功能初始化失败:`, error);
    }
  }

  // 切换聊天显示/隐藏
  toggleChat(sceneNumber) {
    const chatContainer = document.getElementById(`scene-chat-container-${sceneNumber}`);
    if (chatContainer) {
      const isVisible = chatContainer.style.display !== 'none';
      chatContainer.style.display = isVisible ? 'none' : 'block';
      
      const toggleBtn = chatContainer.parentElement.querySelector('.chat-toggle-btn .chat-text');
      if (toggleBtn) {
        toggleBtn.textContent = isVisible ? '显示对话' : '隐藏对话';
      }
    }
  }

  // 显示VR介绍卡片
  showVRIntroductionCards() {
    console.log('显示VR介绍卡片');
    // VR介绍卡片逻辑...
    alert('VR介绍卡片功能待实现');
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
    
    // 清理VR交互
    if (this.vrInteraction && currentConfig?.isVRScene) {
      this.vrInteraction.cleanup();
    }
  }

  // 设置键盘控制
  setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '6') {
        const sceneNumber = parseInt(e.key);
        this.switchTo(sceneNumber);
      }
    });
  }

  // 更新导航状态
  updateNavigationState(sceneNumber) {
    if (window.Navigation) {
      window.Navigation.updateActive(sceneNumber);
    }
  }

  // 获取场景信息
  getSceneInfo() {
    return {
      currentScene: this.currentScene,
      sceneName: this.sceneConfig[this.currentScene]?.name || '未知场景',
      previousScene: this.previousScene
    };
  }

  // 销毁管理器
  destroy() {
    if (this.vrInteraction) {
      this.vrInteraction.cleanup();
    }
    chatManager.cleanup();
  }
}

// 创建单例实例
export const enhancedSceneManager = new EnhancedSceneManager();

// 暴露到全局
window.enhancedSceneManager = enhancedSceneManager;