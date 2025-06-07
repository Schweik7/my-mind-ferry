// src/components/EnhancedSceneManager.js - 修复聊天界面生成问题
import { chatManager } from './ChatManager.js';
import { createPainVisualizationScene } from '../scenes/PainVisualizationScene.js';
import { createEmotionRecognitionScene } from '../scenes/EmotionRecognitionScene.js';
import { createCognitiveLighthouseScene } from '../scenes/CognitiveLighthouseScene.js';
import { createSelfSanctuaryScene } from '../scenes/SelfSanctuaryScene.js';
import { createVRScenes } from '../scenes/VRScenes.js';

/**
 * 增强版场景管理器 - 修复聊天界面生成和VR交互
 */
export class EnhancedSceneManager {
  constructor() {
    this.currentScene = 1;
    this.previousScene = null;
    this.vrScenesInitialized = false;
    this.sceneComponents = new Map();
    this.introductionOpen = false;
    this.raycastSetup = false; // 射线交互设置状态
    
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
        
        // 强制初始化聊天功能 - 修复关键问题
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
    
    // 设置射线交互系统
    this.setupRaycastInteraction();
    
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

  // 设置射线交互系统
  setupRaycastInteraction() {
    if (this.raycastSetup) return;
    
    const scene = document.querySelector('a-scene');
    const camera = document.getElementById('main-camera');
    
    if (!scene || !camera) {
      console.error('A-Frame场景或摄像机未找到');
      return;
    }

    // 注册射线交互组件
    if (typeof AFRAME !== 'undefined' && !AFRAME.components['ferryman-clicker']) {
      AFRAME.registerComponent('ferryman-clicker', {
        init: function () {
          console.log('射线交互组件初始化');
          this.raycaster = new THREE.Raycaster();
          this.mouse = new THREE.Vector2();
          
          // 绑定点击事件
          this.onClick = this.onClick.bind(this);
          this.el.sceneEl.canvas.addEventListener('click', this.onClick);
          
          // 绑定鼠标移动事件用于hover效果
          this.onMouseMove = this.onMouseMove.bind(this);
          this.el.sceneEl.canvas.addEventListener('mousemove', this.onMouseMove);
        },

        onClick: function (event) {
          console.log('射线点击检测');
          this.updateRaycaster(event);
          this.checkIntersections();
        },

        onMouseMove: function (event) {
          this.updateRaycaster(event);
          this.checkHover();
        },

        updateRaycaster: function (event) {
          const canvas = this.el.sceneEl.canvas;
          const rect = canvas.getBoundingClientRect();
          
          // 计算标准化设备坐标
          this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          
          // 获取相机
          const camera = this.el.sceneEl.camera;
          this.raycaster.setFromCamera(this.mouse, camera);
        },

        checkIntersections: function () {
          // 查找摆渡人模型
          const ferrymanModel = document.getElementById('ferryman-model');
          if (!ferrymanModel) return;

          const object3D = ferrymanModel.object3D;
          if (!object3D) return;

          // 射线检测
          const intersects = this.raycaster.intersectObject(object3D, true);
          
          if (intersects.length > 0) {
            console.log('射线击中摆渡人模型！');
            this.triggerIntroduction();
          }
        },

        checkHover: function () {
          const ferrymanModel = document.getElementById('ferryman-model');
          if (!ferrymanModel) return;

          const object3D = ferrymanModel.object3D;
          if (!object3D) return;

          const intersects = this.raycaster.intersectObject(object3D, true);
          
          if (intersects.length > 0) {
            // Hover效果
            ferrymanModel.setAttribute('animation__hover', 'property: scale; to: 1.1 1.1 1.1; dur: 300');
            document.body.style.cursor = 'pointer';
          } else {
            // 取消hover效果
            ferrymanModel.setAttribute('animation__hover', 'property: scale; to: 1 1 1; dur: 300');
            document.body.style.cursor = 'default';
          }
        },

        triggerIntroduction: function () {
          console.log('触发介绍系统');
          
          // 点击动画
          const ferrymanModel = document.getElementById('ferryman-model');
          if (ferrymanModel) {
            ferrymanModel.setAttribute('animation__click', 'property: scale; to: 0.95 0.95 0.95; dur: 150; dir: alternate');
          }
          
          // 显示介绍卡片
          setTimeout(() => {
            if (window.enhancedSceneManager) {
              window.enhancedSceneManager.showVRIntroductionCards();
            }
          }, 200);
        },

        remove: function () {
          if (this.el.sceneEl.canvas) {
            this.el.sceneEl.canvas.removeEventListener('click', this.onClick);
            this.el.sceneEl.canvas.removeEventListener('mousemove', this.onMouseMove);
          }
        }
      });
    }

    // 添加射线交互组件到相机
    camera.setAttribute('ferryman-clicker', '');
    this.raycastSetup = true;
    
    console.log('射线交互系统设置完成');
  }

  // 显示VR介绍卡片
  showVRIntroductionCards() {
    if (this.introductionOpen) return;
    
    this.introductionOpen = true;
    console.log('创建VR介绍卡片');

    // 创建介绍卡片容器
    const introContainer = document.createElement('a-entity');
    introContainer.id = 'vr-intro-cards';
    introContainer.setAttribute('position', '0 1.5 -2');
    
    // 创建第一张卡片
    this.createIntroCard(introContainer, 0);
    
    // 添加到相机
    const camera = document.getElementById('main-camera');
    if (camera) {
      camera.appendChild(introContainer);
    }
  }

  // 创建介绍卡片
  createIntroCard(container, cardIndex) {
    const stories = [
      {
        title: '🌊 神秘的心灵海洋',
        content: '在这个世界的深处，隐藏着一片名为\n「心灵海洋」的神奇水域。\n每一滴海水都闪烁着生命的光芒。'
      },
      {
        title: '🐋 古老的传说', 
        content: '传说中的生命之鲸曾游弋在此，\n它们留下了珍贵的鲸骨舟，\n能在心灵风暴中守护生命力量。'
      },
      {
        title: '⭐ 闪耀的生命力',
        content: '生命力是真实存在的闪光精华，\n当内心风暴来临时会迷失，\n需要摆渡人的引导才能回归。'
      },
      {
        title: '🏮 你的特殊使命',
        content: '心灵摆渡人是被鲸歌选中的存在，\n你将在复杂的心灵海域中，\n寻找并引导迷失的生命力。'
      }
    ];

    const story = stories[cardIndex];
    if (!story) return;

    // 清空容器
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // 创建卡片背景
    const cardBg = document.createElement('a-plane');
    cardBg.setAttribute('width', '3');
    cardBg.setAttribute('height', '2');
    cardBg.setAttribute('color', '#1a237e');
    cardBg.setAttribute('opacity', '0.9');
    cardBg.setAttribute('position', '0 0 0');
    
    // 创建标题
    const title = document.createElement('a-text');
    title.setAttribute('value', story.title);
    title.setAttribute('position', '0 0.7 0.01');
    title.setAttribute('align', 'center');
    title.setAttribute('color', '#ffffff');
    title.setAttribute('font', 'kframe');
    title.setAttribute('width', '8');
    
    // 创建内容
    const content = document.createElement('a-text');
    content.setAttribute('value', story.content);
    content.setAttribute('position', '0 0 0.01');
    content.setAttribute('align', 'center');
    content.setAttribute('color', '#e3f2fd');
    content.setAttribute('font', 'kframe');
    content.setAttribute('width', '6');
    
    // 创建导航按钮
    const prevBtn = document.createElement('a-box');
    prevBtn.setAttribute('width', '0.5');
    prevBtn.setAttribute('height', '0.3');
    prevBtn.setAttribute('depth', '0.1');
    prevBtn.setAttribute('position', '-1.2 -0.7 0.01');
    prevBtn.setAttribute('color', cardIndex > 0 ? '#4fc3f7' : '#666666');
    prevBtn.setAttribute('class', 'clickable');
    
    const prevText = document.createElement('a-text');
    prevText.setAttribute('value', '上一页');
    prevText.setAttribute('position', '0 0 0.06');
    prevText.setAttribute('align', 'center');
    prevText.setAttribute('color', '#ffffff');
    prevText.setAttribute('font', 'kframe');
    prevText.setAttribute('width', '8');
    
    const nextBtn = document.createElement('a-box');
    nextBtn.setAttribute('width', '0.5');
    nextBtn.setAttribute('height', '0.3');
    nextBtn.setAttribute('depth', '0.1');
    nextBtn.setAttribute('position', '1.2 -0.7 0.01');
    nextBtn.setAttribute('color', cardIndex < 3 ? '#4fc3f7' : '#4caf50');
    nextBtn.setAttribute('class', 'clickable');
    
    const nextText = document.createElement('a-text');
    nextText.setAttribute('value', cardIndex < 3 ? '下一页' : '开始旅程');
    nextText.setAttribute('position', '0 0 0.06');
    nextText.setAttribute('align', 'center');
    nextText.setAttribute('color', '#ffffff');
    nextText.setAttribute('font', 'kframe');
    nextText.setAttribute('width', '8');
    
    // 创建关闭按钮
    const closeBtn = document.createElement('a-box');
    closeBtn.setAttribute('width', '0.3');
    closeBtn.setAttribute('height', '0.3');
    closeBtn.setAttribute('depth', '0.1');
    closeBtn.setAttribute('position', '1.3 0.7 0.01');
    closeBtn.setAttribute('color', '#f44336');
    closeBtn.setAttribute('class', 'clickable');
    
    const closeText = document.createElement('a-text');
    closeText.setAttribute('value', '×');
    closeText.setAttribute('position', '0 0 0.06');
    closeText.setAttribute('align', 'center');
    closeText.setAttribute('color', '#ffffff');
    closeText.setAttribute('font', 'kframe');
    closeText.setAttribute('width', '10');
    
    // 添加按钮交互
    this.setupButtonInteraction(prevBtn, () => {
      if (cardIndex > 0) {
        this.createIntroCard(container, cardIndex - 1);
      }
    });
    
    this.setupButtonInteraction(nextBtn, () => {
      if (cardIndex < 3) {
        this.createIntroCard(container, cardIndex + 1);
      } else {
        this.closeVRIntroduction();
        this.switchTo(2);
      }
    });
    
    this.setupButtonInteraction(closeBtn, () => {
      this.closeVRIntroduction();
    });
    
    // 组装卡片
    prevBtn.appendChild(prevText);
    nextBtn.appendChild(nextText);
    closeBtn.appendChild(closeText);
    
    container.appendChild(cardBg);
    container.appendChild(title);
    container.appendChild(content);
    container.appendChild(prevBtn);
    container.appendChild(nextBtn);
    container.appendChild(closeBtn);
    
    // 添加出现动画
    container.setAttribute('animation', 'property: scale; from: 0 0 0; to: 1 1 1; dur: 500');
  }

  // 设置按钮交互
  setupButtonInteraction(button, callback) {
    // 添加射线交互检测
    if (typeof AFRAME !== 'undefined' && !AFRAME.components['button-clicker']) {
      AFRAME.registerComponent('button-clicker', {
        init: function () {
          this.callback = null;
          this.raycaster = new THREE.Raycaster();
          this.mouse = new THREE.Vector2();
          
          this.onClick = this.onClick.bind(this);
          this.el.sceneEl.canvas.addEventListener('click', this.onClick);
        },

        onClick: function (event) {
          if (!this.callback) return;
          
          const canvas = this.el.sceneEl.canvas;
          const rect = canvas.getBoundingClientRect();
          
          this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          
          const camera = this.el.sceneEl.camera;
          this.raycaster.setFromCamera(this.mouse, camera);
          
          const intersects = this.raycaster.intersectObject(this.el.object3D, true);
          
          if (intersects.length > 0) {
            console.log('按钮被点击');
            this.callback();
          }
        },

        setCallback: function (callback) {
          this.callback = callback;
        },

        remove: function () {
          if (this.el.sceneEl.canvas) {
            this.el.sceneEl.canvas.removeEventListener('click', this.onClick);
          }
        }
      });
    }

    button.setAttribute('button-clicker', '');
    
    // 等待组件初始化完成
    setTimeout(() => {
      const component = button.components['button-clicker'];
      if (component) {
        component.setCallback(callback);
      }
    }, 100);
  }

  // 关闭VR介绍
  closeVRIntroduction() {
    const introContainer = document.getElementById('vr-intro-cards');
    if (introContainer) {
      introContainer.remove();
    }
    this.introductionOpen = false;
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
        console.log(`为场景 ${sceneNumber} 生成了HTML内容`);
        
        // 修复：确保聊天区域被添加
        if (config.hasChat) {
          const chatSection = this.createChatSection(sceneNumber);
          panel.innerHTML = sceneHTML + chatSection;
          console.log(`为场景 ${sceneNumber} 添加了聊天区域`);
        } else {
          panel.innerHTML = sceneHTML;
        }
      }
    }
    
