// src/context/CartContext.js
import React, { createContext, useState, useContext } from 'react';

// 1. 저장소 생성
const CartContext = createContext();

// 2. 저장소 공급자(Provider) 만들기
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]); // 장바구니 데이터

    // 장바구니 추가 (중복 체크)
    const addToCart = (item) => {
        const isExisting = cartItems.find(cartItem => cartItem.id === item.id);
        if (!isExisting) {
            setCartItems([...cartItems, item]);
            return true; // 새로 추가됨
        }
        return false; // 이미 있음
    };

    // 장바구니 삭제
    const removeFromCart = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    // 장바구니에 있는지 확인 (하트 색칠용)
    const isInCart = (id) => {
        return cartItems.some(item => item.id === id);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, isInCart }}>
            {children}
        </CartContext.Provider>
    );
};

// 3. 쉽게 쓰기 위한 훅
export const useCart = () => useContext(CartContext);