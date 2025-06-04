export function createVRScenes() {
  const camera = document.getElementById('main-camera');
  
  // 场景1: 心灵摆渡人场景
  const scene1Container = document.createElement('a-entity');
  scene1Container.id = 'scene1-container';
  scene1Container.setAttribute('visible', true);
  
  scene1Container.innerHTML = `
    <a-entity id="ferryman-model" gltf-model="#ferrymanModel" position="1 -0.5 -1.5" rotation="0 -130 0" scale="1 1 1">
      <!-- 直接给模型打光 - 这些光源会跟随模型 -->
      <!-- 主光源 - 从正面照亮 -->
      <a-light type="point" position="0.5 0.5 0.8" color="#ffffff" intensity="3" distance="4"></a-light>
      
      <!-- 轮廓光 - 从背后照亮边缘 -->
      <a-light type="point" position="-0.3 0.3 -0.8" color="#87ceeb" intensity="2" distance="3"></a-light>
      
      <!-- 侧面补光 - 增加立体感 -->
      <a-light type="point" position="-0.8 0.2 0.2" color="#ffd700" intensity="1.5" distance="3"></a-light>
      
      <!-- 底部补光 - 避免阴影过重 -->
      <a-light type="point" position="0 -0.8 0.3" color="#ffffff" intensity="1.2" distance="2"></a-light>
      
      <!-- 顶部补光 - 增加头部亮度 -->
      <a-light type="point" position="0 0.8 0" color="#ffffff" intensity="1" distance="2"></a-light>
      <a-light type="point" position="0 0.8 0" color="#44a6ff" intensity="0.8" distance="2"></a-light>
    </a-entity>
    <a-light type="spot" position="0 0 -0.1" rotation="-5 0 0" color="#ffa726" intensity="0.8" angle="45" penumbra="0.3"></a-light>
    
    <a-text position="0 2.5 -2" align="center" color="#fff" value="🌸 希望彼岸\n\n经历了旅途的洗礼\n心灵在此得到重生" width="8" font="kframe" animation="property: position; to: 0 2.8 -2; loop: true; dur: 5000; dir: alternate"></a-text>
  `;
  
  camera.appendChild(scene1Container);

  // 场景2: 疼痛可视化VR展示
  const scene2Container = document.createElement('a-entity');
  scene2Container.id = 'scene2-container';
  scene2Container.setAttribute('visible', false);
  
  scene2Container.innerHTML = `
    <a-text position="0 2 -3" align="center" color="#4a90e2" value="🏥 治愈之港\n\n在这里卸下身体的重负\n让心灵得到安慰" width="8" font="kframe" animation="property: position; to: 0 2.3 -3; loop: true; dur: 6000; dir: alternate"></a-text>
    
    <a-cylinder position="-2 0.5 -4" radius="0.2" height="1" color="#87ceeb" opacity="0.7" animation="property: rotation; to: 0 360 0; loop: true; dur: 20000"></a-cylinder>
    <a-cylinder position="2 0.5 -4" radius="0.2" height="1" color="#87ceeb" opacity="0.7" animation="property: rotation; to: 0 -360 0; loop: true; dur: 25000"></a-cylinder>
    
    <a-light type="point" position="0 3 -3" color="#ffffff" intensity="1.8" distance="8"></a-light>
    <a-light type="point" position="-3 2 -4" color="#87ceeb" intensity="1.2" distance="6" animation="property: intensity; to: 0.8; loop: true; dur: 4000; dir: alternate"></a-light>
    <a-light type="point" position="3 2 -4" color="#b8e6b8" intensity="1.2" distance="6" animation="property: intensity; to: 0.8; loop: true; dur: 3000; dir: alternate"></a-light>
  `;
  
  camera.appendChild(scene2Container);

  // 场景4: 认知灯塔VR场景
  const scene4Container = document.createElement('a-entity');
  scene4Container.id = 'scene4-container';
  scene4Container.setAttribute('visible', false);
  
  scene4Container.innerHTML = `
    <a-text position="0 2.5 -3" align="center" color="#fff" value="🗼 认知灯塔\n\n照亮思维的迷雾\n重构内心的认知" width="8" font="kframe" animation="property: position; to: 0 2.8 -3; loop: true; dur: 5500; dir: alternate"></a-text>
    
    <!-- 灯塔造型装饰 -->
    <a-cylinder position="0 1 -5" radius="0.3" height="3" color="#ff7b7b" opacity="0.8" animation="property: rotation; to: 0 360 0; loop: true; dur: 30000"></a-cylinder>
    <a-sphere position="0 2.8 -5" radius="0.4" color="#fff" opacity="0.9" animation="property: intensity; to: 0.5; loop: true; dur: 2000; dir: alternate"></a-sphere>
    
    <!-- 认知光线效果 -->
    <a-light type="point" position="0 3 -5" color="#ff7b7b" intensity="2" distance="10" animation="property: intensity; to: 3; loop: true; dur: 3000; dir: alternate"></a-light>
    <a-light type="point" position="-2 2 -4" color="#667eea" intensity="1.5" distance="6"></a-light>
    <a-light type="point" position="2 2 -4" color="#764ba2" intensity="1.5" distance="6"></a-light>
  `;
  
  camera.appendChild(scene4Container);

  // 场景5: 自我圣殿VR场景
  const scene5Container = document.createElement('a-entity');
  scene5Container.id = 'scene5-container';
  scene5Container.setAttribute('visible', false);
  
  scene5Container.innerHTML = `
    <a-text position="0 2.5 -3" align="center" color="#fff" value="🏛️ 自我圣殿\n\n发现内在的力量\n构建生命的基石" width="8" font="kframe" animation="property: position; to: 0 2.8 -3; loop: true; dur: 6500; dir: alternate"></a-text>
    
    <!-- 圣殿柱子装饰 -->
    <a-cylinder position="-2 1.5 -5" radius="0.2" height="3" color="#a8e6cf" opacity="0.8"></a-cylinder>
    <a-cylinder position="2 1.5 -5" radius="0.2" height="3" color="#a8e6cf" opacity="0.8"></a-cylinder>
    <a-cylinder position="0 1.5 -6" radius="0.2" height="3" color="#a8e6cf" opacity="0.8"></a-cylinder>
    
    <!-- 圣殿光效 -->
    <a-light type="point" position="0 3 -5" color="#a8e6cf" intensity="2.5" distance="8"></a-light>
    <a-light type="point" position="-2 2 -5" color="#667eea" intensity="1.8" distance="6" animation="property: intensity; to: 1.2; loop: true; dur: 4500; dir: alternate"></a-light>
    <a-light type="point" position="2 2 -5" color="#764ba2" intensity="1.8" distance="6" animation="property: intensity; to: 1.2; loop: true; dur: 3500; dir: alternate"></a-light>
  `;
  
  camera.appendChild(scene5Container);

  // 场景6: 希望彼岸场景
  const scene6Container = document.createElement('a-entity');
  scene6Container.id = 'scene6-container';
  scene6Container.setAttribute('visible', false);
  
  scene6Container.innerHTML = `
    <a-entity gltf-model="#ferrymanModel" position="1 -0.5 -1.5" rotation="0 -130 0" scale="1 1 1">
      <a-light type="point" position="0.5 0.5 0.8" color="#ffa726" intensity="2.5" distance="4"></a-light>
      <a-light type="point" position="-0.3 0.3 -0.8" color="#ff7793" intensity="1.8" distance="3"></a-light>
      <a-light type="point" position="-0.8 0.2 0.2" color="#4ecdc4" intensity="1.2" distance="3"></a-light>
      <a-light type="point" position="0 -0.8 0.3" color="#ffe65d" intensity="1" distance="2"></a-light>
      <a-light type="point" position="0 0.8 0" color="#44a6ff" intensity="0.8" distance="2"></a-light>
    </a-entity>
  `;
  
  camera.appendChild(scene6Container);
}