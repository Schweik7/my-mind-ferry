// src/scenes/PainVisualizationScene.js - 重构版本，使用SceneBuilder
import { sceneBuilder } from './SceneBuilder.js';

export function createPainVisualizationScene() {
  // 创建主要内容
  const mainContent = `
    <div class="scene-main">
      <div class="scene-content">
        ${createBodyVisualizationSection()}
      </div>
      
      <div class="scene-controls">
        ${createInstructionsSection()}
        ${createPainLevelSection()}
        ${createHistorySection()}
      </div>
    </div>
  `;

  // 使用SceneBuilder构建完整场景
  return sceneBuilder.createSceneContainer(
    '🏥 治愈之港', 
    '在这里记录身体的不适，让心灵摆渡人为您带来安慰',
    createOceanEffects() + mainContent
  );
}

// 创建海洋特效
function createOceanEffects() {
  return `
    <!-- 海洋气泡背景 -->
    <div class="ocean-bubbles">
      ${Array.from({length: 7}, (_, i) => '<div class="bubble"></div>').join('')}
    </div>

    <!-- 海洋波浪效果 -->
    <div class="ocean-waves">
      <div class="wave"></div>
      <div class="wave"></div>
    </div>
  `;
}

// 创建身体可视化区域
function createBodyVisualizationSection() {
  return `
    <div class="body-ocean-container">
      <h3 style="margin-bottom: 20px; color: white;">轻点身体部位，记录不适之处</h3>
      
      ${createViewSelector()}
      ${createBodyOutline()}
      ${createLegend()}
    </div>
  `;
}

// 创建视图选择器
function createViewSelector() {
  return `
    <div class="view-selector">
      <button class="view-btn active" onclick="PainTool.switchView('front')">正面视图</button>
      <button class="view-btn" onclick="PainTool.switchView('back')">背面视图</button>
    </div>
  `;
}

// 创建身体轮廓SVG
function createBodyOutline() {
  return `
    <div class="body-outline" id="bodyOutline">
      <svg class="body-svg" id="bodySvg" viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg">
        ${createFrontBodyView()}
        ${createBackBodyView()}
      </svg>
    </div>
  `;
}

// 创建正面身体视图
function createFrontBodyView() {
  return `
    <!-- 正面人体模型 -->
    <g id="frontView">
      <!-- 头部 -->
      <ellipse cx="150" cy="60" rx="35" ry="45" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />
      <!-- 眼睛 -->
      <circle cx="140" cy="55" r="3" fill="#333" />
      <circle cx="160" cy="55" r="3" fill="#333" />
      <!-- 鼻子 -->
      <path d="M150,60 L148,68 L152,68 Z" fill="#d7ccc8" />
      <!-- 嘴巴 -->
      <path d="M145,72 Q150,75 155,72" stroke="#8d6e63" stroke-width="2" fill="none" />

      <!-- 颈部 -->
      <rect x="140" y="105" width="20" height="25" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />

      <!-- 躯干 -->
      <ellipse cx="150" cy="200" rx="60" ry="90" fill="#e1f5fe" stroke="#1976d2" stroke-width="2" />

      <!-- 胸部细节 -->
      <circle cx="135" cy="170" r="15" fill="none" stroke="#1976d2" stroke-width="1" opacity="0.5" />
      <circle cx="165" cy="170" r="15" fill="none" stroke="#1976d2" stroke-width="1" opacity="0.5" />

      <!-- 腹部分割线 -->
      <line x1="150" y1="150" x2="150" y2="250" stroke="#1976d2" stroke-width="1" opacity="0.5" />
      <line x1="120" y1="190" x2="180" y2="190" stroke="#1976d2" stroke-width="1" opacity="0.3" />
      <line x1="125" y1="210" x2="175" y2="210" stroke="#1976d2" stroke-width="1" opacity="0.3" />
      <line x1="130" y1="230" x2="170" y2="230" stroke="#1976d2" stroke-width="1" opacity="0.3" />

      ${createArmSVG('left', 80)}
      ${createArmSVG('right', 220)}
      ${createPelvisSVG()}
      ${createLegSVG('left', 125)}
      ${createLegSVG('right', 175)}
      ${createJointsSVG()}
    </g>
  `;
}

// 创建背面身体视图
function createBackBodyView() {
  return `
    <!-- 背面人体模型 -->
    <g id="backView" style="display: none;">
      <!-- 头部后脑 -->
      <ellipse cx="150" cy="60" rx="35" ry="45" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />
      <!-- 发际线 -->
      <path d="M120,30 Q150,20 180,30" stroke="#5d4037" stroke-width="3" fill="none" />

      <!-- 颈部 -->
      <rect x="140" y="105" width="20" height="25" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />
      <!-- 颈椎 -->
      <line x1="150" y1="105" x2="150" y2="130" stroke="#8d6e63" stroke-width="2" />

      <!-- 躯干背部 -->
      <ellipse cx="150" cy="200" rx="60" ry="90" fill="#e1f5fe" stroke="#1976d2" stroke-width="2" />

      ${createSpineSVG()}
      ${createShoulderBladesSVG()}
      ${createArmSVG('left', 80)}
      ${createArmSVG('right', 220)}
      ${createButtocksSVG()}
      ${createBackLegSVG('left', 125)}
      ${createBackLegSVG('right', 175)}
      ${createJointsSVG()}
    </g>
  `;
}

// 创建手臂SVG
function createArmSVG(side, x) {
  return `
    <!-- ${side}臂 -->
    <ellipse cx="${x}" cy="170" rx="15" ry="40" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
    <circle cx="${x}" cy="220" r="10" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
    <ellipse cx="${x}" cy="270" rx="12" ry="35" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
    <ellipse cx="${x}" cy="315" rx="8" ry="15" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />
  `;
}

