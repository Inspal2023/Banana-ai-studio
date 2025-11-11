import React, { useState, useEffect } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { ModeSelector } from './components/ModeSelector';
import { ModeSettings } from './components/ModeSettings';
import { GeneratedImage } from './components/GeneratedImage';
import { KeyBalanceDisplay } from './components/KeyBalanceDisplay';
import { KeyInputModal } from './components/KeyInputModal';
import { AIRestrictionOverlay } from './components/AIRestrictionOverlay';
import { useImageGeneration } from './hooks/useImageGeneration';
import { useKeyManagement } from './hooks/useKeyManagement';
import { Sparkles } from 'lucide-react';

export type EditMode = 'wireframe' | 'multi-view' | 'scene' | 'fusion' | null;

function App() {
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [currentMode, setCurrentMode] = useState<EditMode>('wireframe');
  const [modeSettings, setModeSettings] = useState<any>({});
  const [sceneImage, setSceneImage] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<string>('');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [restrictionReason, setRestrictionReason] = useState<string>('');

  // 卡密管理
  const {
    state: keyState,
    validateAndUseKey,
    deductCredits,
    changeKey,
    canGenerateImage,
    subscribeToUpdates
  } = useKeyManagement();

  // 订阅卡密状态更新
  React.useEffect(() => {
    const unsubscribe = subscribeToUpdates();
    return unsubscribe;
  }, [subscribeToUpdates]);

  // 自定义状态管理函数，添加调试
  const handleModeChange = (newMode: EditMode) => {
    console.log(`App: 状态即将更新: 从 ${currentMode} 到 ${newMode}`);
    setCurrentMode(newMode);
    console.log(`App: 状态更新完成, 新模式: ${newMode}`);
  };
  
  const { generateImage, isGenerating, error } = useImageGeneration();

  const handleGenerate = async () => {
    if (!uploadedImage) {
      alert('请先上传图片！');
      return;
    }

    if (!currentMode || currentMode === null) {
      alert('请先选择一个编辑模式！');
      return;
    }

    // 检查卡密状态
    if (!canGenerateImage()) {
      if (keyState.error && keyState.error.includes('余额不足')) {
        setRestrictionReason(keyState.error);
      } else {
        setRestrictionReason('请输入有效卡密以使用AI生图功能');
      }
      setIsKeyModalOpen(true);
      return;
    }

    // 执行AI生图
    const result = await generateImage({
      imageData: uploadedImage,
      mode: currentMode,
      settings: modeSettings,
      sceneImageData: sceneImage || undefined,
      referenceImageData: referenceImage || undefined
    });

    if (result) {
      // 生图成功，扣除10积分
      const deductResult = await deductCredits(10);
      
      if (deductResult.success) {
        setGeneratedImage(result.imageUrl);
        
        // 如果有警告信息，显示给用户
        if (deductResult.warning) {
          // 可以显示一个提示，比如用alert或者其他方式
          console.warn('余额警告:', deductResult.warning);
        }
      } else {
        // 扣费失败，显示错误并要求重新输入卡密
        setRestrictionReason('扣费失败，请重新输入卡密');
        setIsKeyModalOpen(true);
        return;
      }
    } else if (error) {
      alert(`生成失败: ${error}`);
    }
  };

  // 打开卡密弹窗
  const handleShowKeyModal = () => {
    setIsKeyModalOpen(true);
  };

  // 关闭卡密弹窗
  const handleCloseKeyModal = () => {
    setIsKeyModalOpen(false);
  };

  // 处理卡密验证
  const handleValidateKey = async (keyString: string): Promise<boolean> => {
    const success = await validateAndUseKey(keyString);
    if (success) {
      setIsKeyModalOpen(false);
      setRestrictionReason('');
    }
    return success;
  };

  // 处理更换卡密
  const handleChangeKey = () => {
    changeKey();
    setIsKeyModalOpen(false);
    setRestrictionReason('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3c72] to-[#2a5298] text-white p-5 relative overflow-hidden">
      {/* 科技感背景层 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 随机变换的线条 */}
        <div className="absolute inset-0">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={`line-${i}`}
              className={`tech-line tech-line-enhanced tech-line-${i % 3}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
        
        {/* 星光忽明忽暗效果 */}
        <div className="absolute inset-0">
          {Array.from({ length: 60 }, (_, i) => (
            <div
              key={`star-${i}`}
              className={`tech-star-enhanced tech-star twinkle-${i % 5}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        
        {/* 动态网格背景 */}
        <div className="tech-grid-enhanced tech-grid"></div>
        
        {/* 浮动粒子 */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={`particle-${i}`}
              className={`tech-particle-enhanced tech-particle float-${i % 3}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        {/* 额外的光晕效果 */}
        <div className="absolute inset-0">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={`glow-${i}`}
              className={`tech-glow-circle glow-${i % 3}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center py-5 mb-8 border-b border-white/20">
          <div className="flex items-center gap-4">
            <div className="text-[2.5rem] text-[#FFD700]">
              <Sparkles className="w-10 h-10" />
            </div>
            <div className="title-container flex flex-col justify-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent leading-tight">
                香蕉AI创作工坊
              </h1>
              <span className="title-text-metallic red-background">
                BANANA AI STUDIO
              </span>
            </div>
          </div>
          <KeyBalanceDisplay
            state={keyState}
            onChangeKey={handleChangeKey}
            onShowKeyModal={handleShowKeyModal}
          />
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ImageUpload 
            uploadedImage={uploadedImage}
            onImageUpload={setUploadedImage}
          />
          <GeneratedImage 
            generatedImage={generatedImage}
            isGenerating={isGenerating}
          />
        </div>

        {/* Editor Panel */}
        <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-lg border border-white/10 mb-8">
          <h2 className="text-2xl font-semibold text-[#FFD700] mb-5 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            编辑模式
          </h2>
          
          <ModeSelector 
            currentMode={currentMode}
            onModeChange={handleModeChange}
          />

          <ModeSettings 
            mode={currentMode}
            settings={modeSettings}
            onSettingsChange={setModeSettings}
            sceneImage={sceneImage}
            onSceneImageChange={setSceneImage}
            referenceImage={referenceImage}
            onReferenceImageChange={setReferenceImage}
          />

          <div className="flex justify-center mt-5 relative">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-10 py-4 text-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-gray-900 font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? '生成中...' : '生成图片'}
            </button>
            <AIRestrictionOverlay
              onShowKeyModal={handleShowKeyModal}
              isVisible={!canGenerateImage()}
              reason={restrictionReason}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-5 mt-8 border-t border-white/20 text-sm opacity-70">
          <p>Banana AI Studio &copy; 2025 - 让创意无限延伸</p>
        </footer>
      </div>

      {/* 卡密输入弹窗 */}
      <KeyInputModal
        state={keyState}
        isOpen={isKeyModalOpen}
        onClose={handleCloseKeyModal}
        onValidateKey={handleValidateKey}
        onChangeKey={handleChangeKey}
      />
    </div>
  );
}

export default App;