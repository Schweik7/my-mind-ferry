// src/main.js - 修复全局变量问题
import { Navigation } from './components/Navigation.js';
import { enhancedSceneManager } from './components/EnhancedSceneManager.js';
import { chatManager } from './components/ChatManager.js'; // 确保导入chatManager
import { PainTool } from './components/PainTool.js';
import { EmotionRecognition } from './components/EmotionRecognition.js';
import { CognitiveTool } from './components/CognitiveTool.js';
import { SelfSanctuary } from './components/SelfSanctuary.js';

// 监听场景切换事件
window.addEventListener('sceneSwitch', (event) => {
  enhancedSceneManager.switchTo(event.detail.sceneNumber);
});

// 点击空白区域隐藏导航
document.addEventListener('click', (event) => {
  const navPanel = document.getElementById('nav-panel');
  const navTrigger = document.getElementById('nav-trigger');

  if (Navigation.isVisible &&
    !navPanel.contains(event.target) &&
    !navTrigger.contains(event.target)) {
    Navigation.hide();
  }
});

// 页面卸载清理
window.addEventListener('beforeunload', () => {
  enhancedSceneManager.destroy();
});

// 系统初始化
console.log('🌊 心灵旅途系统已启动 - 修复版本');
console.log('⛵ 从海上启程，经过治愈之港、情感之岛、认知灯塔、自我圣殿，最终到达希望彼岸');
console.log('💡 使用数字键1-6开始您的心灵之旅');
console.log('🧭 点击左上角波浪图标或按空格键打开导航');
console.log('💬 在每个场景中都可以与专属AI进行深度对话');
console.log('🌊 愿这段旅程为您的心灵带来平静与力量');

// 初始化导航状态
Navigation.updateActive(1);

// 将组件暴露到全局，以便HTML中的onclick能正常工作
window.Navigation = Navigation;
window.SceneManager = enhancedSceneManager; // 兼容旧代码
window.EnhancedSceneManager = window.EnhancedSceneManager; // 已在EnhancedSceneManager.js中定义
window.chatManager = chatManager; // 确保chatManager全局可用
window.PainTool = PainTool;
window.EmotionRecognition = EmotionRecognition;
window.CognitiveTool = CognitiveTool;
window.SelfSanctuary = SelfSanctuary;

// 添加一些调试函数到全局
window.DebugTools = {
  // 获取当前场景信息
  getCurrentSceneInfo: () => enhancedSceneManager.getSceneInfo(),
  
  // 切换到指定场景
  switchScene: (sceneNumber) => enhancedSceneManager.switchTo(sceneNumber),
  
  // 获取聊天历史
  getChatHistory: () => enhancedSceneManager.getChatHistory(),
  
  // 导出所有数据
  exportData: () => {
    const data = enhancedSceneManager.exportSceneData();
    console.log('导出的数据:', data);
    return data;
  },
  
  // 重置系统
  reset: () => enhancedSceneManager.resetAllScenes(),
  
  // 测试WebSocket连接
  testWebSocket: async (templateId = 1) => {
    const { wsClient } = await import('./services/WebSocketClient.js');
    console.log('测试WebSocket连接，模板ID:', templateId);
    await wsClient.connect(templateId);
    return wsClient.getStatus();
  },
  
  // 显示系统状态
  showStatus: () => {
    console.log('🎯 系统状态报告:');
    console.log('- 当前场景:', enhancedSceneManager.getSceneInfo());
    console.log('- 导航状态:', Navigation.isVisible ? '显示' : '隐藏');
    console.log('- 聊天历史数量:', enhancedSceneManager.getChatHistory().length);
    console.log('- 可用场景:', Object.keys(enhancedSceneManager.sceneConfig));
  },
  
  // 测试聊天功能
  testChat: () => {
    console.log('🧪 测试聊天功能:');
    console.log('- chatManager存在:', !!window.chatManager);
    console.log('- ChatManager存在:', !!window.ChatManager);
    console.log('- 当前模板:', window.chatManager?.currentTemplate);
    console.log('- 聊天历史:', window.chatManager?.getHistory());
  }
};

// 开发环境下的额外功能
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🛠️ 开发模式已激活');
  console.log('💻 可用调试工具: window.DebugTools');
  console.log('📊 显示状态: window.DebugTools.showStatus()');
  console.log('🔄 重置系统: window.DebugTools.reset()');
  console.log('📤 导出数据: window.DebugTools.exportData()');
  console.log('💬 测试聊天: window.DebugTools.testChat()');
  
  // 自动显示状态（延迟执行）
  setTimeout(() => {
    window.DebugTools.showStatus();
    window.DebugTools.testChat();
  }, 1000);
}