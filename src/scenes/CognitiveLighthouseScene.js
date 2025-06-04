export function createCognitiveLighthouseScene() {
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
        <h1 class="scene-title">🗼 认知灯塔</h1>
        <p class="scene-subtitle">照亮内心的思维世界，重构认知的力量</p>
      </div>

      <div class="scene-main">
        <div class="scene-content">
          <div class="thought-input-area">
            <h3 style="color: white; margin-bottom: 10px;">💭 思维捕捉器</h3>
            <textarea id="thought-input" class="thought-input" placeholder="在这里记录您的自动化思维、担忧或负面想法...&#10;例如：我总是做错事情，没有人会真正理解我"></textarea>
            <button class="wave-button" onclick="CognitiveTool.captureThought()">捕捉思维</button>
          </div>

          <div class="control-section">
            <h3>🔍 认知扭曲识别</h3>
            <div class="distortion-grid">
              <div class="distortion-card" data-type="all-or-nothing">
                <div class="distortion-name">全有全无</div>
                <div class="distortion-desc">非黑即白的极端思维</div>
              </div>
              <div class="distortion-card" data-type="catastrophizing">
                <div class="distortion-name">灾难化</div>
                <div class="distortion-desc">把事情想象得很严重</div>
              </div>
              <div class="distortion-card" data-type="mind-reading">
                <div class="distortion-name">读心术</div>
                <div class="distortion-desc">认为知道别人想什么</div>
              </div>
              <div class="distortion-card" data-type="self-blame">
                <div class="distortion-name">自我指责</div>
                <div class="distortion-desc">过度责怪自己</div>
              </div>
              <div class="distortion-card" data-type="mental-filter">
                <div class="distortion-name">心理过滤</div>
                <div class="distortion-desc">只关注负面方面</div>
              </div>
              <div class="distortion-card" data-type="labeling">
                <div class="distortion-name">贴标签</div>
                <div class="distortion-desc">给自己贴负面标签</div>
              </div>
            </div>
          </div>

          <div class="evidence-section">
            <div class="evidence-column">
              <div class="evidence-title">✅ 支持证据</div>
              <div class="evidence-list" id="supporting-evidence">
                <p style="text-align: center; color: rgba(255,255,255,0.7); padding: 20px;">点击添加支持这个想法的证据</p>
              </div>
              <button class="wave-button" onclick="CognitiveTool.addEvidence('support')">添加支持证据</button>
            </div>
            <div class="evidence-column">
              <div class="evidence-title">❌ 反对证据</div>
              <div class="evidence-list" id="opposing-evidence">
                <p style="text-align: center; color: rgba(255,255,255,0.7); padding: 20px;">点击添加反对这个想法的证据</p>
              </div>
              <button class="wave-button" onclick="CognitiveTool.addEvidence('oppose')">添加反对证据</button>
            </div>
          </div>

          <div class="control-section">
            <h3>🔧 思维重构工坊</h3>
            <textarea id="reconstructed-thought" class="thought-input" placeholder="基于证据分析，写下更平衡、理性的想法..." style="min-height: 80px;"></textarea>
            <button class="wave-button" onclick="CognitiveTool.saveRestructuredThought()">保存重构思维</button>
          </div>
        </div>

        <div class="scene-controls">
          <div class="instructions">
            <h4>🧭 认知重构指南</h4>
            <p>1. 在思维捕捉器中记录负面想法</p>
            <p>2. 识别其中的认知扭曲模式</p>
            <p>3. 收集支持和反对的证据</p>
            <p>4. 重构出平衡的新思维</p>
          </div>

          <div class="control-section">
            <h3>📚 思维记录</h3>
            <div class="pain-history" id="cognitive-history">
              <p style="text-align: center; color: rgba(255,255,255,0.7);">暂无思维记录</p>
            </div>
            <button class="wave-button" onclick="CognitiveTool.clearHistory()">清除记录</button>
          </div>
        </div>
      </div>
    </div>
  `;
}