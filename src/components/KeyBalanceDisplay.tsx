import React from 'react';
import { KeyState } from '../hooks/useKeyManagement';
import { Key, RefreshCw } from 'lucide-react';
import { LiquidProgressBar } from './LiquidProgressBar';

interface KeyBalanceDisplayProps {
  state: KeyState;
  onChangeKey: () => void;
  onShowKeyModal: () => void;
}

export function KeyBalanceDisplay({ state, onChangeKey, onShowKeyModal }: KeyBalanceDisplayProps) {
  // 检查余额警告
  const isLowBalance = state.isValid && state.balance <= 50;
  const isCriticalBalance = state.isValid && state.balance <= 10;

  if (!state.isValid) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={onShowKeyModal}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white rounded-xl hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 border border-white/20 backdrop-blur-sm"
            title="输入卡密"
          >
            <Key className="w-6 h-6 drop-shadow-sm" />
            <span className="hidden sm:inline font-medium">输入卡密</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-pink-400/20 to-purple-500/0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 bg-white/5 px-6 py-4 rounded-xl backdrop-blur-sm border border-white/10 relative">
      {/* 液态玻璃进度条组件 - 放在按钮左边 */}
      <div className="flex-1">
        <LiquidProgressBar state={state} />
      </div>
      
      {/* 右侧控制按钮 */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onChangeKey}
          className="flex items-center gap-2 px-4 py-2 text-sm text-blue-300 hover:text-blue-200 hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-blue-400/30 hover:border-blue-300/50"
          title="更换卡密"
        >
          <RefreshCw className="w-4 h-4" />
          <span>更换卡密</span>
        </button>
        
        <button
          onClick={onShowKeyModal}
          className="flex items-center gap-2 px-4 py-2 text-sm text-green-300 hover:text-green-200 hover:bg-green-500/20 rounded-lg transition-all duration-200 border border-green-400/30 hover:border-green-300/50"
          title="管理卡密"
        >
          <Key className="w-4 h-4" />
          <span>管理卡密</span>
        </button>
      </div>
    </div>
  );
}