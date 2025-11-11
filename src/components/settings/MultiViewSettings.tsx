import { useEffect, useState } from 'react';

interface MultiViewSettingsProps {
  settings: any;
  onChange: (settings: any) => void;
}

export function MultiViewSettings({ settings, onChange }: MultiViewSettingsProps) {
  const [angle, setAngle] = useState(settings.angle || 45);
  const [elevation, setElevation] = useState(settings.elevation || 0);

  useEffect(() => {
    if (!settings.viewType) {
      onChange({
        viewType: 'free-view',
        angle: 45,
        elevation: 0,
        perspectiveType: 'one-point'
      });
    }
  }, []);

  const handleViewTypeChange = (viewType: string) => {
    onChange({ ...settings, viewType });
  };

  const handleAngleChange = (value: number) => {
    setAngle(value);
    onChange({ ...settings, angle: value });
  };

  const handleElevationChange = (value: number) => {
    setElevation(value);
    onChange({ ...settings, elevation: value });
  };

  const handlePerspectiveChange = (perspectiveType: string) => {
    onChange({ ...settings, perspectiveType });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block mb-2 font-semibold">视图类型</label>
        <select
          value={settings.viewType || 'free-view'}
          onChange={(e) => handleViewTypeChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-white/20 bg-black/30 text-white focus:outline-none focus:border-[#FFD700]"
        >
          <option value="three-view">三视图</option>
          <option value="free-view">自由视角</option>
          <option value="perspective">透视视图</option>
        </select>
      </div>

      {settings.viewType === 'free-view' && (
        <>
          {/* 常用角度预设 */}
          <div>
            <label className="block mb-2 font-semibold">常用视角预设</label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => { handleAngleChange(0); handleElevationChange(0); }}
                className="px-3 py-2 bg-white/10 hover:bg-[#FFD700]/20 rounded text-sm transition-colors"
              >
                正面
              </button>
              <button
                onClick={() => { handleAngleChange(45); handleElevationChange(0); }}
                className="px-3 py-2 bg-white/10 hover:bg-[#FFD700]/20 rounded text-sm transition-colors"
              >
                右前侧
              </button>
              <button
                onClick={() => { handleAngleChange(90); handleElevationChange(0); }}
                className="px-3 py-2 bg-white/10 hover:bg-[#FFD700]/20 rounded text-sm transition-colors"
              >
                右侧
              </button>
              <button
                onClick={() => { handleAngleChange(180); handleElevationChange(0); }}
                className="px-3 py-2 bg-white/10 hover:bg-[#FFD700]/20 rounded text-sm transition-colors"
              >
                背面
              </button>
              <button
                onClick={() => { handleAngleChange(45); handleElevationChange(30); }}
                className="px-3 py-2 bg-white/10 hover:bg-[#FFD700]/20 rounded text-sm transition-colors"
              >
                3D视图
              </button>
              <button
                onClick={() => { handleAngleChange(0); handleElevationChange(-45); }}
                className="px-3 py-2 bg-white/10 hover:bg-[#FFD700]/20 rounded text-sm transition-colors"
              >
                俯视图
              </button>
              <button
                onClick={() => { handleAngleChange(0); handleElevationChange(45); }}
                className="px-3 py-2 bg-white/10 hover:bg-[#FFD700]/20 rounded text-sm transition-colors"
              >
                仰视图
              </button>
              <button
                onClick={() => { handleAngleChange(315); handleElevationChange(30); }}
                className="px-3 py-2 bg-white/10 hover:bg-[#FFD700]/20 rounded text-sm transition-colors"
              >
                左前3D
              </button>
            </div>
          </div>

          {/* 当前角度信息显示 */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#FFD700]">水平角度:</span> {angle}°
              </div>
              <div>
                <span className="text-[#FFD700]">垂直角度:</span> {elevation}°
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">视角角度 (0°-360°)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => handleAngleChange(Number(e.target.value))}
                className="flex-1"
              />
              <div className="min-w-[60px] text-center bg-white/10 px-3 py-1 rounded">
                {angle}°
              </div>
            </div>
            <div className="text-xs text-white/60 mt-1">
              0°: 正面 • 90°: 右侧 • 180°: 背面 • 270°: 左侧
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">仰角角度 (-90°至90°)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="-90"
                max="90"
                step="15"
                value={elevation}
                onChange={(e) => handleElevationChange(Number(e.target.value))}
                className="flex-1"
              />
              <div className="min-w-[60px] text-center bg-white/10 px-3 py-1 rounded">
                {elevation}°
              </div>
            </div>
            <div className="text-xs text-white/60 mt-1">
              -90°: 顶部俯视 • 0°: 水平视角 • 90°: 底部仰视
            </div>
          </div>
        </>
      )}

      {settings.viewType === 'perspective' && (
        <div>
          <label className="block mb-2 font-semibold">透视类型</label>
          <select
            value={settings.perspectiveType || 'one-point'}
            onChange={(e) => handlePerspectiveChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-white/20 bg-black/30 text-white focus:outline-none focus:border-[#FFD700]"
          >
            <option value="one-point">一点透视</option>
            <option value="two-point">两点透视</option>
            <option value="three-point">三点透视</option>
          </select>
        </div>
      )}
    </div>
  );
}