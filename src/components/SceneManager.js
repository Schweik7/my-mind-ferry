import { createPainVisualizationScene } from '../scenes/PainVisualizationScene.js';
import { createEmotionRecognitionScene } from '../scenes/EmotionRecognitionScene.js';
import { createCognitiveLighthouseScene } from '../scenes/CognitiveLighthouseScene.js';
import { createSelfSanctuaryScene } from '../scenes/SelfSanctuaryScene.js';
import { createVRScenes } from '../scenes/VRScenes.js';
import { Navigation } from './Navigation.js';

// 主场景管理器
export class SceneManager {
  static currentScene = 1;
  static containers = ['scene1-container', 'scene2-container', null, 'scene4-container', 'scene5-container', 'scene6-container'];
  static skyTextures = ['#skyTexture1', '#skyTexture2', null, '#skyTexture4', '#skyTexture5', '#skyTexture6'];
  static vrScenesInitialized = false;

  static switchTo(sceneNumber) {
    if (sceneNumber === this.currentScene) return;

    console.log(`切换到场景 ${sceneNumber}`);

    // 清理当前场景
    this.cleanup();

    // 更新UI状态
    Navigation.updateActive(sceneNumber);

    // 隐藏所有面板
    document.querySelectorAll('.scene-panel').forEach(panel => {
      panel.style.display = 'none';
    });

    // 初始化VR场景（仅一次）
    if (!this.vrScenesInitialized) {
      createVRScenes();
      this.vrScenesInitialized = true;
    }

    // 隐藏所有VR场景容器
    this.containers.forEach((id, index) => {
      if (id) {
        const element = document.getElementById(id);
        if (element) {
          element.setAttribute('visible', false);
        }
      }
    });

    // 激活目标场景
    switch (sceneNumber) {
      case 1:
        this.initScene1();
        break;
      case 2:
        this.initScene2();
        break;
      case 3:
        this.initScene3();
        break;
      case 4:
        this.initScene4();
        break;
      case 5:
        this.initScene5();
        break;
      case 6:
        this.initScene6();
        break;
    }

    this.currentScene = sceneNumber;
    Navigation.hide();
  }

  static cleanup() {
    const { EmotionRecognition, PainTool, CognitiveTool, SelfSanctuary } = window;
    if (EmotionRecognition) EmotionRecognition.stop();
    if (PainTool) PainTool.cleanup();
    if (CognitiveTool) CognitiveTool.cleanup();
    if (SelfSanctuary) SelfSanctuary.cleanup();
  }

  static initScene1() {
    console.log('初始化心灵摆渡人场景');
    const scene1 = document.getElementById('scene1-container');
    if (scene1) {
      scene1.setAttribute('visible', true);
    }
    const sky = document.getElementById('scene-sky');
    if (sky) {
      sky.setAttribute('src', '#skyTexture1');
    }
  }

  static initScene2() {
    console.log('初始化疼痛可视化场景');
    const panel = document.getElementById('pain-visualization-panel');
    if (!panel.innerHTML.trim()) {
      panel.innerHTML = createPainVisualizationScene();
    }
    panel.style.display = 'block';
    
    const scene2 = document.getElementById('scene2-container');
    if (scene2) {
      scene2.setAttribute('visible', true);
    }
    const sky = document.getElementById('scene-sky');
    if (sky) {
      sky.setAttribute('src', '#skyTexture2');
    }
    
    const { PainTool } = window;
    if (PainTool) {
      PainTool.init();
    }
  }

  static initScene3() {
    console.log('初始化表情识别Web场景');
    const panel = document.getElementById('emotion-recognition-panel');
    if (!panel.innerHTML.trim()) {
      panel.innerHTML = createEmotionRecognitionScene();
    }
    panel.style.display = 'block';
    
    const { EmotionRecognition } = window;
    if (EmotionRecognition) {
      EmotionRecognition.init();
    }
  }

  static initScene4() {
    console.log('初始化认知灯塔场景');
    const panel = document.getElementById('cognitive-lighthouse-panel');
    if (!panel.innerHTML.trim()) {
      panel.innerHTML = createCognitiveLighthouseScene();
    }
    panel.style.display = 'block';
    
    const scene4 = document.getElementById('scene4-container');
    if (scene4) {
      scene4.setAttribute('visible', true);
    }
    const sky = document.getElementById('scene-sky');
    if (sky) {
      sky.setAttribute('src', '#skyTexture4');
    }
    
    const { CognitiveTool } = window;
    if (CognitiveTool) {
      CognitiveTool.init();
    }
  }

  static initScene5() {
    console.log('初始化自我圣殿场景');
    const panel = document.getElementById('self-sanctuary-panel');
    if (!panel.innerHTML.trim()) {
      panel.innerHTML = createSelfSanctuaryScene();
    }
    panel.style.display = 'block';
    
    const scene5 = document.getElementById('scene5-container');
    if (scene5) {
      scene5.setAttribute('visible', true);
    }
    const sky = document.getElementById('scene-sky');
    if (sky) {
      sky.setAttribute('src', '#skyTexture5');
    }
    
    const { SelfSanctuary } = window;
    if (SelfSanctuary) {
      SelfSanctuary.init();
    }
  }

  static initScene6() {
    console.log('初始化希望彼岸场景');
    const scene6 = document.getElementById('scene6-container');
    if (scene6) {
      scene6.setAttribute('visible', true);
    }
    const sky = document.getElementById('scene-sky');
    if (sky) {
      sky.setAttribute('src', '#skyTexture6');
    }
  }
}