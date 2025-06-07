// src/tools/ToolManager.js - 工具管理器
import { PainTool } from '../components/PainTool.js';
import { EmotionRecognition } from '../components/EmotionRecognition.js';
import { CognitiveTool } from '../components/CognitiveTool.js';
import { SelfSanctuary } from '../components/SelfSanctuary.js';

/**
 * 工具管理器 - 统一管理所有工具组件
 */
export class ToolManager {
  constructor() {
    this.tools = new Map();
    this.isInitialized = false;
  }

  // 初始化所有工具
  init() {
    console.log('🔧 工具管理器初始化中...');
    
    try {
      // 注册工具组件
      this.registerTool('PainTool', PainTool);
      this.registerTool('EmotionRecognition', EmotionRecognition);
      this.registerTool('CognitiveTool', CognitiveTool);
      this.registerTool('SelfSanctuary', SelfSanctuary);
      
      this.isInitialized = true;
      console.log('✅ 工具管理器初始化完成');
    } catch (error) {
      console.error('❌ 工具管理器初始化失败:', error);
    }
  }

  // 注册工具
  registerTool(name, toolClass) {
    if (!toolClass) {
      console.warn(`工具 ${name} 未定义，跳过注册`);
      return;
    }

    this.tools.set(name, {
      class: toolClass,
      instance: toolClass,
      isActive: false,
      lastUsed: null,
      data: {}
    });

    console.log(`🔧 工具 ${name} 已注册`);
  }

  // 初始化指定工具
  initializeTool(toolName) {
    const tool = this.tools.get(toolName);
    if (!tool) {
      console.error(`工具 ${toolName} 不存在`);
      return false;
    }

    try {
      if (tool.instance && typeof tool.instance.init === 'function') {
        tool.instance.init();
        tool.isActive = true;
        tool.lastUsed = new Date();
        console.log(`✅ 工具 ${toolName} 初始化完成`);
        return true;
      }
    } catch (error) {
      console.error(`工具 ${toolName} 初始化失败:`, error);
      return false;
    }
  }

  // 清理指定工具
  cleanupTool(toolName) {
    const tool = this.tools.get(toolName);
    if (!tool) return false;

    try {
      if (tool.instance && typeof tool.instance.cleanup === 'function') {
        tool.instance.cleanup();
        tool.isActive = false;
        console.log(`🧹 工具 ${toolName} 已清理`);
        return true;
      }
    } catch (error) {
      console.error(`工具 ${toolName} 清理失败:`, error);
      return false;
    }
  }

  // 获取工具实例
  getTool(toolName) {
    const tool = this.tools.get(toolName);
    return tool ? tool.instance : null;
  }

  // 获取疼痛工具
  getPainTool() {
    return this.getTool('PainTool');
  }

  // 获取情感识别工具
  getEmotionRecognition() {
    return this.getTool('EmotionRecognition');
  }

  // 获取认知工具
  getCognitiveTool() {
    return this.getTool('CognitiveTool');
  }

  // 获取自我圣殿工具
  getSelfSanctuary() {
    return this.getTool('SelfSanctuary');
  }

  // 导出所有工具数据
  exportAllData() {
    const exportData = {};
    
    this.tools.forEach((tool, name) => {
      try {
        // 尝试从工具实例获取数据
        const toolData = this.extractToolData(tool.instance, name);
        if (toolData) {
          exportData[name] = {
            ...toolData,
            isActive: tool.isActive,
            lastUsed: tool.lastUsed
          };
        }
      } catch (error) {
        console.error(`导出 ${name} 数据失败:`, error);
      }
    });

    return exportData;
  }

