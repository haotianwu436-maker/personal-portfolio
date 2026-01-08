import { useState, useCallback } from "react";

const EDIT_PASSWORD = "admin123"; // 编辑密码，可以改成你想要的密码
const PASSWORD_STORAGE_KEY = "edit-password-verified";
const PASSWORD_EXPIRY_TIME = 30 * 60 * 1000; // 30分钟过期

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
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsVerified(false);
    localStorage.removeItem(PASSWORD_STORAGE_KEY);
  }, []);

  const refresh = useCallback(() => {
    if (isVerified) {
      localStorage.setItem(
        PASSWORD_STORAGE_KEY,
        JSON.stringify({ timestamp: Date.now() })
      );
    }
  }, [isVerified]);

  return {
    isVerified,
    verify,
    logout,
    refresh,
  };
}
