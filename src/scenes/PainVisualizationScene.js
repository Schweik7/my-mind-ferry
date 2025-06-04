export function createPainVisualizationScene() {
  return `
    <!-- 海洋气泡背景 -->
    <div class="ocean-bubbles">
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
    </div>

    <!-- 海洋波浪效果 -->
    <div class="ocean-waves">
      <div class="wave"></div>
      <div class="wave"></div>
    </div>

    <div class="scene-container">
      <div class="scene-header">
        <h1 class="scene-title">🏥 治愈之港</h1>
        <p class="scene-subtitle">在这里记录身体的不适，让心灵摆渡人为您带来安慰</p>
      </div>

      <div class="scene-main">
        <div class="body-ocean-container">
          <h3 style="margin-bottom: 20px; color: white;">轻点身体部位，记录不适之处</h3>
          <div class="view-selector">
            <button class="view-btn active" onclick="PainTool.switchView('front')">正面视图</button>
            <button class="view-btn" onclick="PainTool.switchView('back')">背面视图</button>
          </div>
          <div class="body-outline" id="bodyOutline">
            <svg class="body-svg" id="bodySvg" viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg">
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

                <!-- 左臂 -->
                <ellipse cx="80" cy="170" rx="15" ry="40" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                <circle cx="80" cy="220" r="10" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                <ellipse cx="80" cy="270" rx="12" ry="35" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                <ellipse cx="80" cy="315" rx="8" ry="15" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />

                <!-- 右臂 -->
                <ellipse cx="220" cy="170" rx="15" ry="40" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                <circle cx="220" cy="220" r="10" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                <ellipse cx="220" cy="270" rx="12" ry="35" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                <ellipse cx="220" cy="315" rx="8" ry="15" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />

                <!-- 骨盆 -->
                <ellipse cx="150" cy="310" rx="45" ry="25" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" />

                <!-- 左腿 -->
                <ellipse cx="125" cy="380" rx="18" ry="50" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
                <circle cx="125" cy="440" r="12" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
                <ellipse cx="125" cy="500" rx="15" ry="45" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
                <ellipse cx="125" cy="560" rx="12" ry="20" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />

                <!-- 右腿 -->
                <ellipse cx="175" cy="380" rx="18" ry="50" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
                <circle cx="175" cy="440" r="12" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
                <ellipse cx="175" cy="500" rx="15" ry="45" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
                <ellipse cx="175" cy="560" rx="12" ry="20" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />

                <!-- 关节标记 -->
                <circle cx="110" cy="140" r="8" fill="none" stroke="#ff5722" stroke-width="2" />
                <circle cx="190" cy="140" r="8" fill="none" stroke="#ff5722" stroke-width="2" />
                <circle cx="80" cy="305" r="6" fill="none" stroke="#ff5722" stroke-width="1" />
                <circle cx="220" cy="305" r="6" fill="none" stroke="#ff5722" stroke-width="1" />
                <circle cx="125" cy="330" r="8" fill="none" stroke="#ff5722" stroke-width="2" />
                <circle cx="175" cy="330" r="8" fill="none" stroke="#ff5722" stroke-width="2" />
                <circle cx="125" cy="545" r="6" fill="none" stroke="#ff5722" stroke-width="1" />
                <circle cx="175" cy="545" r="6" fill="none" stroke="#ff5722" stroke-width="1" />
              </g>

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

                <!-- 脊椎 -->
                <line x1="150" y1="130" x2="150" y2="290" stroke="#8d6e63" stroke-width="3" />
                <!-- 脊椎节段 -->
                <circle cx="150" cy="140" r="3" fill="#8d6e63" />
                <circle cx="150" cy="160" r="3" fill="#8d6e63" />
                <circle cx="150" cy="180" r="3" fill="#8d6e63" />
                <circle cx="150" cy="200" r="3" fill="#8d6e63" />
                <circle cx="150" cy="220" r="3" fill="#8d6e63" />
                <circle cx="150" cy="240" r="3" fill="#8d6e63" />
                <circle cx="150" cy="260" r="3" fill="#8d6e63" />
                <circle cx="150" cy="280" r="3" fill="#8d6e63" />

                <!-- 肩胛骨 -->
                <ellipse cx="125" cy="160" rx="20" ry="35" fill="none" stroke="#1976d2" stroke-width="2" transform="rotate(-15 125 160)" />
                <ellipse cx="175" cy="160" rx="20" ry="35" fill="none" stroke="#1976d2" stroke-width="2" transform="rotate(15 175 160)" />

                <!-- 左臂背面 -->
                <ellipse cx="80" cy="170" rx="15" ry="40" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                <circle cx="80" cy="220" r="10" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                <ellipse cx="80" cy="270" rx="12" ry="35" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                <ellipse cx="80" cy="315" rx="8" ry="15" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />

                <!-- 右臂背面 -->
                <ellipse cx="220" cy="170" rx="15" ry="40" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                <circle cx="220" cy="220" r="10" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                <ellipse cx="220" cy="270" rx="12" ry="35" fill="#fff3e0" stroke="#ff9800" stroke-width="2" />
                <ellipse cx="220" cy="315" rx="8" ry="15" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />

                <!-- 臀部 -->
                <ellipse cx="150" cy="310" rx="45" ry="25" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" />
                <line x1="130" y1="310" x2="170" y2="310" stroke="#4caf50" stroke-width="1" />

                <!-- 左腿背面 -->
                <ellipse cx="125" cy="380" rx="18" ry="50" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
                <circle cx="125" cy="440" r="12" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
                <path d="M120,435 Q125,440 130,435" stroke="#9c27b0" stroke-width="1" fill="none" />
                <ellipse cx="125" cy="500" rx="15" ry="45" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
                <ellipse cx="125" cy="485" rx="10" ry="25" fill="none" stroke="#9c27b0" stroke-width="1" />
                <ellipse cx="125" cy="560" rx="12" ry="20" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />

                <!-- 右腿背面 -->
                <ellipse cx="175" cy="380" rx="18" ry="50" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
                <circle cx="175" cy="440" r="12" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
                <path d="M170,435 Q175,440 180,435" stroke="#9c27b0" stroke-width="1" fill="none" />
                <ellipse cx="175" cy="500" rx="15" ry="45" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" />
                <ellipse cx="175" cy="485" rx="10" ry="25" fill="none" stroke="#9c27b0" stroke-width="1" />
                <ellipse cx="175" cy="560" rx="12" ry="20" fill="#fce4ec" stroke="#8d6e63" stroke-width="2" />

                <!-- 关节标记 -->
                <circle cx="110" cy="140" r="8" fill="none" stroke="#ff5722" stroke-width="2" />
                <circle cx="190" cy="140" r="8" fill="none" stroke="#ff5722" stroke-width="2" />
                <circle cx="80" cy="305" r="6" fill="none" stroke="#ff5722" stroke-width="1" />
                <circle cx="220" cy="305" r="6" fill="none" stroke="#ff5722" stroke-width="1" />
                <circle cx="125" cy="330" r="8" fill="none" stroke="#ff5722" stroke-width="2" />
                <circle cx="175" cy="330" r="8" fill="none" stroke="#ff5722" stroke-width="2" />
                <circle cx="125" cy="545" r="6" fill="none" stroke="#ff5722" stroke-width="1" />
                <circle cx="175" cy="545" r="6" fill="none" stroke="#ff5722" stroke-width="1" />
              </g>
            </svg>
          </div>
          <div class="legend">
            <div class="legend-item pain-level-1">1 轻微</div>
            <div class="legend-item pain-level-2">2 轻度</div>
            <div class="legend-item pain-level-3">3 中度</div>
            <div class="legend-item pain-level-4">4 重度</div>
            <div class="legend-item pain-level-5">5 剧烈</div>
          </div>
        </div>

        <div class="scene-controls">
          <div class="instructions">
            <h4>🧭 航行指南</h4>
            <p>1. 选择身体视图（正面/背面）</p>
            <p>2. 选择不适程度（1-5级）</p>
            <p>3. 点击身体部位进行记录</p>
            <p>4. 让心灵摆渡人为您分担痛苦</p>
            <p><strong>快捷键：</strong>数字键1-5选择等级</p>
          </div>

          <div class="control-section">
            <h3>⚖️ 不适程度</h3>
            <div class="bubble-scale">
              <div class="bubble-item active" data-level="1">
                <div class="bubble-number">1</div>
                <div class="bubble-label">轻微</div>
              </div>
              <div class="bubble-item" data-level="2">
                <div class="bubble-number">2</div>
                <div class="bubble-label">轻度</div>
              </div>
              <div class="bubble-item" data-level="3">
                <div class="bubble-number">3</div>
                <div class="bubble-label">中度</div>
              </div>
              <div class="bubble-item" data-level="4">
                <div class="bubble-number">4</div>
                <div class="bubble-label">重度</div>
              </div>
              <div class="bubble-item" data-level="5">
                <div class="bubble-number">5</div>
                <div class="bubble-label">剧烈</div>
              </div>
            </div>
          </div>

          <div class="control-section">
            <h3>📋 治愈记录</h3>
            <div class="pain-history" id="painHistory">
              <p style="text-align: center; color: rgba(255,255,255,0.7);">暂无治愈记录</p>
            </div>
            <button class="wave-button" onclick="PainTool.clearAllPain()">清除所有记录</button>
          </div>
        </div>
      </div>
    </div>
  `;
}