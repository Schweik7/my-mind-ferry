// 导航管理器
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
    document.getElementById('nav-panel').classList.remove('nav-hidden');
    this.isVisible = true;
  }

  static hide() {
    document.getElementById('nav-panel').classList.add('nav-hidden');
    this.isVisible = false;
  }

  static updateActive(sceneNumber) {
    document.querySelectorAll('.journey-item').forEach((item, index) => {
      item.classList.toggle('active', index === sceneNumber - 1);
    });
  }

  static init() {
    // 绑定导航事件
    document.getElementById('nav-trigger').addEventListener('click', () => {
      this.toggle();
    });

    document.querySelector('.nav-close').addEventListener('click', () => {
      this.hide();
    });

    // 绑定场景切换事件 - 使用事件代理避免循环依赖
    document.querySelectorAll('.journey-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        // 触发自定义事件，由main.js监听处理
        window.dispatchEvent(new CustomEvent('sceneSwitch', { 
          detail: { sceneNumber: index + 1 } 
        }));
      });
    });
  }
}

// 初始化导航
document.addEventListener('DOMContentLoaded', () => {
  Navigation.init();
});