// src/scenes/VRScenes.js - 修复版VR场景，支持正确的射线交互
export function createVRScenes() {
  const camera = document.getElementById('main-camera');
  
  if (!camera) {
    console.error('主摄像机不存在，无法创建VR场景');
    return;
  }

  // 清理现有的场景容器
  ['scene1-container', 'scene2-container', 'scene4-container', 'scene5-container', 'scene6-container'].forEach(id => {
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }
  });

  // 添加cursor组件到相机，支持射线交互
  if (!camera.querySelector('[cursor]')) {
    const cursor = document.createElement('a-cursor');
    cursor.setAttribute('position', '0 0 -1');
    cursor.setAttribute('geometry', 'primitive: ring; radiusInner: 0.02; radiusOuter: 0.03');
    cursor.setAttribute('material', 'color: #4fc3f7; shader: flat; opacity: 0.8');
    cursor.setAttribute('animation__click', 'property: scale; startEvents: click; to: 0.8 0.8 0.8; dur: 150; dir: alternate; easing: easeInQuad');
    cursor.setAttribute('animation__hover', 'property: scale; startEvents: mouseenter; to: 1.2 1.2 1.2; dur: 200; dir: alternate; easing: easeInQuad');
    camera.appendChild(cursor);
  }

  // 场景1: 心灵摆渡人场景 - 支持射线交互
  const scene1Container = document.createElement('a-entity');
  scene1Container.id = 'scene1-container';
  scene1Container.setAttribute('visible', true);
  
  scene1Container.innerHTML = `
    <!-- 心灵摆渡人模型 - 添加interactive组件 -->
    <a-entity 
      id="ferryman-model" 
      gltf-model="#ferrymanModel" 
      position="1 -0.5 -1.5" 
      rotation="0 -130 0" 
      scale="1 1 1"
      interactive
      hover-scale="scale: 1.1; duration: 300"
      class="clickable">
      
      <!-- 点击提示文字 -->
      <a-text 
        id="click-hint"
        value="点击我开始心灵之旅"
        position="0 2 0"
        align="center"
        color="#ffffff"
        font="kframe"
        width="6"
        animation="property: position; to: 0 2.3 0; loop: true; dur: 2000; dir: alternate; easing: easeInOutSine">
      </a-text>
      
      <!-- 交互光效 -->
      <a-light type="point" position="0.5 0.5 0.8" color="#ffffff" intensity="3" distance="4"></a-light>
      <a-light type="point" position="-0.3 0.3 -0.8" color="#87ceeb" intensity="2" distance="3"></a-light>
      <a-light type="point" position="-0.8 0.2 0.2" color="#ffd700" intensity="1.5" distance="3"></a-light>
      <a-light type="point" position="0 -0.8 0.3" color="#ffffff" intensity="1.2" distance="2"></a-light>
      <a-light type="point" position="0 0.8 0" color="#44a6ff" intensity="0.8" distance="2"></a-light>
    </a-entity>
    
    <!-- 环境聚光灯 -->
    <a-light type="spot" position="0 0 -0.1" rotation="-5 0 0" color="#ffa726" intensity="0.8" angle="45" penumbra="0.3"></a-light>
    
    <!-- 欢迎文字 -->
    <a-text 
      position="0 2.5 -2" 
      align="center" 
      color="#fff" 
      value="⛵ 心灵摆渡人\\n\\n欢迎踏上心灵治愈的旅程" 
      width="8" 
      font="kframe" 
      animation="property: position; to: 0 2.8 -2; loop: true; dur: 5000; dir: alternate">
    </a-text>
    
    <!-- 漂浮的光球装饰 -->
    <a-sphere position="-2 1.5 -3" radius="0.1" color="#87ceeb" opacity="0.7" animation="property: position; to: -2 2 -3; loop: true; dur: 3000; dir: alternate"></a-sphere>
    <a-sphere position="2 1.8 -2.5" radius="0.08" color="#ffd700" opacity="0.6" animation="property: position; to: 2.5 1.3 -2.5; loop: true; dur: 4000; dir: alternate"></a-sphere>
    <a-sphere position="0 3 -4" radius="0.12" color="#ff7793" opacity="0.5" animation="property: position; to: 0.5 3.2 -4; loop: true; dur: 3500; dir: alternate"></a-sphere>
  `;
  
  camera.appendChild(scene1Container);
  console.log('✅ 场景1 (心灵摆渡人) VR容器已创建');

  // 场景2: 疼痛可视化VR展示
  const scene2Container = document.createElement('a-entity');
  scene2Container.id = 'scene2-container';
  scene2Container.setAttribute('visible', false);
  
  scene2Container.innerHTML = `
    <!-- 治愈之港标题 -->
    <a-text position="0 2 -3" align="center" color="#4a90e2" value="🏥 治愈之港\\n\\n在这里卸下身体的重负\\n让心灵得到安慰" width="8" font="kframe" animation="property: position; to: 0 2.3 -3; loop: true; dur: 6000; dir: alternate"></a-text>
    
    <!-- 治愈柱子 -->
    <a-cylinder position="-2 0.5 -4" radius="0.2" height="1" color="#87ceeb" opacity="0.7" animation="property: rotation; to: 0 360 0; loop: true; dur: 20000"></a-cylinder>
    <a-cylinder position="2 0.5 -4" radius="0.2" height="1" color="#87ceeb" opacity="0.7" animation="property: rotation; to: 0 -360 0; loop: true; dur: 25000"></a-cylinder>
    
    <!-- 治愈光效 -->
    <a-light type="point" position="0 3 -3" color="#ffffff" intensity="1.8" distance="8"></a-light>
    <a-light type="point" position="-3 2 -4" color="#87ceeb" intensity="1.2" distance="6" animation="property: intensity; to: 0.8; loop: true; dur: 4000; dir: alternate"></a-light>
    <a-light type="point" position="3 2 -4" color="#b8e6b8" intensity="1.2" distance="6" animation="property: intensity; to: 0.8; loop: true; dur: 3000; dir: alternate"></a-light>
    
    <!-- 漂浮的治愈符号 -->
    <a-text position="-1.5 1.5 -3.5" align="center" color="#87ceeb" value="❤️" width="6" animation="property: rotation; to: 0 360 0; loop: true; dur: 10000"></a-text>
    <a-text position="1.5 1.2 -3.8" align="center" color="#b8e6b8" value="🌟" width="6" animation="property: rotation; to: 0 -360 0; loop: true; dur: 12000"></a-text>
  `;
  
  camera.appendChild(scene2Container);
  console.log('✅ 场景2 (治愈之港) VR容器已创建');

  // 场景4: 认知灯塔VR场景
  const scene4Container = document.createElement('a-entity');
  scene4Container.id = 'scene4-container';
  scene4Container.setAttribute('visible', false);
  
  scene4Container.innerHTML = `
    <!-- 认知灯塔标题 -->
    <a-text position="0 2.5 -3" align="center" color="#fff" value="🗼 认知灯塔\\n\\n照亮思维的迷雾\\n重构内心的认知" width="8" font="kframe" animation="property: position; to: 0 2.8 -3; loop: true; dur: 5500; dir: alternate"></a-text>
    
    <!-- 灯塔主体 -->
    <a-cylinder position="0 1 -5" radius="0.3" height="3" color="#ff7b7b" opacity="0.8" animation="property: rotation; to: 0 360 0; loop: true; dur: 30000"></a-cylinder>
    
    <!-- 灯塔顶部光源 -->
    <a-sphere position="0 2.8 -5" radius="0.4" color="#fff" opacity="0.9" animation="property: intensity; to: 0.5; loop: true; dur: 2000; dir: alternate"></a-sphere>
    
    <!-- 认知光线效果 -->
    <a-light type="point" position="0 3 -5" color="#ff7b7b" intensity="2" distance="10" animation="property: intensity; to: 3; loop: true; dur: 3000; dir: alternate"></a-light>
    <a-light type="point" position="-2 2 -4" color="#667eea" intensity="1.5" distance="6"></a-light>
    <a-light type="point" position="2 2 -4" color="#764ba2" intensity="1.5" distance="6"></a-light>
    
    <!-- 思维碎片效果 -->
    <a-box position="-1.5 2.2 -4" width="0.2" height="0.2" depth="0.2" color="#667eea" opacity="0.6" animation="property: rotation; to: 360 360 360; loop: true; dur: 8000"></a-box>
    <a-box position="1.2 1.8 -4.5" width="0.15" height="0.15" depth="0.15" color="#764ba2" opacity="0.7" animation="property: rotation; to: -360 360 -360; loop: true; dur: 6000"></a-box>
    <a-box position="0.8 2.5 -3.8" width="0.18" height="0.18" depth="0.18" color="#ff7b7b" opacity="0.5" animation="property: rotation; to: 360 -360 360; loop: true; dur: 7000"></a-box>
    
    <!-- 认知重构符号 -->
    <a-text position="-2.5 1.5 -4" align="center" color="#667eea" value="🧠" width="8" animation="property: position; to: -2.2 1.8 -4; loop: true; dur: 4000; dir: alternate"></a-text>
    <a-text position="2.5 1.8 -4.2" align="center" color="#764ba2" value="💡" width="8" animation="property: position; to: 2.2 1.5 -4.2; loop: true; dur: 5000; dir: alternate"></a-text>
  `;
  
  camera.appendChild(scene4Container);
  console.log('✅ 场景4 (认知灯塔) VR容器已创建');

  // 场景5: 自我圣殿VR场景
  const scene5Container = document.createElement('a-entity');
  scene5Container.id = 'scene5-container';
  scene5Container.setAttribute('visible', false);
  
  scene5Container.innerHTML = `
    <!-- 自我圣殿标题 -->
    <a-text position="0 2.5 -3" align="center" color="#fff" value="🏛️ 自我圣殿\\n\\n发现内在的力量\\n构建生命的基石" width="8" font="kframe" animation="property: position; to: 0 2.8 -3; loop: true; dur: 6500; dir: alternate"></a-text>
    
    <!-- 圣殿柱子 -->
    <a-cylinder position="-2 1.5 -5" radius="0.2" height="3" color="#a8e6cf" opacity="0.8"></a-cylinder>
    <a-cylinder position="2 1.5 -5" radius="0.2" height="3" color="#a8e6cf" opacity="0.8"></a-cylinder>
    <a-cylinder position="0 1.5 -6" radius="0.2" height="3" color="#a8e6cf" opacity="0.8"></a-cylinder>
    
    <!-- 圣殿装饰顶部 -->
    <a-box position="-2 3.2 -5" width="0.6" height="0.2" depth="0.6" color="#a8e6cf" opacity="0.9"></a-box>
    <a-box position="2 3.2 -5" width="0.6" height="0.2" depth="0.6" color="#a8e6cf" opacity="0.9"></a-box>
    <a-box position="0 3.2 -6" width="0.6" height="0.2" depth="0.6" color="#a8e6cf" opacity="0.9"></a-box>
    
    <!-- 圣殿光效 -->
    <a-light type="point" position="0 3 -5" color="#a8e6cf" intensity="2.5" distance="8"></a-light>
    <a-light type="point" position="-2 2 -5" color="#667eea" intensity="1.8" distance="6" animation="property: intensity; to: 1.2; loop: true; dur: 4500; dir: alternate"></a-light>
    <a-light type="point" position="2 2 -5" color="#764ba2" intensity="1.8" distance="6" animation="property: intensity; to: 1.2; loop: true; dur: 3500; dir: alternate"></a-light>
    
    <!-- 力量符号 -->
    <a-text position="-2.5 2 -4.5" align="center" color="#a8e6cf" value="💎" width="8" animation="property: position; to: -2.2 2.3 -4.5; loop: true; dur: 4000; dir: alternate"></a-text>
    <a-text position="2.5 2.2 -4.8" align="center" color="#667eea" value="🌟" width="8" animation="property: position; to: 2.2 1.9 -4.8; loop: true; dur: 5000; dir: alternate"></a-text>
    <a-text position="0 3.5 -5.5" align="center" color="#764ba2" value="🏛️" width="8" animation="property: rotation; to: 0 360 0; loop: true; dur: 20000"></a-text>
    
    <!-- 漂浮的力量宝石 -->
    <a-octahedron position="-1 1.2 -3.5" radius="0.1" color="#a8e6cf" opacity="0.8" animation="property: rotation; to: 360 360 0; loop: true; dur: 8000"></a-octahedron>
    <a-octahedron position="1.2 1.8 -3.8" radius="0.08" color="#667eea" opacity="0.7" animation="property: rotation; to: 0 360 360; loop: true; dur: 10000"></a-octahedron>
    <a-octahedron position="0.5 2.5 -4.2" radius="0.12" color="#764ba2" opacity="0.6" animation="property: rotation; to: 360 0 360; loop: true; dur: 7000"></a-octahedron>
  `;
  
  camera.appendChild(scene5Container);
  console.log('✅ 场景5 (自我圣殿) VR容器已创建');

  // 场景6: 希望彼岸场景
  const scene6Container = document.createElement('a-entity');
  scene6Container.id = 'scene6-container';
  scene6Container.setAttribute('visible', false);
  
  scene6Container.innerHTML = `
    <!-- 希望彼岸的心灵摆渡人 -->
    <a-entity gltf-model="#ferrymanModel" position="1 -0.5 -1.5" rotation="0 -130 0" scale="1 1 1">
      <!-- 希望之光 -->
      <a-light type="point" position="0.5 0.5 0.8" color="#ffa726" intensity="2.5" distance="4"></a-light>
      <a-light type="point" position="-0.3 0.3 -0.8" color="#ff7793" intensity="1.8" distance="3"></a-light>
      <a-light type="point" position="-0.8 0.2 0.2" color="#4ecdc4" intensity="1.2" distance="3"></a-light>
      <a-light type="point" position="0 -0.8 0.3" color="#ffe65d" intensity="1" distance="2"></a-light>
      <a-light type="point" position="0 0.8 0" color="#44a6ff" intensity="0.8" distance="2"></a-light>
    </a-entity>
    
    <!-- 希望彼岸标题 -->
    <a-text position="0 2.5 -2" align="center" color="#fff" value="🌸 希望彼岸\\n\\n经历了旅途的洗礼\\n心灵在此得到重生" width="8" font="kframe" animation="property: position; to: 0 2.8 -2; loop: true; dur: 5000; dir: alternate"></a-text>
    
    <!-- 重生之花 -->
    <a-text position="-2 1.5 -3" align="center" color="#ff7793" value="🌸" width="8" animation="property: rotation; to: 0 360 0; loop: true; dur: 15000"></a-text>
    <a-text position="2 1.8 -2.8" align="center" color="#ffa726" value="🌺" width="8" animation="property: rotation; to: 0 -360 0; loop: true; dur: 18000"></a-text>
    <a-text position="0 1.2 -3.5" align="center" color="#4ecdc4" value="🌼" width="8" animation="property: rotation; to: 0 360 0; loop: true; dur: 12000"></a-text>
    
    <!-- 希望之光粒子效果 -->
    <a-sphere position="-1.8 2.2 -3.2" radius="0.05" color="#ffe65d" opacity="0.8" animation="property: position; to: -1.5 2.8 -3.2; loop: true; dur: 3000; dir: alternate"></a-sphere>
    <a-sphere position="1.5 2.5 -2.9" radius="0.06" color="#ff7793" opacity="0.7" animation="property: position; to: 1.8 2 -2.9; loop: true; dur: 3500; dir: alternate"></a-sphere>
    <a-sphere position="0.3 3 -3.8" radius="0.04" color="#4ecdc4" opacity="0.9" animation="property: position; to: 0.6 2.5 -3.8; loop: true; dur: 2800; dir: alternate"></a-sphere>
    <a-sphere position="-0.8 1.8 -2.5" radius="0.07" color="#ffa726" opacity="0.6" animation="property: position; to: -0.5 2.3 -2.5; loop: true; dur: 4000; dir: alternate"></a-sphere>
    
    <!-- 彩虹桥装饰 -->
    <a-curved-image src="#skyTexture1" position="0 1 -4" rotation="0 0 0" radius="3" theta-length="90" opacity="0.3" animation="property: rotation; to: 0 0 5; loop: true; dur: 8000; dir: alternate"></a-curved-image>
  `;
  
  camera.appendChild(scene6Container);
  console.log('✅ 场景6 (希望彼岸) VR容器已创建');

  console.log('🎬 所有VR场景容器创建完成');
  
  // 等待A-Frame组件加载完成后注册交互系统
  setTimeout(() => {
    registerVRInteractionComponents();
    initializeVRInteractionSystem();
  }, 1000);
  
  // 触发场景初始化完成事件
  window.dispatchEvent(new CustomEvent('vrScenesReady'));
}

