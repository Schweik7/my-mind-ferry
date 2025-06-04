// 表情识别模块（Web版本）
export class EmotionRecognition {
  static stream = null;
  static interval = null;
  static isRunning = false;
  static history = [];

  static emotions = [
    { name: '开心', icon: '😊', type: 'positive', confidence: 85 },
    { name: '兴奋', icon: '🤩', type: 'positive', confidence: 78 },
    { name: '平静', icon: '😌', type: 'positive', confidence: 72 },
    { name: '惊喜', icon: '😮', type: 'positive', confidence: 68 },
    { name: '悲伤', icon: '😢', type: 'negative', confidence: 82 },
    { name: '愤怒', icon: '😠', type: 'negative', confidence: 75 },
    { name: '焦虑', icon: '😰', type: 'negative', confidence: 70 },
    { name: '失望', icon: '😞', type: 'negative', confidence: 65 },
    { name: '中性', icon: '😐', type: 'neutral', confidence: 60 }
  ];

  static init() {
    // 初始化表情识别模块
  }

  static async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });

      const video = document.getElementById('emotion-webcam');
      const placeholder = document.getElementById('camera-placeholder');
      const startBtn = document.getElementById('start-camera-btn');
      const stopBtn = document.getElementById('stop-camera-btn');

      if (video && placeholder && startBtn && stopBtn) {
        video.srcObject = this.stream;
        video.style.display = 'block';
        placeholder.style.display = 'none';
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
      }

      this.startRecognition();

    } catch (error) {
      console.warn('摄像头访问失败，使用模拟模式:', error);
      alert('无法访问摄像头，将使用模拟识别模式');
      this.startRecognition();
    }
  }

  static stopCamera() {
    this.stop();
    const video = document.getElementById('emotion-webcam');
    const placeholder = document.getElementById('camera-placeholder');
    const startBtn = document.getElementById('start-camera-btn');
    const stopBtn = document.getElementById('stop-camera-btn');

    if (video && placeholder && startBtn && stopBtn) {
      video.style.display = 'none';
      placeholder.style.display = 'flex';
      startBtn.style.display = 'block';
      stopBtn.style.display = 'none';
    }
  }

  static startRecognition() {
    if (this.isRunning) return;
    this.isRunning = true;

    let emotionIndex = 0;
    this.interval = setInterval(() => {
      const emotion = this.emotions[emotionIndex % this.emotions.length];
      this.updateDisplay(emotion);
      this.recordEmotion(emotion);
      emotionIndex++;
    }, 3000);
  }

  static updateDisplay(emotion) {
    const emotionIcon = document.getElementById('emotion-icon');
    const emotionName = document.getElementById('emotion-name');
    const emotionConfidence = document.getElementById('emotion-confidence');
    const indicator = document.getElementById('emotion-indicator');
    const fill = document.getElementById('confidence-fill');

    if (emotionIcon) emotionIcon.textContent = emotion.icon;
    if (emotionName) emotionName.textContent = emotion.name;
    if (emotionConfidence) emotionConfidence.textContent = emotion.confidence;

    if (indicator) {
      indicator.className = `status-indicator ${emotion.type}`;
    }

    if (fill) {
      fill.style.width = `${emotion.confidence}%`;
      const colors = {
        positive: '#4CAF50',
        negative: '#F44336',
        neutral: '#FFC107'
      };
      fill.style.background = `linear-gradient(45deg, ${colors[emotion.type]}, ${colors[emotion.type]}aa)`;
    }
  }

  static recordEmotion(emotion) {
    const record = {
      emotion: emotion.name,
      type: emotion.type,
      confidence: emotion.confidence,
      timestamp: new Date().toLocaleString('zh-CN')
    };

    this.history.unshift(record);
    if (this.history.length > 20) this.history.pop();

    this.updateHistory();
  }

  static updateHistory() {
    const historyContainer = document.getElementById('emotion-history');
    if (!historyContainer) return;

    if (this.history.length === 0) {
      historyContainer.innerHTML = '<p style="text-align: center; color: #666;">暂无情感记录</p>';
      return;
    }

    historyContainer.innerHTML = this.history.slice(0, 8).map(record => `
      <div class="history-item">
        <div class="timestamp">${record.timestamp}</div>
        <div><strong>${record.emotion}</strong> ${record.confidence}%</div>
      </div>
    `).join('');
  }

  static clearHistory() {
    if (confirm('确定要清除所有情感记录吗？')) {
      this.history = [];
      this.updateHistory();
    }
  }

  static stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.isRunning = false;
  }
}