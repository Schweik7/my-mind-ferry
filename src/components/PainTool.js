// 疼痛可视化工具
export class PainTool {
  static currentPainLevel = 1;
  static painHistory = [];
  static painPoints = [];
  static pointIdCounter = 0;
  static currentView = 'front';

  static bodyPartsMapping = {
    front: {
      '0-15': '头顶', '15-25': '前额', '25-35': '眼部', '35-45': '面部', '45-60': '下颌',
      '60-85': '颈部前侧', '85-110': '喉咙', '110-140': '上胸部', '140-170': '胸部',
      '170-200': '中胸部', '200-230': '上腹部', '230-260': '腹部', '260-290': '下腹部',
      '290-330': '骨盆区域', '330-380': '大腿前侧', '380-440': '膝盖前侧',
      '440-500': '小腿前侧', '500-580': '足部'
    },
    back: {
      '0-15': '后脑', '15-35': '头后部', '35-60': '颈后部', '60-85': '颈椎',
      '85-130': '上背部', '130-180': '肩胛骨区域', '180-230': '中背部', '230-280': '下背部',
      '280-330': '腰骶部', '330-380': '大腿后侧', '380-440': '膝盖后侧',
      '440-500': '小腿后侧', '500-580': '足跟'
    }
  };

  static armMapping = {
    left: {
      '130-210': '左上臂', '210-230': '左肘部', '230-305': '左前臂',
      '305-330': '左手腕', '330-350': '左手'
    },
    right: {
      '130-210': '右上臂', '210-230': '右肘部', '230-305': '右前臂',
      '305-330': '右手腕', '330-350': '右手'
    }
  };

  static init() {
    this.bindEvents();
  }

  static bindEvents() {
    // 疼痛等级选择
    document.querySelectorAll('.bubble-item').forEach(item => {
      item.addEventListener('click', function () {
        document.querySelectorAll('.bubble-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        PainTool.currentPainLevel = parseInt(this.dataset.level);
      });
    });

    // 身体图点击事件
    const bodySvg = document.getElementById('bodySvg');
    if (bodySvg) {
      bodySvg.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        PainTool.addPainPoint(xPercent, yPercent, PainTool.currentPainLevel);
      });
    }

    // 视图切换按钮样式更新
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.view-btn').forEach(b => {
          b.classList.remove('active');
        });
        this.classList.add('active');
      });
    });
  }

  static switchView(view) {
    this.currentView = view;

    const frontView = document.getElementById('frontView');
    const backView = document.getElementById('backView');

    if (view === 'front') {
      if (frontView) frontView.style.display = 'block';
      if (backView) backView.style.display = 'none';
    } else {
      if (frontView) frontView.style.display = 'none';
      if (backView) backView.style.display = 'block';
    }

    this.clearCurrentViewPainPoints();
  }

  static clearCurrentViewPainPoints() {
    const painPointsToRemove = document.querySelectorAll('.pain-point');
    painPointsToRemove.forEach(point => point.remove());
  }

  static addPainPoint(x, y, level) {
    const painPoint = document.createElement('div');
    painPoint.className = `pain-point pain-level-${level}`;
    painPoint.style.left = `${x}%`;
    painPoint.style.top = `${y}%`;
    painPoint.style.transform = 'translate(-50%, -50%)';
    painPoint.style.position = 'absolute';
    painPoint.id = `pain-${this.pointIdCounter++}`;

    painPoint.addEventListener('dblclick', function () {
      PainTool.removePainPoint(this.id);
    });

    painPoint.title = `不适等级: ${level} (${this.getBodyPart(y, x)}), 双击删除`;

    const bodyOutline = document.getElementById('bodyOutline');
    if (bodyOutline) {
      bodyOutline.appendChild(painPoint);
    }

    const bodyPart = this.getBodyPart(y, x);
    const timestamp = new Date().toLocaleString('zh-CN');

    const record = {
      id: painPoint.id,
      bodyPart: bodyPart,
      level: level,
      timestamp: timestamp,
      x: x,
      y: y,
      view: this.currentView
    };

    this.painHistory.unshift(record);
    this.painPoints.push(record);

    this.updatePainHistory();
  }

  static getBodyPart(yPercent, xPercent) {
    const y = yPercent * 6;

    if (xPercent < 35) {
      for (const [range, part] of Object.entries(this.armMapping.left)) {
        const [min, max] = range.split('-').map(Number);
        if (y >= min && y <= max) return part;
      }
    } else if (xPercent > 65) {
      for (const [range, part] of Object.entries(this.armMapping.right)) {
        const [min, max] = range.split('-').map(Number);
        if (y >= min && y <= max) return part;
      }
    }

    const mapping = this.bodyPartsMapping[this.currentView];
    for (const [range, part] of Object.entries(mapping)) {
      const [min, max] = range.split('-').map(Number);
      if (y >= min && y <= max) return part;
    }

    return '未知部位';
  }

  static removePainPoint(pointId) {
    const pointElement = document.getElementById(pointId);
    if (pointElement) pointElement.remove();

    this.painHistory = this.painHistory.filter(record => record.id !== pointId);
    this.painPoints = this.painPoints.filter(record => record.id !== pointId);

    this.updatePainHistory();
  }

  static updatePainHistory() {
    const historyContainer = document.getElementById('painHistory');
    if (!historyContainer) return;

    if (this.painHistory.length === 0) {
      historyContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7);">暂无治愈记录</p>';
      return;
    }

    historyContainer.innerHTML = this.painHistory.map(record => `
      <div class="history-item">
        <div class="timestamp">${record.timestamp}</div>
        <div><strong>${record.bodyPart}</strong> (${record.view === 'front' ? '正面' : '背面'}) - 不适等级 ${record.level}</div>
      </div>
    `).join('');
  }

  static clearAllPain() {
    if (confirm('确定要清除所有治愈记录吗？')) {
      this.painPoints.forEach(point => {
        const element = document.getElementById(point.id);
        if (element) element.remove();
      });

      this.painHistory = [];
      this.painPoints = [];
      this.pointIdCounter = 0;
      this.updatePainHistory();
    }
  }

  static cleanup() {
    this.clearCurrentViewPainPoints();
  }
}