  // 提取工具数据
  extractToolData(toolInstance, toolName) {
    if (!toolInstance) return null;

    switch (toolName) {
      case 'PainTool':
        return {
          painHistory: toolInstance.painHistory || [],
          painPoints: toolInstance.painPoints || [],
          currentPainLevel: toolInstance.currentPainLevel || 1,
          currentView: toolInstance.currentView || 'front'
        };

      case 'EmotionRecognition':
        return {
          history: toolInstance.history || [],
          isRunning: toolInstance.isRunning || false
        };

      case 'CognitiveTool':
        return {
          thoughtHistory: toolInstance.thoughtHistory || [],
          currentThought: toolInstance.currentThought || '',
          selectedDistortions: toolInstance.selectedDistortions || [],
          supportingEvidence: toolInstance.supportingEvidence || [],
          opposingEvidence: toolInstance.opposingEvidence || []
        };

      case 'SelfSanctuary':
        return {
          foundationMaps: toolInstance.foundationMaps || [],
          selectedValues: toolInstance.selectedValues || [],
          strengthsData: toolInstance.strengthsData || '',
          supportData: toolInstance.supportData || {},
          lifeStory: toolInstance.lifeStory || {}
        };

      default:
        return {};
    }
  }

  // 清空所有工具数据
  clearAllData() {
    console.log('🧹 清空所有工具数据...');
    
    this.tools.forEach((tool, name) => {
      try {
        if (tool.instance && typeof tool.instance.cleanup === 'function') {
          tool.instance.cleanup();
        }
        // 重置工具状态
        tool.isActive = false;
        tool.lastUsed = null;
        tool.data = {};
      } catch (error) {
        console.error(`清空 ${name} 数据失败:`, error);
      }
    });

    console.log('✅ 所有工具数据已清空');
  }

  // 获取工具状态
  getStatus() {
    const status = {};
    
    this.tools.forEach((tool, name) => {
      status[name] = {
        isRegistered: true,
        isActive: tool.isActive,
        lastUsed: tool.lastUsed,
        hasData: Object.keys(tool.data).length > 0
      };
    });

    return status;
  }

  // 获取活动工具列表
  getActiveTools() {
    const activeTools = [];
    
    this.tools.forEach((tool, name) => {
      if (tool.isActive) {
        activeTools.push(name);
      }
    });

    return activeTools;
  }

  // 批量初始化工具
  initializeTools(toolNames) {
    const results = {};
    
    toolNames.forEach(toolName => {
      results[toolName] = this.initializeTool(toolName);
    });

    return results;
  }

  // 批量清理工具
  cleanupTools(toolNames) {
    const results = {};
    
    toolNames.forEach(toolName => {
      results[toolName] = this.cleanupTool(toolName);
    });

    return results;
  }

  // 重新加载工具
  reloadTool(toolName) {
    console.log(`🔄 重新加载工具 ${toolName}...`);
    
    // 先清理
    this.cleanupTool(toolName);
    
    // 等待一小段时间后重新初始化
    setTimeout(() => {
      this.initializeTool(toolName);
    }, 100);
  }

  // 检查工具是否可用
  isToolAvailable(toolName) {
    const tool = this.tools.get(toolName);
    return tool && tool.instance && typeof tool.instance.init === 'function';
  }

  // 获取工具使用统计
  getUsageStats() {
    const stats = {
      totalTools: this.tools.size,
      activeTools: this.getActiveTools().length,
      recentlyUsed: [],
      neverUsed: []
    };

    this.tools.forEach((tool, name) => {
      if (tool.lastUsed) {
        stats.recentlyUsed.push({
          name,
          lastUsed: tool.lastUsed
        });
      } else {
        stats.neverUsed.push(name);
      }
    });

    // 按最近使用时间排序
    stats.recentlyUsed.sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed));

    return stats;
  }

  // 清理资源
  cleanup() {
    console.log('🧹 工具管理器清理中...');
    
    // 清理所有工具
    this.tools.forEach((tool, name) => {
      this.cleanupTool(name);
    });

    // 清空工具映射
    this.tools.clear();
    this.isInitialized = false;

    console.log('✅ 工具管理器清理完成');
  }
}