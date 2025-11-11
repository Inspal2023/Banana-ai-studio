import { useState, useCallback } from 'react';

// 卡密状态接口
export interface KeyState {
  currentKey: string | null;
  balance: number;
  credit: number;
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
}

// API响应接口
export interface KeyAPIResponse {
  success: boolean;
  data?: {
    key_string: string;
    balance?: number;
    credit: number;
    original_credit?: number;  // 原始面额
    status: string;
    activated_at?: string;
    remaining_balance?: number;
    balance_before?: number;
    deduct_amount?: number;
    balance_after?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  warning?: {
    code: string;
    message: string;
    current_balance?: number;
  };
  timestamp?: string;
}

// 内存中的卡密管理器（无状态模式）
class KeySessionManager {
  private state: KeyState = {
    currentKey: null,
    balance: 0,
    credit: 0,
    isValid: false,
    isLoading: false,
    error: null
  };

  private listeners: ((state: KeyState) => void)[] = [];

  getState(): KeyState {
    return { ...this.state };
  }

  setState(newState: Partial<KeyState>) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  setKeyInfo(keyString: string, balance: number, credit: number) {
    this.setState({
      currentKey: keyString,
      balance,
      credit,
      isValid: true,
      error: null
    });
  }

  clearKeyInfo() {
    this.setState({
      currentKey: null,
      balance: 0,
      credit: 0,
      isValid: false,
      error: null
    });
  }

  hasValidKey(): boolean {
    return this.state.isValid && this.state.balance >= 10;
  }

  subscribe(listener: (state: KeyState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }
}

// 全局实例
const keyManager = new KeySessionManager();

// API服务类
class KeyAPIService {
  private baseURL = 'https://gxjjaruksjnhdiixqtae.supabase.co/functions/v1';
  private apikey = 'sbp_02b18b02d805a47ae2a3ef8d8ecfd90205dd1662';
  private serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4amphcnVrc2puaGRpaXhxdGFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTYyODk4NSwiZXhwIjoyMDc3MjA0OTg1fQ.HzEUyKaBOKXNVot5VAOpDdHARqkWwOppSgAcZP1MXY8';
  private readonly TEST_MODE = false; // 生产模式，使用真实API

