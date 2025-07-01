import { useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // 로컬 스토리지에서 초기값 가져오기
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue; // 서버 사이드에서는 초기값 반환
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 값 업데이트 함수
  const setValue = (value: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`로컬스토리지를 읽는 과정에서 오류 발생 "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
