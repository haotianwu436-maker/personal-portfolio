import { useState, useCallback } from "react";

const EDIT_PASSWORD = "dlxbxy"; // 编辑密码
const PUBLISH_PASSWORD = "dlxbxy"; // 发布密码
const PASSWORD_STORAGE_KEY = "edit-password-verified";
const PASSWORD_STORAGE_PASSWORD_KEY = "edit-password-value";
const PUBLISH_PASSWORD_STORAGE_KEY = "publish-password-verified";
const PUBLISH_PASSWORD_STORAGE_PASSWORD_KEY = "publish-password-value";
const PASSWORD_EXPIRY_TIME = 30 * 60 * 1000; // 30分钟过期

// 编辑密码和发布密码都是dlxbxy
// 编辑密码：用于创建、编辑、删除文章
// 发布密码：用于发布草稿文章
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

  // 检查是否已验证发布密码
  const [isPublishVerified, setIsPublishVerified] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(PUBLISH_PASSWORD_STORAGE_KEY);
    if (!stored) return false;
    
    const { timestamp } = JSON.parse(stored);
    const now = Date.now();
    if (now - timestamp > PASSWORD_EXPIRY_TIME) {
      localStorage.removeItem(PUBLISH_PASSWORD_STORAGE_KEY);
      localStorage.removeItem(PUBLISH_PASSWORD_STORAGE_PASSWORD_KEY);
      return false;
    }
    return true;
  });

  // 验证发布密码
  const verifyPublish = useCallback((password: string): boolean => {
    if (password === PUBLISH_PASSWORD) {
      setIsPublishVerified(true);
      localStorage.setItem(
        PUBLISH_PASSWORD_STORAGE_KEY,
        JSON.stringify({ timestamp: Date.now() })
      );
      localStorage.setItem(PUBLISH_PASSWORD_STORAGE_PASSWORD_KEY, password);
      return true;
    }
    return false;
  }, []);

  // 发布密码验证成功后可以发布
  const canPublish = isPublishVerified;

  // 获取存储的密码
  const getPassword = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(PASSWORD_STORAGE_PASSWORD_KEY);
  }, []);

  // 获取存储的发布密码
  const getPublishPassword = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(PUBLISH_PASSWORD_STORAGE_PASSWORD_KEY);
  }, []);

  // 退出发布密码
  const logoutPublish = useCallback(() => {
    setIsPublishVerified(false);
    localStorage.removeItem(PUBLISH_PASSWORD_STORAGE_KEY);
    localStorage.removeItem(PUBLISH_PASSWORD_STORAGE_PASSWORD_KEY);
  }, []);

  return {
    isVerified,
    verify,
    logout,
    refresh,
    canPublish,
    getPassword,
    // 发布相关
    isPublishVerified,
    verifyPublish,
    getPublishPassword,
    logoutPublish,
  };
}
