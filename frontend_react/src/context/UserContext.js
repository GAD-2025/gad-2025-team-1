// src/context/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 1. 초기화: 세션 스토리지 확인 및 코인 초기화
  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // 만약 코인 정보가 없다면 가입 축하금 20,000 코인 지급
      if (parsedUser.coins === undefined) {
        parsedUser.coins = 20000;
        sessionStorage.setItem('currentUser', JSON.stringify(parsedUser));
      }
      setUser(parsedUser);
    }
  }, []);

  // 2. 로그인 함수
  const login = (userData) => {
    // 로그인 시 기본 코인 20,000 설정 (DB 연동 전 임시 로직)
    const userWithCoins = { ...userData, coins: userData.coins || 20000 };
    setUser(userWithCoins);
    sessionStorage.setItem('currentUser', JSON.stringify(userWithCoins));
  };

  // 3. 로그아웃 함수
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
  };

  // 4. ★ 코인 차감 함수 (구매 시 호출)
  const deductCoins = (amount) => {
    if (!user) return false;
    if (user.coins < amount) {
      alert("코인이 부족합니다!");
      return false;
    }

    const newCoins = user.coins - amount;
    const updatedUser = { ...user, coins: newCoins };
    
    setUser(updatedUser);
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return true; // 구매 성공
  };

  return (
    <UserContext.Provider value={{ user, login, logout, deductCoins }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);