// src/vr/VRInteractionSystem.js - VR射线交互系统
export class VRInteractionSystem {
  constructor() {
    this.raycaster = null;
    this.mouse = new THREE.Vector2();
    this.camera = null;
    this.scene = null;
    this.interactiveObjects = new Map(); // 存储交互对象及其回调
    this.canvas = null;
    this.isEnabled = false;
    
    this.init();
  }

  // 初始化交互系统
  init() {
    console.log('初始化VR射线交互系统');
    
    // 等待A-Frame场景加载
    this.waitForAFrameScene().then(() => {
      this.setupRaycaster();
      this.bindEvents();
      this.isEnabled = true;
      console.log('VR射线交互系统初始化完成');
    });
  }

  // 等待A-Frame场景加载完成
  waitForAFrameScene() {
    return new Promise((resolve) => {
      const checkScene = () => {
        const aframeScene = document.querySelector('a-scene');
        if (aframeScene && aframeScene.hasLoaded && aframeScene.object3D) {
          this.scene = aframeScene.object3D;
          this.camera = aframeScene.camera;
          this.canvas = aframeScene.canvas;
          resolve();
        } else {
          setTimeout(checkScene, 100);
        }
      };
      checkScene();
    });
  }

  // 设置射线投射器
  setupRaycaster() {
    if (typeof THREE === 'undefined') {
      console.error('Three.js未加载，无法创建射线投射器');
      return;
    }
    
    this.raycaster = new THREE.Raycaster();
    console.log('射线投射器创建成功');
  }

  // 绑定事件监听器
  bindEvents() {
    if (!this.canvas) return;
    
    // 绑定鼠标移动事件（用于hover效果）
    this.onMouseMove = this.onMouseMove.bind(this);
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    
    // 绑定点击事件
    this.onClick = this.onClick.bind(this);
    this.canvas.addEventListener('click', this.onClick);
    
    console.log('VR交互事件已绑定');
  }

  // 鼠标移动处理
  onMouseMove(event) {
    if (!this.isEnabled || !this.raycaster || !this.camera) return;
    
    this.updateMousePosition(event);
    this.checkHover();
  }

  // 点击处理
  onClick(event) {
    if (!this.isEnabled || !this.raycaster || !this.camera) return;
    
    console.log('VR射线交互 - 点击检测');
    this.updateMousePosition(event);
    this.checkClick();
  }

  // 更新鼠标位置
  updateMousePosition(event) {
    if (!this.canvas) return;
    
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  // 检查hover交互
  checkHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    this.interactiveObjects.forEach((callbacks, element) => {
      const object3D = this.getObject3D(element);
      if (!object3D) return;
      
      const intersects = this.raycaster.intersectObject(object3D, true);
      
      if (intersects.length > 0) {
        // 鼠标进入
        if (!element.dataset.isHovered) {
          element.dataset.isHovered = 'true';
          if (callbacks.onHover) {
            callbacks.onHover(intersects[0]);
          }
        }
      } else {
        // 鼠标离开
        if (element.dataset.isHovered) {
          element.dataset.isHovered = 'false';
          if (callbacks.onHoverEnd) {
            callbacks.onHoverEnd();
          }
        }
      }
    });
  }

  // 检查点击交互
  checkClick() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    this.interactiveObjects.forEach((callbacks, element) => {
      const object3D = this.getObject3D(element);
      if (!object3D) return;
      
      const intersects = this.raycaster.intersectObject(object3D, true);
      
      if (intersects.length > 0) {
        console.log('射线击中对象:', element.id || element.tagName);
        if (callbacks.onClick) {
          callbacks.onClick(intersects[0]);
        }
      }
    });
  }

  // 获取A-Frame元素的Three.js对象
  getObject3D(element) {
    if (element && element.object3D) {
      return element.object3D;
    }
    return null;
  }

  // 添加交互对象
  addInteractiveObject(element, callbacks = {}) {
    if (!element) {
      console.error('尝试添加空的交互对象');
      return;
    }
    
    this.interactiveObjects.set(element, callbacks);
    console.log('添加交互对象:', element.id || element.tagName);
  }

  // 移除交互对象
  removeInteractiveObject(element) {
    if (this.interactiveObjects.has(element)) {
      this.interactiveObjects.delete(element);
      if (element.dataset.isHovered) {
        delete element.dataset.isHovered;
      }
      console.log('移除交互对象:', element.id || element.tagName);
    }
  }

  // 清除所有交互对象
  clearInteractiveObjects() {
    this.interactiveObjects.forEach((callbacks, element) => {
      if (element.dataset.isHovered) {
        delete element.dataset.isHovered;
      }
    });
    this.interactiveObjects.clear();
    console.log('已清除所有交互对象');
  }

  // 启用/禁用交互
  setEnabled(enabled) {
    this.isEnabled = enabled;
    console.log('VR交互系统', enabled ? '已启用' : '已禁用');
  }

  // 清理资源
  cleanup() {
    console.log('清理VR交互系统');
    
    // 移除事件监听器
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.onMouseMove);
      this.canvas.removeEventListener('click', this.onClick);
    }
    
    // 清除交互对象
    this.clearInteractiveObjects();
    
    // 重置状态
    this.isEnabled = false;
    this.raycaster = null;
    this.camera = null;
    this.scene = null;
    this.canvas = null;
  }

  // 获取状态信息
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      hasRaycaster: !!this.raycaster,
      hasCamera: !!this.camera,
      hasScene: !!this.scene,
      hasCanvas: !!this.canvas,
      interactiveObjectsCount: this.interactiveObjects.size
    };
  }
}

// 导出A-Frame组件注册函数
export function registerAFrameInteractionComponents() {
  if (typeof AFRAME === 'undefined') {
    console.warn('A-Frame未加载，跳过组件注册');
    return;
  }

  // 注册可交互组件
  AFRAME.registerComponent('interactive', {
    schema: {
      enabled: { type: 'boolean', default: true }
    },

    init: function () {
      this.isHovered = false;
      this.element = this.el;
      
      // 自动添加到全局VR交互系统
      if (window.vrInteractionSystem) {
        window.vrInteractionSystem.addInteractiveObject(this.element, {
          onHover: () => {
            this.element.emit('mouseenter');
            this.isHovered = true;
          },
          onHoverEnd: () => {
            this.element.emit('mouseleave'); 
            this.isHovered = false;
          },
          onClick: () => {
            this.element.emit('click');
          }
        });
      }
    },

    remove: function () {
      if (window.vrInteractionSystem) {
        window.vrInteractionSystem.removeInteractiveObject(this.element);
      }
    }
  });

  // 注册hover效果组件
  AFRAME.registerComponent('hover-scale', {
    schema: {
      scale: { type: 'number', default: 1.1 },
      duration: { type: 'number', default: 300 }
    },

    init: function () {
      this.originalScale = this.el.getAttribute('scale') || { x: 1, y: 1, z: 1 };
      
      this.el.addEventListener('mouseenter', () => {
        this.el.setAttribute('animation__hover', {
          property: 'scale',
          to: `${this.data.scale} ${this.data.scale} ${this.data.scale}`,
          dur: this.data.duration
        });
      });

      this.el.addEventListener('mouseleave', () => {
        this.el.setAttribute('animation__hover', {
          property: 'scale',
          to: `${this.originalScale.x} ${this.originalScale.y} ${this.originalScale.z}`,
          dur: this.data.duration
        });
      });
    }
  });
  console.log('VR交互组件已注册');
}