import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // [1] 장바구니 데이터 가져오기

const Header = () => {
    // [2] Context에서 실시간 장바구니 목록(cartItems) 가져오기
    const { cartItems } = useCart(); 
    
    // 기존 유저 로그인 로직 유지
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // 로그인 세션 체크 (팀원 코드 유지)
    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem('currentUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user data", error);
            sessionStorage.removeItem('currentUser');
        }
    }, [location]);

    // 로그아웃 처리 (팀원 코드 유지)
    const handleLogout = () => {
        sessionStorage.removeItem('currentUser');
        setUser(null);
        alert('로그아웃되었습니다.');
        navigate('/'); 
    };

    // 활성화 메뉴 디자인 함수
    const getLinkClass = (path) => {
        const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
        
        return isActive 
            ? "text-white font-bold border-b-2 border-orange-600 pb-1" 
            : "text-gray-400 hover:text-white transition font-medium"; 
    };

    return (
        <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                
                {/* 1. 로고 */}
                <div className="flex-shrink-0">
                    <Link to="/" className="text-2xl font-extrabold text-orange-600 cursor-pointer hover:opacity-80 transition">
                        creAItive
                    </Link>
                </div>

                {/* 2. 네비게이션 메뉴 */}
                <nav className="hidden md:flex space-x-8">
                    <Link to="/marketplace" className={getLinkClass('/marketplace')}>거래하기</Link>
                    <Link to="/archive" className={getLinkClass('/archive')}>작품 보관함</Link>
                    <Link to="/myspace" className={getLinkClass('/myspace')}>마이스페이스</Link>
                    <Link to="/setting" className={getLinkClass('/setting')}>설정</Link>
                </nav>

                {/* 3. 우측 아이콘 및 로그인/로그아웃 */}
                <div className="flex items-center space-x-6">
                    
                    {/* [수정됨] 장바구니 아이콘: 링크 연결 및 실시간 개수 표시 */}
                    <Link to="/cart">
                        <div className="relative cursor-pointer group" title="장바구니">
                            <span className="text-2xl text-gray-400 group-hover:text-white transition">🛒</span>
                            
                            {/* 장바구니에 담긴 개수 (Context 데이터 반영) */}
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                                    {cartItems.length}
                                </span>
                            )}
                        </div>
                    </Link>

                    {/* 로그인 상태에 따른 버튼 표시 */}
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-white text-sm font-bold">
                                {user.nickname}님
                            </span>
                            <button 
                                onClick={handleLogout} 
                                className="text-xs text-gray-400 border border-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-800 hover:text-white transition"
                            >
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <button className="bg-orange-600 text-white px-5 py-2 font-bold rounded-lg text-sm hover:bg-orange-700 transition">
                                로그인
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;