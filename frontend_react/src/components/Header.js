import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext'; 

const Header = () => {
    const navigate = useNavigate();
    const { cartItems } = useCart();
    // setUser를 가져와야 로그아웃 시 상태를 비울 수 있습니다.
    const { user, setUser } = useUser(); 

    // [기능 1] 로고 클릭 시 메인으로 이동 (탐색 페이지 초기화 연동용)
    const handleLogoClick = (e) => {
        e.preventDefault(); 
        navigate('/'); 
        window.scrollTo(0, 0); 
    };

    // [기능 2] 로그아웃 핸들러
    const handleLogout = () => {
        if (window.confirm("로그아웃 하시겠습니까?")) {
            // 1. 브라우저 저장소 비우기 (세션/로컬 스토리지)
            sessionStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            
            // 2. React 상태 비우기 (Context)
            if (setUser) setUser(null);

            // 3. 안내 및 메인으로 이동
            alert("정상적으로 로그아웃 되었습니다.");
            navigate('/');
            
            // 4. 확실한 상태 초기화를 위해 새로고침 (선택 사항)
            window.location.reload(); 
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* 1. 로고 (클릭 시 홈으로) */}
                <a href="/" onClick={handleLogoClick} className="flex items-center">
                    <img 
                        src="/images/logo.png" 
                        alt="creAItive" 
                        style={{ height: '40px', objectFit: 'contain' }} 
                    />
                </a>

                {/* 2. 네비게이션 메뉴 */}
                <nav className="hidden md:flex space-x-8">
                    <Link to="/marketplace" className="text-gray-400 hover:text-white transition">거래하기</Link>
                    <Link to="/archive" className="text-gray-400 hover:text-white transition">작품 보관함</Link>
                    <Link to="/myspace" className="text-gray-400 hover:text-white transition">마이스페이스</Link>
                    <Link to="/setting" className="text-gray-400 hover:text-white transition">설정</Link>
                </nav>

                {/* 3. 우측 아이콘 및 유저 정보 */}
                <div className="flex items-center gap-4">
                    {/* 장바구니 */}
                    <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
                        🛒 <span className="text-orange-500 text-xs font-bold">{cartItems.length}</span>
                    </div>

                    {/* 로그인 상태 분기 */}
                    {user ? (
                        <div className="flex items-center gap-3">
                            {/* 코인 잔액 */}
                            <div className="bg-gray-800 px-3 py-1 rounded-full border border-gray-700 flex items-center gap-1">
                                <span className="text-yellow-400">🪙</span>
                                <span className="text-white font-bold text-sm">
                                    {user.coins ? user.coins.toLocaleString() : 0}
                                </span>
                            </div>
                            
                            {/* 닉네임 */}
                            <span className="text-sm font-bold text-orange-500">{user.nickname}님</span>
                            
                            {/* ★ [추가됨] 로그아웃 버튼 */}
                            <button 
                                onClick={handleLogout}
                                className="ml-2 px-2 py-1 text-xs text-gray-400 border border-gray-600 rounded hover:text-white hover:bg-gray-700 transition"
                            >
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        // 비로그인 시 로그인 버튼
                        <Link to="/login" className="bg-orange-600 px-4 py-1.5 rounded font-bold text-sm text-white hover:bg-orange-700 transition">
                            로그인
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;