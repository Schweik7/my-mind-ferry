import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'scenes': [
            './src/scenes/PainVisualizationScene.js',
            './src/scenes/EmotionRecognitionScene.js',
            './src/scenes/CognitiveLighthouseScene.js',
            './src/scenes/SelfSanctuaryScene.js',
            './src/scenes/VRScenes.js'
          ],
          'components': [
            './src/components/Navigation.js',
            './src/components/SceneManager.js',
            './src/components/PainTool.js',
            './src/components/EmotionRecognition.js',
            './src/components/CognitiveTool.js',
            './src/components/SelfSanctuary.js'
          ]
        }
      }
    }
  },
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.jpg', '**/*.png']
})