// 创建脊椎SVG
function createSpineSVG() {
  const spine = ['<line x1="150" y1="130" x2="150" y2="290" stroke="#8d6e63" stroke-width="3" />'];
  for (let i = 0; i < 9; i++) {
    const y = 140 + i * 20;
    spine.push(`<circle cx="150" cy="${y}" r="3" fill="#8d6e63" />`);
  }
  return spine.join('');
}

// 创建肩胛骨SVG
function createShoulderBladesSVG() {
  return `
    <!-- 肩胛骨 -->
    <ellipse cx="125" cy="160" rx="20" ry="35" fill="none" stroke="#1976d2" stroke-width="2" transform="rotate(-15 125 160)" />
    <ellipse cx="175" cy="160" rx="20" ry="35" fill="none" stroke="#1976d2" stroke-width="2" transform="rotate(15 175 160)" />
  `;
}

// 创建骨盆SVG
function createPelvisSVG() {
  return `
    <!-- 骨盆 -->
    <ellipse cx="150" cy="310" rx="45" ry="25" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" />
  `;
}

// 创建臀部SVG
function createButtocksSVG() {
  return `
    <!-- 臀部 -->
    <ellipse cx="150" cy="310" rx="45" ry="25" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" />
    <line x1="130" y1="310" x2="170" y2="310" stroke="#4caf50" stroke-width="1" />
  `;
}

// 创建腿部SVG
function createLegSVG(side, x) {
  return `
    <!-- ${side}腿 -->
    <ellipse cx="${x}" cy="380" rx="18" ry="50" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
    <circle cx="${x}" cy="440" r="12" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
    <ellipse cx="${x}" cy="500" rx="15" ry="45" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
    <ellipse cx="${x}" cy="560" rx="12" ry="20" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />
  `;
}

// 创建背面腿部SVG
function createBackLegSVG(side, x) {
  return `
    <!-- ${side}腿背面 -->
    <ellipse cx="${x}" cy="380" rx="18" ry="50" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
    <circle cx="${x}" cy="440" r="12" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
    <path d="M${x-5},435 Q${x},440 ${x+5},435" stroke="#9c27b0" stroke-width="1" fill="none" />
    <ellipse cx="${x}" cy="500" rx="15" ry="45" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
    <ellipse cx="${x}" cy="485" rx="10" ry="25" fill="none" stroke="#9c27b0" stroke-width="1" />
    <ellipse cx="${x}" cy="560" rx="12" ry="20" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />
  `;
}

// 创建关节标记SVG
function createJointsSVG() {
  return `
    <!-- 关节标记 -->
    <circle cx="110" cy="140" r="8" fill="none" stroke="#ff5722" stroke-width="2" />
    <circle cx="190" cy="140" r="8" fill="none" stroke="#ff5722" stroke-width="2" />
    <circle cx="80" cy="305" r="6" fill="none" stroke="#ff5722" stroke-width="1" />
    <circle cx="220" cy="305" r="6" fill="none" stroke="#ff5722" stroke-width="1" />
    <circle cx="125" cy="330" r="8" fill="none" stroke="#ff5722" stroke-width="2" />
    <circle cx="175" cy="330" r="8" fill="none" stroke="#ff5722" stroke-width="2" />
    <circle cx="125" cy="545" r="6" fill="none" stroke="#ff5722" stroke-width="1" />
    <circle cx="175" cy="545" r="6" fill="none" stroke="#ff5722" stroke-width="1" />
  `;
}

// 创建图例
function createLegend() {
  const legendItems = [
    { level: 1, label: '轻微' },
    { level: 2, label: '轻度' },
    { level: 3, label: '中度' },
    { level: 4, label: '重度' },
    { level: 5, label: '剧烈' }
  ];

  const legendHTML = legendItems.map(item => 
    `<div class="legend-item pain-level-${item.level}">${item.level} ${item.label}</div>`
  ).join('');

  return `<div class="legend">${legendHTML}</div>`;
}

// 创建说明区域
function createInstructionsSection() {
  return sceneBuilder.createControlSection('🧭 航行指南', `
    <div class="instructions">
      <p>1. 选择身体视图（正面/背面）</p>
      <p>2. 选择不适程度（1-5级）</p>
      <p>3. 点击身体部位进行记录</p>
      <p>4. 让心灵摆渡人为您分担痛苦</p>
      <p><strong>快捷键：</strong>数字键1-5选择等级</p>
    </div>
  `);
}

// 创建疼痛等级选择区域
function createPainLevelSection() {
  const bubbleItems = Array.from({length: 5}, (_, i) => {
    const level = i + 1;
    const labels = ['轻微', '轻度', '中度', '重度', '剧烈'];
    const activeClass = level === 1 ? 'active' : '';
    
    return `
      <div class="bubble-item ${activeClass}" data-level="${level}">
        <div class="bubble-number">${level}</div>
        <div class="bubble-label">${labels[i]}</div>
      </div>
    `;
  }).join('');

  return sceneBuilder.createControlSection('⚖️ 不适程度', `
    <div class="bubble-scale">${bubbleItems}</div>
  `);
}

// 创建历史记录区域
function createHistorySection() {
  return sceneBuilder.createControlSection('📋 治愈记录', 
    sceneBuilder.createHistoryContainer('painHistory', '暂无治愈记录') +
    sceneBuilder.createButton('清除所有记录', 'PainTool.clearAllPain()')
  );
}