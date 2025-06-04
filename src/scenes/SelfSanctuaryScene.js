export function createSelfSanctuaryScene() {
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
        <h1 class="scene-title">🏛️ 自我圣殿</h1>
        <p class="scene-subtitle">发现内在力量与外在资源，构建生命的坚实基石</p>
      </div>

      <div class="scene-main">
        <div class="scene-content">
          <div class="control-section">
            <h3>💎 内在力量宝库</h3>
            <div class="strength-categories">
              <div class="strength-category" data-category="character">
                <div class="category-icon">🛡️</div>
                <div class="category-name">品格力量</div>
                <div class="category-desc">诚实、勇敢、善良</div>
              </div>
              <div class="strength-category" data-category="skills">
                <div class="category-icon">⚙️</div>
                <div class="category-name">技能力量</div>
                <div class="category-desc">专业技能、才艺</div>
              </div>
              <div class="strength-category" data-category="emotional">
                <div class="category-icon">❤️</div>
                <div class="category-name">情感力量</div>
                <div class="category-desc">同理心、韧性</div>
              </div>
            </div>
            <textarea id="strengths-input" class="story-input" placeholder="在这里记录您发现的内在力量..."></textarea>
          </div>

          <div class="control-section">
            <h3>🧭 价值观罗盘</h3>
            <div class="values-grid">
              <div class="value-item" data-value="family">
                <div class="value-name">家庭</div>
              </div>
              <div class="value-item" data-value="growth">
                <div class="value-name">成长</div>
              </div>
              <div class="value-item" data-value="creativity">
                <div class="value-name">创造</div>
              </div>
              <div class="value-item" data-value="service">
                <div class="value-name">服务</div>
              </div>
              <div class="value-item" data-value="freedom">
                <div class="value-name">自由</div>
              </div>
              <div class="value-item" data-value="justice">
                <div class="value-name">正义</div>
              </div>
              <div class="value-item" data-value="knowledge">
                <div class="value-name">求知</div>
              </div>
              <div class="value-item" data-value="beauty">
                <div class="value-name">美感</div>
              </div>
              <div class="value-item" data-value="health">
                <div class="value-name">健康</div>
              </div>
              <div class="value-item" data-value="adventure">
                <div class="value-name">探险</div>
              </div>
              <div class="value-item" data-value="peace">
                <div class="value-name">宁静</div>
              </div>
              <div class="value-item" data-value="success">
                <div class="value-name">成就</div>
              </div>
            </div>
          </div>

          <div class="support-network">
            <div class="network-category">
              <div class="network-title">👨‍👩‍👧‍👦 家庭支持</div>
              <div class="network-list" id="family-support">
                <textarea class="story-input" placeholder="记录家庭中的支持力量..." style="min-height: 60px;"></textarea>
              </div>
            </div>
            <div class="network-category">
              <div class="network-title">👥 朋友网络</div>
              <div class="network-list" id="friends-support">
                <textarea class="story-input" placeholder="记录朋友们的支持..." style="min-height: 60px;"></textarea>
              </div>
            </div>
            <div class="network-category">
              <div class="network-title">🏘️ 社区资源</div>
              <div class="network-list" id="community-support">
                <textarea class="story-input" placeholder="记录社区、组织的资源..." style="min-height: 60px;"></textarea>
              </div>
            </div>
            <div class="network-category">
              <div class="network-title">👨‍⚕️ 专业支持</div>
              <div class="network-list" id="professional-support">
                <textarea class="story-input" placeholder="记录专业人士的帮助..." style="min-height: 60px;"></textarea>
              </div>
            </div>
          </div>

          <div class="life-story-section">
            <h3>📖 生命故事编织</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <h4 style="color: white; margin-bottom: 8px;">🌟 成长时刻</h4>
                <textarea class="story-input" placeholder="记录您生命中的成长时刻、克服的困难、取得的成就..."></textarea>
              </div>
              <div>
                <h4 style="color: white; margin-bottom: 8px;">🚀 未来愿景</h4>
                <textarea class="story-input" placeholder="描述您对未来的希望、梦想和目标..."></textarea>
              </div>
            </div>
          </div>

          <button class="wave-button" onclick="SelfSanctuary.generateFoundationMap()">生成基石地图</button>
        </div>

        <div class="scene-controls">
          <div class="instructions">
            <h4>🧭 圣殿探索指南</h4>
            <p>1. 探索三种内在力量类型</p>
            <p>2. 选择重要的价值观</p>
            <p>3. 绘制支持网络地图</p>
            <p>4. 编织生命成长故事</p>
            <p>5. 生成个性化基石地图</p>
          </div>

          <div class="control-section">
            <h3>🗺️ 基石地图</h3>
            <div class="pain-history" id="foundation-map">
              <p style="text-align: center; color: rgba(255,255,255,0.7);">完成探索后生成您的力量基石地图</p>
            </div>
            <button class="wave-button" onclick="SelfSanctuary.clearAll()">重新探索</button>
          </div>
        </div>
      </div>
    </div>
  `;
}