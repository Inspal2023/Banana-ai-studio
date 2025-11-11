import React from 'react';
import { KeyState } from '../hooks/useKeyManagement';

interface LiquidProgressBarProps {
  state: KeyState;
}

export function LiquidProgressBar({ state }: LiquidProgressBarProps) {
  if (!state.isValid) return null;

  const { balance, credit } = state;
  const usedCredits = credit - balance;
  const balancePercentage = (balance / credit) * 100;
  const usedPercentage = (usedCredits / credit) * 100;

  // 检查余额警告
  const isLowBalance = state.balance <= 50;
  const isCriticalBalance = state.balance <= 10;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 液态玻璃进度条容器 - 拉长2倍，高度减少2/3 */}
      <div className="relative w-[512px] h-7">
        {/* 背景轨道 - 液态玻璃效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/30 via-gray-700/40 to-gray-800/30 rounded-full backdrop-blur-sm border border-white/10 shadow-inner">
          {/* 内部光效 */}
          <div className="absolute inset-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full" />
        </div>

        {/* 已使用进度条 (红色部分) */}
        <div 
          className="absolute left-0 top-0 h-full rounded-l-full transition-all duration-1000 ease-out overflow-hidden"
          style={{ width: `${usedPercentage}%` }}
        >
          {/* 红色液态效果 */}
          <div className="w-full h-full bg-gradient-to-r from-red-500/80 via-red-600/90 to-red-700/80 rounded-l-full relative">
            {/* 液态光泽效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            {/* 内部阴影 */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 to-transparent rounded-l-full" />
          </div>
          
          {/* 已使用数量标签 */}
          {usedCredits > 0 && (
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <span className="text-white font-bold text-xs drop-shadow-lg bg-red-600/80 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/20">
                {usedCredits}
              </span>
            </div>
          )}
        </div>

        {/* 余额进度条 (绿色部分) */}
        <div 
          className="absolute left-0 top-0 h-full transition-all duration-1000 ease-out overflow-hidden"
          style={{ width: `${balancePercentage}%` }}
        >
          {/* 绿色液态效果 */}
          <div className="w-full h-full bg-gradient-to-r from-green-500/80 via-green-600/90 to-green-700/80 relative">
            {/* 液态光泽效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            {/* 内部阴影 */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent" />
          </div>
          
          {/* 余额数量标签 */}
          {balance > 0 && (
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <span className={`font-bold text-xs drop-shadow-lg px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/20 ${
                isCriticalBalance 
                  ? 'text-red-200 bg-red-600/90 animate-pulse' 
                  : 'text-white bg-green-600/80'
              }`}>
                {balance}
              </span>
            </div>
          )}
        </div>

        {/* 交界处滑块效果 - 调整大小以适应新高度 */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-out z-10"
          style={{ left: `${usedPercentage}%` }}
        >
          {/* 主滑块 - 高度适应新进度条 */}
          <div className={`w-2 h-6 rounded-full border border-white/40 shadow-lg transform -translate-x-1/2 ${
            isCriticalBalance 
              ? 'bg-gradient-to-b from-red-400 to-red-600 animate-pulse' 
              : 'bg-gradient-to-b from-green-400 to-green-600'
          }`}>
            {/* 滑块内部高光 */}
            <div className="w-1 h-1.5 bg-white/60 rounded-full mx-auto mt-0.5" />
          </div>
          
          {/* 滑块光晕效果 - 调整大小 */}
          <div className={`absolute -top-0.5 -left-0.5 w-3 h-7 rounded-full opacity-50 ${
            isCriticalBalance ? 'bg-red-400' : 'bg-green-400'
          }`} style={{ filter: 'blur(1px)' }} />
        </div>

        {/* 余额严重不足闪烁效果 */}
        {isCriticalBalance && (
          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
        )}
      </div>

      {/* 进度条上方的信息标签 */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full border border-white/20" />
          <span className="text-green-300">余额: {balance}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full border border-white/20" />
          <span className="text-red-300">已用: {usedCredits}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full border border-white/20" />
          <span className="text-blue-300">总面额: {credit}</span>
        </div>
      </div>

      {/* 余额警告提示 */}
      {isCriticalBalance && (
        <div className="bg-red-500/90 text-white text-xs px-2 py-1 rounded shadow-lg border border-red-400/30 animate-pulse">
          <span className="animate-bounce">⚠️</span> 余额严重不足，请及时充值！
        </div>
      )}
    </div>
  );
}