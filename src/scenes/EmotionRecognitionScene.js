export function createEmotionRecognitionScene() {
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

    <div class="emotion-container">
      <div class="emotion-header">
        <h1>💎 情感之岛</h1>
        <p>在旅途中探索内心的情感世界</p>
      </div>

      <div class="emotion-main-content">
        <div class="video-section">
          <h3>✨ 情感感知镜</h3>
          <video id="emotion-webcam" autoplay muted playsinline></video>
          <div id="camera-placeholder">
            💫 点击启动情感感知
          </div>
          <button id="start-camera-btn" class="wave-button" onclick="EmotionRecognition.startCamera()">开始感知</button>
          <button id="stop-camera-btn" class="wave-button" onclick="EmotionRecognition.stopCamera()" style="display: none; background: linear-gradient(45deg, rgba(244,67,54,0.3), rgba(244,67,54,0.4));">停止感知</button>
        </div>

        <div class="emotion-display">
          <div>
            <h3>🌊 当前情感</h3>
            <div class="emotion-icon" id="emotion-icon">😐</div>
            <div class="emotion-info">
              <div>
                <span class="status-indicator neutral" id="emotion-indicator"></span>
                <span id="emotion-name">静待感知</span>
              </div>
              <div>强度: <span id="emotion-confidence">0</span>%</div>
              <div class="confidence-bar">
                <div class="confidence-fill" id="confidence-fill" style="width: 0%;"></div>
              </div>
            </div>
          </div>

          <div>
            <h3>🗂️ 情感记录</h3>
            <div class="emotion-history" id="emotion-history">
              <p style="text-align: center; color: #666;">暂无情感记录</p>
            </div>
            <button class="wave-button" onclick="EmotionRecognition.clearHistory()">清除记录</button>
          </div>
        </div>
      </div>
    </div>
  `;
}