// src/main.js - 重构版主入口文件
import { Navigation } from './components/Navigation.js';
import { enhancedSceneManager } from './components/EnhancedSceneManager.js';
import { chatManager } from './components/ChatManager.js';
import { ToolManager } from './tools/ToolManager.js';
import { SystemLogger } from './utils/SystemLogger.js';

/**
 * 心灵摆渡人系统主入口
 * 负责系统初始化、事件绑定和全局管理
 */
class MindFerrySystem {
  constructor() {
    this.isInitialized = false;
    this.logger = new SystemLogger();
    this.toolManager = new ToolManager();
    
    this.init();
  }

  // 系统初始化
  async init() {
    try {
      this.logger.info('🌊 心灵摆渡人系统启动中...');
      
      // 初始化各个子系统
      await this.initializeSubSystems();
      
      // 绑定全局事件
      this.bindGlobalEvents();
      
      // 设置键盘快捷键
      this.setupKeyboardShortcuts();
      
      // 暴露全局接口
      this.exposeGlobalAPIs();
      
      this.isInitialized = true;
      this.logger.success('✅ 心灵摆渡人系统启动完成');
      this.showWelcomeMessage();
      
    } catch (error) {
      this.logger.error('❌ 系统初始化失败:', error);
    }
  }

  // 初始化子系统
  async initializeSubSystems() {
    // 初始化导航状态
    Navigation.updateActive(1);
    
    // 初始化工具管理器
    this.toolManager.init();
    
    // 等待场景管理器准备就绪
    await this.waitForSceneManager();
    
    this.logger.info('📦 所有子系统初始化完成');
  }

  // 等待场景管理器初始化完成
  waitForSceneManager() {
    return new Promise((resolve) => {
      if (enhancedSceneManager.isInitialized) {
        resolve();
      } else {
        const checkInterval = setInterval(() => {
          if (enhancedSceneManager.isInitialized) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      }
    });
  }

  // 绑定全局事件
  bindGlobalEvents() {
    // 场景切换事件
    window.addEventListener('sceneSwitch', (event) => {
      const { sceneNumber } = event.detail;
      this.handleSceneSwitch(sceneNumber);
    });

    // 点击空白区域隐藏导航
    document.addEventListener('click', (event) => {
      this.handleGlobalClick(event);
    });

    // 页面卸载清理
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // 键盘事件处理
    document.addEventListener('keydown', (event) => {
      this.handleKeyboardInput(event);
    });

    this.logger.info('🔗 全局事件绑定完成');
  }

  // 处理场景切换
  handleSceneSwitch(sceneNumber) {
    this.logger.info(`🎬 切换到场景 ${sceneNumber}`);
    enhancedSceneManager.switchTo(sceneNumber);
  }

  // 处理全局点击
  handleGlobalClick(event) {
    const navPanel = document.getElementById('nav-panel');
    const navTrigger = document.getElementById('nav-trigger');

    if (Navigation.isVisible &&
        navPanel && !navPanel.contains(event.target) &&
        navTrigger && !navTrigger.contains(event.target)) {
      Navigation.hide();
    }
  }

  // 处理键盘输入
  handleKeyboardInput(event) {
    // 场景切换快捷键 (1-6)
    if (event.key >= '1' && event.key <= '6') {
      const sceneNumber = parseInt(event.key);
      this.handleSceneSwitch(sceneNumber);
      return;
    }

    // 导航切换快捷键 (空格键)
    if (event.code === 'Space' && !this.isInputFocused()) {
      event.preventDefault();
      Navigation.toggle();
      return;
    }

    // ESC键隐藏导航
    if (event.key === 'Escape') {
      Navigation.hide();
      return;
    }
  }

  // 检查是否有输入框聚焦
  isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    );
  }

