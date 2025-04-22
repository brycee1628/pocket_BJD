// 密碼驗證系統

// 用於暫時存儲驗證狀態的變數
let isAuthenticated = false;
let authExpireTime = 0;

// 驗證密碼
export const verifyPassword = (password) => {

    const correctPassword = String.fromCharCode(101, 57, 56, 56, 48, 49, 50, 49);

    // 直接比較輸入密碼和正確密碼
    if (password === correctPassword) {
        // 設置驗證狀態為有效，並設置有效期為10分鐘
        isAuthenticated = true;
        authExpireTime = Date.now() + 10 * 60 * 1000; // 10分鐘有效期
        return true;
    }
    return false;
};

// 檢查是否已驗證且在有效期內
export const isValidAuth = () => {
    // 檢查驗證狀態和有效期
    return isAuthenticated && Date.now() < authExpireTime;
};

// 登出/失效驗證
export const clearAuth = () => {
    isAuthenticated = false;
    authExpireTime = 0;
}; 