import { useState, useCallback } from "react";

const EDIT_PASSWORD = "dlxbxy"; // 编辑密码，可以改成你想要的密码
const PASSWORD_STORAGE_KEY = "edit-password-verified";
const PASSWORD_STORAGE_PASSWORD_KEY = "edit-password-value";
const PASSWORD_EXPIRY_TIME = 30 * 60 * 1000; // 30分钟过期

// 编辑密码只能编辑，不能发布
// 如果需要发布权限，需要额外的发布密码（暂未实现）
export function useEditPassword() {
  const [isVerified, setIsVerified] = useState(() => {
    // 检查是否已验证且未过期
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(PASSWORD_STORAGE_KEY);
    if (!stored) return false;
    
    const { timestamp } = JSON.parse(stored);
    const now = Date.now();
    if (now - timestamp > PASSWORD_EXPIRY_TIME) {
      localStorage.removeItem(PASSWORD_STORAGE_KEY);
      localStorage.removeItem(PASSWORD_STORAGE_PASSWORD_KEY);
      return false;
    }
    return true;
  });

  const verify = useCallback((password: string): boolean => {
    if (password === EDIT_PASSWORD) {
      setIsVerified(true);
      localStorage.setItem(
        PASSWORD_STORAGE_KEY,
        JSON.stringify({ timestamp: Date.now() })
      );
      // 存储密码供后端验证
      localStorage.setItem(PASSWORD_STORAGE_PASSWORD_KEY, password);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsVerified(false);
    localStorage.removeItem(PASSWORD_STORAGE_KEY);
    localStorage.removeItem(PASSWORD_STORAGE_PASSWORD_KEY);
  }, []);

  const refresh = useCallback(() => {
    if (isVerified) {
      localStorage.setItem(
        PASSWORD_STORAGE_KEY,
        JSON.stringify({ timestamp: Date.now() })
      );
    }
  }, [isVerified]);

  // 编辑密码只能编辑，不能发布
  const canPublish = false;

  // 获取存储的密码
  const getPassword = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(PASSWORD_STORAGE_PASSWORD_KEY);
  }, []);

  return {
    isVerified,
    verify,
    logout,
    refresh,
    canPublish, // 始终为 false，编辑密码不能发布
    getPassword, // 返回存储的密码供API调用使用
  };
}