  // 设置键盘快捷键
  setupKeyboardShortcuts() {
    const shortcuts = {
      '1-6': '场景切换',
      'Space': '打开/关闭导航',
      'Escape': '关闭导航',
      'Ctrl+R': '重置当前场景',
      'Ctrl+E': '导出数据'
    };

    // 添加高级快捷键
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'r':
            event.preventDefault();
            this.resetCurrentScene();
            break;
          case 'e':
            event.preventDefault();
            this.exportSystemData();
            break;
        }
      }
    });

    this.logger.info('⌨️ 键盘快捷键设置完成:', shortcuts);
  }

  // 重置当前场景
  resetCurrentScene() {
    const currentScene = enhancedSceneManager.currentScene;
    this.logger.info(`🔄 重置场景 ${currentScene}`);
    enhancedSceneManager.switchTo(currentScene);
  }

  // 导出系统数据
  exportSystemData() {
    try {
      const data = {
        timestamp: new Date().toISOString(),
        currentScene: enhancedSceneManager.getSceneInfo(),
        chatHistory: chatManager.getHistory(),
        toolData: this.toolManager.exportAllData(),
        systemInfo: this.getSystemInfo()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mind-ferry-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      this.logger.success('📤 数据导出成功');
    } catch (error) {
      this.logger.error('导出数据失败:', error);
    }
  }

  // 获取系统信息
  getSystemInfo() {
    return {
      version: '1.0.0',
      buildTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      platform: navigator.platform
    };
  }

  // 暴露全局API
  exposeGlobalAPIs() {
    // 主要组件
    window.Navigation = Navigation;
    window.enhancedSceneManager = enhancedSceneManager;
    window.chatManager = chatManager;
    
    // 工具组件
    window.PainTool = this.toolManager.getPainTool();
    window.EmotionRecognition = this.toolManager.getEmotionRecognition();
    window.CognitiveTool = this.toolManager.getCognitiveTool();
    window.SelfSanctuary = this.toolManager.getSelfSanctuary();

    // 系统调试工具
    window.MindFerryDebug = this.createDebugAPI();

    this.logger.info('🌐 全局API已暴露');
  }

  // 创建调试API
  createDebugAPI() {
    return {
      // 获取当前场景信息
      getCurrentSceneInfo: () => enhancedSceneManager.getSceneInfo(),
      
      // 切换到指定场景
      switchScene: (sceneNumber) => enhancedSceneManager.switchTo(sceneNumber),
      
      // 获取聊天历史
      getChatHistory: () => chatManager.getHistory(),
      
      // 导出所有数据
      exportData: () => this.exportSystemData(),
      
      // 重置系统
      reset: () => this.resetSystem(),
      
      // 测试WebSocket连接
      testWebSocket: async (templateId = 1) => {
        const { wsClient } = await import('./services/WebSocketClient.js');
        this.logger.info('测试WebSocket连接，模板ID:', templateId);
        await wsClient.connect(templateId);
        return wsClient.getStatus();
      },
      
      // 显示系统状态
      showStatus: () => this.showSystemStatus(),
      
      // 测试聊天功能
      testChat: () => this.testChatFunction(),
      
      // 获取系统日志
      getLogs: () => this.logger.getLogs(),
      
      // 清理系统
      cleanup: () => this.cleanup()
    };
  }

  // 显示系统状态
  showSystemStatus() {
    const status = {
      系统状态: this.isInitialized ? '已初始化' : '未初始化',
      当前场景: enhancedSceneManager.getSceneInfo(),
      导航状态: Navigation.isVisible ? '显示' : '隐藏',
      聊天历史数量: chatManager.getHistory().length,
      可用场景: Object.keys(enhancedSceneManager.sceneConfig),
      工具状态: this.toolManager.getStatus()
    };

    console.table(status);
    this.logger.info('🎯 系统状态:', status);
    return status;
  }

  // 测试聊天功能
  testChatFunction() {
    const testResults = {
      chatManager存在: !!window.chatManager,
      当前模板: window.chatManager?.currentTemplate,
      聊天历史: window.chatManager?.getHistory()?.length || 0,
      WebSocket状态: 'unknown'
    };

    import('./services/WebSocketClient.js').then(({ wsClient }) => {
      testResults.WebSocket状态 = wsClient.getStatus();
      console.table(testResults);
    });

    this.logger.info('🧪 聊天功能测试结果:', testResults);
    return testResults;
  }

  // 重置系统
  resetSystem() {
    this.logger.info('🔄 重置系统...');
    
    try {
      // 清理聊天管理器
      chatManager.cleanup();
      
      // 重置场景管理器
      enhancedSceneManager.switchTo(1);
      
      // 清理工具数据
      this.toolManager.clearAllData();
      
      // 隐藏导航
      Navigation.hide();
      
      this.logger.success('✅ 系统重置完成');
    } catch (error) {
      this.logger.error('系统重置失败:', error);
    }
  }

  // 显示欢迎消息
  showWelcomeMessage() {
    const messages = [
      '🌊 心灵旅途系统已启动',
      '⛵ 从海上启程，经过治愈之港、情感之岛、认知灯塔、自我圣殿，最终到达希望彼岸',
      '💡 使用数字键1-6开始您的心灵之旅',
      '🧭 点击左上角波浪图标或按空格键打开导航',
      '💬 在每个场景中都可以与专属AI进行深度对话',
      '🌊 愿这段旅程为您的心灵带来平静与力量'
    ];

    messages.forEach(message => this.logger.info(message));

    // 开发环境下的额外信息
    if (this.isDevelopmentMode()) {
      this.showDevelopmentInfo();
    }
  }

  // 显示开发环境信息
  showDevelopmentInfo() {
    setTimeout(() => {
      this.logger.info('🛠️ 开发模式已激活');
      this.logger.info('💻 可用调试工具: window.MindFerryDebug');
      this.logger.info('📊 显示状态: MindFerryDebug.showStatus()');
      this.logger.info('🔄 重置系统: MindFerryDebug.reset()');
      this.logger.info('📤 导出数据: MindFerryDebug.exportData()');
      this.logger.info('💬 测试聊天: MindFerryDebug.testChat()');
      
      // 自动显示状态
      this.showSystemStatus();
      this.testChatFunction();
    }, 1000);
  }

  // 检查是否为开发模式
  isDevelopmentMode() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '0.0.0.0';
  }

  // 系统清理
  cleanup() {
    this.logger.info('🧹 系统清理中...');
    
    try {
      enhancedSceneManager.destroy();
      chatManager.cleanup();
      this.toolManager.cleanup();
      
      this.logger.success('✅ 系统清理完成');
    } catch (error) {
      this.logger.error('系统清理失败:', error);
    }
  }
}

// 创建并启动系统实例
const mindFerrySystem = new MindFerrySystem();

// 暴露系统实例到全局（用于调试）
window.mindFerrySystem = mindFerrySystem;