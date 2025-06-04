// 认知灯塔工具
export class CognitiveTool {
  static currentThought = '';
  static selectedDistortions = [];
  static supportingEvidence = [];
  static opposingEvidence = [];
  static thoughtHistory = [];

  static distortionTypes = {
    'all-or-nothing': { name: '全有全无', desc: '非黑即白的极端思维', examples: ['我总是失败', '这完全是灾难'] },
    'catastrophizing': { name: '灾难化', desc: '把事情想象得很严重', examples: ['这会毁掉一切', '最坏的事情会发生'] },
    'mind-reading': { name: '读心术', desc: '认为知道别人想什么', examples: ['他们肯定讨厌我', '她觉得我很蠢'] },
    'self-blame': { name: '自我指责', desc: '过度责怪自己', examples: ['都是我的错', '我让所有人失望了'] },
    'mental-filter': { name: '心理过滤', desc: '只关注负面方面', examples: ['只看到错误', '忽视积极的事情'] },
    'labeling': { name: '贴标签', desc: '给自己贴负面标签', examples: ['我是失败者', '我很愚蠢'] }
  };

  static init() {
    this.bindEvents();
  }

  static bindEvents() {
    // 认知扭曲卡片点击事件
    document.querySelectorAll('.distortion-card').forEach(card => {
      card.addEventListener('click', function () {
        const type = this.dataset.type;
        if (this.classList.contains('selected')) {
          this.classList.remove('selected');
          CognitiveTool.selectedDistortions = CognitiveTool.selectedDistortions.filter(t => t !== type);
        } else {
          this.classList.add('selected');
          CognitiveTool.selectedDistortions.push(type);
        }
      });
    });
  }

  static captureThought() {
    const thoughtInput = document.getElementById('thought-input');
    if (!thoughtInput) return;

    const thought = thoughtInput.value.trim();

    if (!thought) {
      alert('请先输入您的想法');
      return;
    }

    this.currentThought = thought;
    thoughtInput.value = '';

    // 提供一些示例证据
    this.generateSampleEvidence(thought);

    alert('思维已捕捉！现在请识别认知扭曲模式并收集证据。');
  }

  static generateSampleEvidence(thought) {
    // 根据思维内容生成示例证据
    const supportingSamples = [
      '确实遇到了一些困难',
      '有人曾经表达过不满',
      '之前有过失败的经历',
      '情况看起来很复杂'
    ];

    const opposingSamples = [
      '也有成功的时候',
      '有人支持和理解我',
      '问题可能有其他原因',
      '这可能是暂时的困难',
      '我有应对的能力和资源',
      '以前克服过类似困难'
    ];

    this.supportingEvidence = supportingSamples.slice(0, 2);
    this.opposingEvidence = opposingSamples.slice(0, 3);

    this.updateEvidenceDisplay();
  }

  static addEvidence(type) {
    const evidence = prompt(`请输入${type === 'support' ? '支持' : '反对'}这个想法的证据：`);
    if (evidence && evidence.trim()) {
      if (type === 'support') {
        this.supportingEvidence.push(evidence.trim());
      } else {
        this.opposingEvidence.push(evidence.trim());
      }
      this.updateEvidenceDisplay();
    }
  }

  static updateEvidenceDisplay() {
    const supportingContainer = document.getElementById('supporting-evidence');
    const opposingContainer = document.getElementById('opposing-evidence');

    if (supportingContainer) {
      if (this.supportingEvidence.length === 0) {
        supportingContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7); padding: 20px;">点击添加支持这个想法的证据</p>';
      } else {
        supportingContainer.innerHTML = this.supportingEvidence.map((evidence, index) => `
          <div class="evidence-item" onclick="CognitiveTool.removeEvidence('support', ${index})">
            ${evidence}
          </div>
        `).join('');
      }
    }

    if (opposingContainer) {
      if (this.opposingEvidence.length === 0) {
        opposingContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7); padding: 20px;">点击添加反对这个想法的证据</p>';
      } else {
        opposingContainer.innerHTML = this.opposingEvidence.map((evidence, index) => `
          <div class="evidence-item" onclick="CognitiveTool.removeEvidence('oppose', ${index})">
            ${evidence}
          </div>
        `).join('');
      }
    }
  }

  static removeEvidence(type, index) {
    if (type === 'support') {
      this.supportingEvidence.splice(index, 1);
    } else {
      this.opposingEvidence.splice(index, 1);
    }
    this.updateEvidenceDisplay();
  }

  static saveRestructuredThought() {
    const restructuredInput = document.getElementById('reconstructed-thought');
    if (!restructuredInput) return;

    const restructuredThought = restructuredInput.value.trim();

    if (!restructuredThought) {
      alert('请先写下重构后的想法');
      return;
    }

    if (!this.currentThought) {
      alert('请先捕捉一个原始想法');
      return;
    }

    const record = {
      originalThought: this.currentThought,
      distortions: this.selectedDistortions.map(type => this.distortionTypes[type].name),
      supportingEvidence: [...this.supportingEvidence],
      opposingEvidence: [...this.opposingEvidence],
      restructuredThought: restructuredThought,
      timestamp: new Date().toLocaleString('zh-CN')
    };

    this.thoughtHistory.unshift(record);
    if (this.thoughtHistory.length > 10) this.thoughtHistory.pop();

    this.updateHistory();
    this.resetForm();

    alert('思维重构完成！新的平衡想法已保存。');
  }

  static resetForm() {
    this.currentThought = '';
    this.selectedDistortions = [];
    this.supportingEvidence = [];
    this.opposingEvidence = [];

    const thoughtInput = document.getElementById('thought-input');
    const restructuredInput = document.getElementById('reconstructed-thought');

    if (thoughtInput) thoughtInput.value = '';
    if (restructuredInput) restructuredInput.value = '';

    document.querySelectorAll('.distortion-card').forEach(card => {
      card.classList.remove('selected');
    });

    this.updateEvidenceDisplay();
  }

  static updateHistory() {
    const historyContainer = document.getElementById('cognitive-history');
    if (!historyContainer) return;

    if (this.thoughtHistory.length === 0) {
      historyContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7);">暂无思维记录</p>';
      return;
    }

    historyContainer.innerHTML = this.thoughtHistory.map(record => `
      <div class="history-item">
        <div class="timestamp">${record.timestamp}</div>
        <div><strong>原始想法：</strong>${record.originalThought.substring(0, 50)}...</div>
        <div><strong>重构想法：</strong>${record.restructuredThought.substring(0, 50)}...</div>
        ${record.distortions.length > 0 ? `<div><strong>识别扭曲：</strong>${record.distortions.join('、')}</div>` : ''}
      </div>
    `).join('');
  }

  static clearHistory() {
    if (confirm('确定要清除所有思维记录吗？')) {
      this.thoughtHistory = [];
      this.updateHistory();
    }
  }

  static cleanup() {
    this.resetForm();
  }
}