  async callAPI(endpoint: string, data: any): Promise<KeyAPIResponse> {
    // 测试模式：返回模拟响应
    if (this.TEST_MODE) {
      return this.getMockResponse(endpoint, data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.serviceKey}`,
          'apikey': this.apikey
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      throw new Error(`API调用失败: ${error}`);
    }
  }

  // 获取模拟响应（用于测试和演示）
  private getMockResponse(endpoint: string, data: any): KeyAPIResponse {
    const keyString = data.key_string;
    
    // 模拟成功激活的卡密
    if (keyString && keyString.length >= 8) {
      if (endpoint === '/activate-key') {
        // 模拟激活卡密
        const mockBalance = Math.floor(Math.random() * 500) + 500; // 500-1000
        return {
          success: true,
          data: {
            key_string: keyString,
            credit: mockBalance,
            balance: mockBalance,
            original_credit: mockBalance,
            status: "active",
            activated_at: new Date().toISOString()
          }
        };
      } else if (endpoint === '/balance') {
        // 模拟查询余额或扣除积分
        let currentBalance = Math.floor(Math.random() * 500) + 500; // 500-1000
        let originalCredit = 1000;
        
        // 如果是扣除积分
        if (data.deduct_amount) {
          const newBalance = Math.max(0, currentBalance - data.deduct_amount);
          
          return {
            success: true,
            data: {
              key_string: keyString,
              balance: newBalance,
              credit: newBalance,
              original_credit: originalCredit,
              status: "active",
              activated_at: new Date().toISOString(),
              remaining_balance: newBalance
            },
            warning: newBalance < 10 ? {
              code: "LOW_BALANCE_WARNING",
              message: "余额不足10，请及时充值",
              current_balance: newBalance
            } : undefined
          };
        } else {
          // 模拟查询余额
          return {
            success: true,
            data: {
              key_string: keyString,
              balance: currentBalance,
              credit: originalCredit,
              original_credit: originalCredit,
              status: "active",
              activated_at: new Date().toISOString()
            }
          };
        }
      }
    }
    
    // 模拟卡密不存在
    return {
      success: false,
      error: {
        code: "KEY_NOT_FOUND",
        message: "你的卡密输入错误，请确认"
      }
    };
  }

  // 激活卡密
  async activateKey(keyString: string): Promise<KeyAPIResponse> {
    return this.callAPI('/activate-key', { key_string: keyString });
  }

  // 查询余额
  async checkBalance(keyString: string): Promise<KeyAPIResponse> {
    return this.callAPI('/balance', { key_string: keyString });
  }

  // 扣除积分
  async deductCredits(keyString: string, amount: number = 10): Promise<KeyAPIResponse> {
    return this.callAPI('/balance', {
      key_string: keyString,
      deduct_amount: amount
    });
  }
}

const keyAPI = new KeyAPIService();

// 错误处理
function handleKeyAPIError(error: any): string {
  switch (error.code) {
    case 'UNAUTHORIZED':
      return 'API认证失败，请检查配置';
    case 'KEY_NOT_FOUND':
      return '卡密不存在，请检查输入';
    case 'KEY_NOT_ACTIVATED':
      return '卡密未激活，正在尝试激活...';
    case 'INSUFFICIENT_BALANCE':
      return `余额不足，当前余额：${error.current_balance}`;
    case 'ALREADY_ACTIVATED':
      return '卡密已激活，可直接使用';
    case 'HTTP_ERROR':
      return '请求错误，请重试';
    case 'NETWORK_ERROR':
      return '网络错误，请检查网络连接';
    default:
      return error.message || '系统错误，请稍后重试';
  }
}

export function useKeyManagement() {
  const [state, setState] = useState<KeyState>(keyManager.getState());

  // 订阅状态更新
  const subscribeToUpdates = useCallback(() => {
    return keyManager.subscribe(setState);
  }, []);

  // 验证并使用卡密
  const validateAndUseKey = useCallback(async (keyString: string): Promise<boolean> => {
    if (!keyString.trim()) {
      setState(prev => ({ ...prev, error: '请输入卡密' }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 先查询卡密状态
      const balanceResponse = await keyAPI.checkBalance(keyString);
      
      if (balanceResponse.success) {
        // 卡密已激活
        if (balanceResponse.data!.balance >= 10) {
          keyManager.setKeyInfo(
            keyString,
            balanceResponse.data!.balance,
            balanceResponse.data!.original_credit ?? balanceResponse.data!.credit
          );
          setState(keyManager.getState());
          return true;
        } else {
          const errorMsg = `余额不足，当前余额：${balanceResponse.data!.balance}`;
          setState(prev => ({ ...prev, error: errorMsg, isLoading: false }));
          return false;
        }
      } else if (balanceResponse.error?.code === 'KEY_NOT_ACTIVATED') {
        // 卡密未激活，执行激活
        const activateResponse = await keyAPI.activateKey(keyString);
        if (activateResponse.success) {
          keyManager.setKeyInfo(
            keyString,
            activateResponse.data!.balance,
            activateResponse.data!.original_credit ?? activateResponse.data!.credit
          );
          setState(keyManager.getState());
          return true;
        } else {
          const errorMsg = activateResponse.error ? 
            handleKeyAPIError(activateResponse.error) : 
            '激活失败，请重试';
          setState(prev => ({ ...prev, error: errorMsg, isLoading: false }));
          return false;
        }
      } else {
        const errorMsg = balanceResponse.error ? 
          handleKeyAPIError(balanceResponse.error) : 
          '查询失败，请重试';
        setState(prev => ({ ...prev, error: errorMsg, isLoading: false }));
        return false;
      }
    } catch (error) {
      const errorMsg = '网络错误，请重试';
      setState(prev => ({ ...prev, error: errorMsg, isLoading: false }));
      return false;
    }
  }, []);

  // 扣除积分（生图时调用）
  const deductCredits = useCallback(async (amount: number = 10): Promise<{ success: boolean; warning?: string }> => {
    if (!keyManager.hasValidKey()) {
      return { success: false };
    }

    const currentKey = keyManager.getState().currentKey;
    if (!currentKey) {
      return { success: false };
    }

    try {
      const deductResponse = await keyAPI.deductCredits(currentKey, amount);
      
      if (deductResponse.success) {
        // 更新内存中的余额信息
        const newBalance = deductResponse.data!.remaining_balance ?? deductResponse.data!.balance_after ?? deductResponse.data!.balance;
        // 获取原始面额（优先使用 original_credit，其次使用 credit）
        const originalCredit = deductResponse.data!.original_credit ?? deductResponse.data!.credit;
        const newCredit = originalCredit;
        
        keyManager.setKeyInfo(
          currentKey,
          newBalance,
          newCredit
        );
        setState(keyManager.getState());

        // 返回警告信息（如果有）
        return {
          success: true,
          warning: deductResponse.warning?.message
        };
      } else {
        // 扣费失败，清除卡密状态
        keyManager.clearKeyInfo();
        setState(keyManager.getState());
        return { success: false };
      }
    } catch (error) {
      // 网络错误，清除卡密状态
      keyManager.clearKeyInfo();
      setState(keyManager.getState());
      return { success: false };
    }
  }, []);

  // 更换卡密
  const changeKey = useCallback(() => {
    keyManager.clearKeyInfo();
    setState(keyManager.getState());
  }, []);

  // 检查余额是否足够生图
  const canGenerateImage = useCallback((): boolean => {
    return keyManager.hasValidKey();
  }, []);

  // 获取余额信息
  const getBalanceInfo = useCallback(() => {
    return {
      balance: keyManager.getState().balance,
      credit: keyManager.getState().credit,
      canGenerate: keyManager.hasValidKey()
    };
  }, []);

  return {
    state,
    validateAndUseKey,
    deductCredits,
    changeKey,
    canGenerateImage,
    getBalanceInfo,
    subscribeToUpdates
  };
}