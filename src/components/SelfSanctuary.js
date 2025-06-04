// 自我圣殿工具
export class SelfSanctuary {
  static selectedStrengthCategory = null;
  static selectedValues = [];
  static strengthsData = '';
  static supportData = {
    family: '',
    friends: '',
    community: '',
    professional: ''
  };
  static lifeStory = {
    growthMoments: '',
    futureVision: ''
  };
  static foundationMaps = [];

  static init() {
    this.bindEvents();
  }

  static bindEvents() {
    // 力量类别选择
    document.querySelectorAll('.strength-category').forEach(category => {
      category.addEventListener('click', function () {
        document.querySelectorAll('.strength-category').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        SelfSanctuary.selectedStrengthCategory = this.dataset.category;
      });
    });

    // 价值观选择
    document.querySelectorAll('.value-item').forEach(item => {
      item.addEventListener('click', function () {
        const value = this.dataset.value;
        if (this.classList.contains('selected')) {
          this.classList.remove('selected');
          SelfSanctuary.selectedValues = SelfSanctuary.selectedValues.filter(v => v !== value);
        } else {
          if (SelfSanctuary.selectedValues.length < 5) {
            this.classList.add('selected');
            SelfSanctuary.selectedValues.push(value);
          } else {
            alert('最多只能选择5个核心价值观');
          }
        }
      });
    });

    // 支持网络输入
    document.querySelectorAll('.network-list textarea').forEach(textarea => {
      textarea.addEventListener('input', function () {
        const category = this.closest('.network-category').querySelector('.network-title').textContent;
        if (category.includes('家庭')) {
          SelfSanctuary.supportData.family = this.value;
        } else if (category.includes('朋友')) {
          SelfSanctuary.supportData.friends = this.value;
        } else if (category.includes('社区')) {
          SelfSanctuary.supportData.community = this.value;
        } else if (category.includes('专业')) {
          SelfSanctuary.supportData.professional = this.value;
        }
      });
    });

    // 生命故事输入
    const lifeStorySection = document.querySelector('#self-sanctuary-panel .life-story-section');
    if (lifeStorySection) {
      lifeStorySection.addEventListener('input', function (e) {
        if (e.target.tagName === 'TEXTAREA') {
          const isGrowthMoments = e.target.closest('div').querySelector('h4').textContent.includes('成长');
          if (isGrowthMoments) {
            SelfSanctuary.lifeStory.growthMoments = e.target.value;
          } else {
            SelfSanctuary.lifeStory.futureVision = e.target.value;
          }
        }
      });
    }

    // 内在力量输入
    const strengthsInput = document.getElementById('strengths-input');
    if (strengthsInput) {
      strengthsInput.addEventListener('input', function () {
        SelfSanctuary.strengthsData = this.value;
      });
    }
  }

  static generateFoundationMap() {
    // 检查必填项
    if (this.selectedValues.length === 0) {
      alert('请至少选择一个核心价值观');
      return;
    }

    if (!this.strengthsData.trim()) {
      alert('请记录您的内在力量');
      return;
    }

    // 生成基石地图
    const foundationMap = {
      timestamp: new Date().toLocaleString('zh-CN'),
      strengthCategory: this.selectedStrengthCategory,
      strengths: this.strengthsData,
      coreValues: this.selectedValues,
      supportNetwork: this.supportData,
      lifeStory: this.lifeStory,
      summary: this.generateSummary()
    };

    this.foundationMaps.unshift(foundationMap);
    if (this.foundationMaps.length > 5) this.foundationMaps.pop();

    this.updateFoundationDisplay();

    alert('🎉 您的力量基石地图已生成！这是您内心力量的完整画像。');
  }

  static generateSummary() {
    const valueNames = {
      family: '家庭', growth: '成长', creativity: '创造', service: '服务',
      freedom: '自由', justice: '正义', knowledge: '求知', beauty: '美感',
      health: '健康', adventure: '探险', peace: '宁静', success: '成就'
    };

    const selectedValueNames = this.selectedValues.map(v => valueNames[v] || v);

    return `我的核心价值观是${selectedValueNames.join('、')}。我拥有丰富的内在力量，包括${this.strengthsData.substring(0, 50)}...。我的生命中有重要的支持网络，从家庭到朋友，从社区到专业人士。我正在书写属于自己的成长故事，朝着美好的未来愿景前进。`;
  }

  static updateFoundationDisplay() {
    const mapContainer = document.getElementById('foundation-map');
    if (!mapContainer) return;

    if (this.foundationMaps.length === 0) {
      mapContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7);">完成探索后生成您的力量基石地图</p>';
      return;
    }

    const latestMap = this.foundationMaps[0];
    mapContainer.innerHTML = `
      <div class="history-item">
        <div class="timestamp">${latestMap.timestamp}</div>
        <div><strong>核心价值观：</strong>${latestMap.coreValues.join('、')}</div>
        <div><strong>内在力量：</strong>${latestMap.strengths.substring(0, 80)}...</div>
        <div><strong>力量总结：</strong>${latestMap.summary.substring(0, 100)}...</div>
      </div>
      ${this.foundationMaps.slice(1).map(map => `
        <div class="history-item" style="opacity: 0.7;">
          <div class="timestamp">${map.timestamp}</div>
          <div>历史基石地图</div>
        </div>
      `).join('')}
    `;
  }

  static clearAll() {
    if (confirm('确定要清除所有数据并重新探索吗？')) {
      this.selectedStrengthCategory = null;
      this.selectedValues = [];
      this.strengthsData = '';
      this.supportData = { family: '', friends: '', community: '', professional: '' };
      this.lifeStory = { growthMoments: '', futureVision: '' };

      // 清除UI状态
      document.querySelectorAll('.strength-category').forEach(c => c.classList.remove('active'));
      document.querySelectorAll('.value-item').forEach(v => v.classList.remove('selected'));
      document.querySelectorAll('#self-sanctuary-panel textarea').forEach(t => t.value = '');

      this.updateFoundationDisplay();
    }
  }

  static cleanup() {
    // 清理资源
  }
}