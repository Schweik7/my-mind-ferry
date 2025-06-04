// 导入场景组件
import { Navigation } from './components/Navigation.js';
import { SceneManager } from './components/SceneManager.js';
import { PainTool } from './components/PainTool.js';
import { EmotionRecognition } from './components/EmotionRecognition.js';
import { CognitiveTool } from './components/CognitiveTool.js';
import { SelfSanctuary } from './components/SelfSanctuary.js';

// 监听场景切换事件
window.addEventListener('sceneSwitch', (event) => {
  SceneManager.switchTo(event.detail.sceneNumber);
});

// 键盘控制
document.addEventListener('keydown', (event) => {
  if (event.key >= '1' && event.key <= '6') {
    SceneManager.switchTo(parseInt(event.key));
  } else if (event.key >= '1' && event.key <= '5' && SceneManager.currentScene === 2) {
    // 疼痛等级快捷键
    const level = parseInt(event.key);
    document.querySelectorAll('.bubble-item').forEach(item => {
      item.classList.remove('active');
      if (parseInt(item.dataset.level) === level) {
        item.classList.add('active');
        PainTool.currentPainLevel = level;
      }
    });
  } else if (event.key === 'Escape') {
    // ESC键隐藏导航面板
    Navigation.hide();
  } else if (event.key === ' ' || event.key === 'Tab') {
    // 空格键或Tab键显示/隐藏导航
    event.preventDefault();
    Navigation.toggle();
  }
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
  SceneManager.cleanup();
});

// 系统初始化
console.log('🌊 心灵旅途系统已启动');
console.log('⛵ 从海上启程，经过治愈之港、情感之岛、认知灯塔、自我圣殿，最终到达希望彼岸');
console.log('💡 使用数字键1-6开始您的心灵之旅');
console.log('🧭 点击左上角波浪图标或按空格键打开导航');
console.log('🌊 愿这段旅程为您的心灵带来平静与力量');

// 初始化导航状态
Navigation.updateActive(1);

// 将组件暴露到全局，以便HTML中的onclick能正常工作
window.Navigation = Navigation;
window.SceneManager = SceneManager;
window.PainTool = PainTool;
window.EmotionRecognition = EmotionRecognition;
window.CognitiveTool = CognitiveTool;
window.SelfSanctuary = SelfSanctuary;