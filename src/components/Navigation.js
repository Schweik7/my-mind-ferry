// src/components/Navigation.js - 修复版导航管理器
export class Navigation {
  static isVisible = false;

  static toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  static show() {
    const navPanel = document.getElementById('nav-panel');
    if (navPanel) {
      navPanel.classList.remove('nav-hidden');
      this.isVisible = true;
    }
  }

  static hide() {
    const navPanel = document.getElementById('nav-panel');
    if (navPanel) {
      navPanel.classList.add('nav-hidden');
      this.isVisible = false;
    }
  }

  // 修复：确保updateActive方法存在
  static updateActive(sceneNumber) {
    console.log('更新导航活动状态到场景:', sceneNumber);
    
    const journeyItems = document.querySelectorAll('.journey-item');
    journeyItems.forEach((item, index) => {
      if (index === sceneNumber - 1) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  static init() {
    console.log('初始化导航系统...');
    
    // 绑定导航触发器事件
    const navTrigger = document.getElementById('nav-trigger');
    if (navTrigger) {
      navTrigger.addEventListener('click', () => {
        this.toggle();
      });
    }

    // 绑定关闭按钮事件
    const navClose = document.querySelector('.nav-close');
    if (navClose) {
      navClose.addEventListener('click', () => {
        this.hide();
      });
    }

    // 绑定场景切换事件 - 使用事件代理避免循环依赖
    const journeyItems = document.querySelectorAll('.journey-item');
    journeyItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        // 触发自定义事件，由main.js监听处理
        window.dispatchEvent(new CustomEvent('sceneSwitch', { 
          detail: { sceneNumber: index + 1 } 
        }));
        
        // 更新活动状态
        this.updateActive(index + 1);
        
        // 隐藏导航
        this.hide();
      });
    });

    console.log('✅ 导航系统初始化完成');
  }

  // 获取当前活动场景
  static getActiveScene() {
    const activeItem = document.querySelector('.journey-item.active');
    if (activeItem) {
      const allItems = document.querySelectorAll('.journey-item');
      return Array.from(allItems).indexOf(activeItem) + 1;
    }
    return 1;
  }

  // 设置导航项状态
  static setItemStatus(sceneNumber, status) {
    const journeyItems = document.querySelectorAll('.journey-item');
    const item = journeyItems[sceneNumber - 1];
    if (item) {
      // 移除所有状态类
      item.classList.remove('completed', 'current', 'locked');
      // 添加新状态
      if (status) {
        item.classList.add(status);
      }
    }
  }

  // 批量更新导航状态
  static updateNavigationProgress(completedScenes = [], currentScene = 1) {
    const journeyItems = document.querySelectorAll('.journey-item');
    
    journeyItems.forEach((item, index) => {
      const sceneNumber = index + 1;
      item.classList.remove('completed', 'current', 'locked', 'active');
      
      if (completedScenes.includes(sceneNumber)) {
        item.classList.add('completed');
      } else if (sceneNumber === currentScene) {
        item.classList.add('current', 'active');
      } else if (sceneNumber > currentScene) {
        item.classList.add('locked');
      }
    });
  }
}

// 页面加载完成后初始化导航
document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化，确保DOM完全加载
  setTimeout(() => {
    Navigation.init();
  }, 100);
});