    // 显示面板
    panel.style.display = 'block';
    console.log(`场景 ${sceneNumber} 面板已显示`);
  }

  // 创建聊天区域 - 修复版本
  createChatSection(sceneNumber) {
    const chatId = `scene-chat-container-${sceneNumber}`;
    console.log(`创建聊天区域，ID: ${chatId}`);
    
    return `
      <div class="scene-chat-section">
        <div class="chat-toggle-btn" onclick="EnhancedSceneManager.toggleChat(${sceneNumber})">
          <span class="chat-icon">💬</span>
          <span class="chat-text">与AI对话</span>
        </div>
        <div class="scene-chat-container" id="${chatId}" style="display: block;">
          <!-- 聊天界面将在这里动态生成 -->
        </div>
      </div>
    `;
  }

  // 强制初始化聊天功能 - 新增方法
  async forceInitializeChat(sceneNumber, config) {
    const chatContainerId = `scene-chat-container-${sceneNumber}`;
    
    try {
      console.log(`=== 强制初始化场景 ${sceneNumber} 聊天功能 ===`);
      console.log(`聊天容器ID: ${chatContainerId}`);
      console.log(`模板ID: ${config.templateId}`);
      
      // 等待DOM更新完成
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const chatContainer = document.getElementById(chatContainerId);
      if (!chatContainer) {
        console.error(`聊天容器不存在: ${chatContainerId}`);
        // 尝试查找备用容器
        const fallbackContainer = document.getElementById('scene-chat-container');
        if (fallbackContainer) {
          console.log('使用备用聊天容器');
          chatContainer = fallbackContainer;
        } else {
          console.error('没有找到任何聊天容器');
          return;
        }
      }
      
      console.log(`找到聊天容器:`, chatContainer);
      
      // 确保聊天容器可见
      chatContainer.style.display = 'block';
      
      // 强制断开旧连接
      chatManager.disconnect();
      
      // 清空容器
      chatContainer.innerHTML = '';
      
      // 延迟初始化，确保断开完成
      setTimeout(() => {
        try {
          console.log(`开始初始化聊天界面: ${chatContainerId} -> 模板 ${config.templateId}`);
          chatManager.initChatInterface(chatContainerId, config.templateId);
          console.log(`✅ 场景 ${sceneNumber} 聊天功能强制初始化完成`);
        } catch (error) {
          console.error(`场景 ${sceneNumber} 聊天功能初始化失败:`, error);
        }
      }, 800);
      
    } catch (error) {
      console.error(`场景 ${sceneNumber} 强制聊天功能初始化失败:`, error);
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

    // 隐藏VR介绍卡片
    this.closeVRIntroduction();

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
    
    // 如果当前场景是VR场景，隐藏相关界面
    if (currentConfig?.isVRScene) {
      const vrChat = document.getElementById('vr-scene-chat');
      if (vrChat) {
        vrChat.style.display = 'none';
      }
    }
  }
}