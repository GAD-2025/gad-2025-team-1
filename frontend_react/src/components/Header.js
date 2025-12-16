import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext'; // ★ UserContext 추가

const Header = () => {
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const { user } = useUser(); // ★ 유저 정보 가져오기

    return (
        <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* 1. 로고 이미지 변경 */}
                <Link to="/" className="flex items-center">
                    <img 
                        src="/images/logo.png" 
                        alt="creAItive" 
                        style={{ height: '40px', objectFit: 'contain' }} // 높이 조절 가능
                    />
                </Link>

                <nav className="hidden md:flex space-x-8">
                    <Link to="/marketplace" className="text-gray-400 hover:text-white transition">거래하기</Link>
                    <Link to="/archive" className="text-gray-400 hover:text-white transition">작품 보관함</Link>
                    <Link to="/myspace" className="text-gray-400 hover:text-white transition">마이스페이스</Link>
                    <Link to="/setting" className="text-gray-400 hover:text-white transition">설정</Link>
                </nav>

                <div className="flex items-center gap-4">
                    {/* 장바구니 */}
                    <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
                        🛒 <span className="text-orange-500 text-xs font-bold">{cartItems.length}</span>
                    </div>

                    {/* 2. 로그인 상태 및 코인 잔액 표시 */}
                    {user ? (
                        <div className="flex items-center gap-3">
                            {/* 코인 잔액 표시 */}
                            <div className="bg-gray-800 px-3 py-1 rounded-full border border-gray-700 flex items-center gap-1">
                                <span className="text-yellow-400">🪙</span>
                                <span className="text-white font-bold text-sm">
                                    {user.coins.toLocaleString()}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-orange-500">{user.nickname}님</span>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-orange-600 px-4 py-1.5 rounded font-bold text-sm text-white">로그인</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;