// 注册VR交互组件
function registerVRInteractionComponents() {
  if (typeof AFRAME === 'undefined') {
    console.warn('A-Frame未加载，跳过组件注册');
    return;
  }

  // 注册可交互组件
  if (!AFRAME.components.interactive) {
    AFRAME.registerComponent('interactive', {
      schema: {
        enabled: { type: 'boolean', default: true }
      },

      init: function () {
        this.isHovered = false;
        this.element = this.el;
        
        // 监听自定义射线交互事件
        this.element.addEventListener('raycaster-intersected', () => {
          if (!this.isHovered) {
            this.isHovered = true;
            this.element.emit('mouseenter');
          }
        });

        this.element.addEventListener('raycaster-intersected-cleared', () => {
          if (this.isHovered) {
            this.isHovered = false;
            this.element.emit('mouseleave');
          }
        });

        this.element.addEventListener('raycaster-clicked', () => {
          this.element.emit('click');
        });
      },

      remove: function () {
        // 清理事件监听器
      }
    });
  }

  // 注册hover缩放效果组件
  if (!AFRAME.components['hover-scale']) {
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
  }

  console.log('VR交互组件已注册');
}

// 初始化VR交互系统
function initializeVRInteractionSystem() {
  // 导入并初始化VR交互系统
  import('../vr/VRInteractionSystem.js').then(({ VRInteractionSystem }) => {
    if (!window.vrInteractionSystem) {
      window.vrInteractionSystem = new VRInteractionSystem();
      console.log('VR交互系统已初始化');
    }
  }).catch(error => {
    console.error('VR交互系统加载失败:', error);
  });
}