import { useState, useEffect } from "react";

// Custom hook để quản lý localStorage
// - key: tên key lưu trong localStorage
// - initialValue: giá trị mặc định nếu key không tồn tại
// Return: [storedValue, setStoredValue] - tương tự useState
export function useLocalStorage(key, initialValue) {
  // State để lưu value, khởi tạo từ localStorage hoặc initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Lấy item từ localStorage
      const item = window.localStorage.getItem(key);

      // Nếu có → parse JSON và return
      // Nếu không → return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Effect để cập nhật localStorage khi storedValue thay đổi
  useEffect(() => {
    try {
      // Convert value thành JSON string rồi lưu vào localStorage
      const valueToStore =
        storedValue instanceof Function
          ? storedValue(storedValue)
          : storedValue;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
