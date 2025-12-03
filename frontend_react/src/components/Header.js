import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            // 세션 스토리지에서 저장된 유저 정보 가져오기
            const storedUser = sessionStorage.getItem('currentUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user data from sessionStorage", error);
            sessionStorage.removeItem('currentUser');
        }
    }, [location]); // 페이지가 이동할 때마다 로그인 상태 체크

    const handleLogout = () => {
        // 로그아웃 처리
        sessionStorage.removeItem('currentUser');
        setUser(null);
        alert('로그아웃되었습니다.');
        navigate('/'); // 메인으로 이동
    };

    const getLinkClass = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <header className="main-header">
            <div className="header-section header-left">
                <Link to="/explore" className="header-logo">
                    <span style={{ color: '#FF5900' }}>creAItive</span>
                </Link>
            </div>

            <nav className="header-section header-center">
                <ul className="header-menu">
                    <li><Link to="/marketplace" className={getLinkClass('/marketplace')}>거래하기</Link></li>
                    <li><Link to="/archive" className={getLinkClass('/archive')}>작품보관함</Link></li>
                    <li><Link to="/myspace" className={getLinkClass('/myspace')}>마이 스페이스</Link></li>
                    <li><Link to="/setting" className={getLinkClass('/setting')}>설정</Link></li>
                </ul>
            </nav>

            <div className="header-section header-right">
                {user ? (
                    // ★ 로그인 했을 때: 이름과 로그아웃 버튼을 따로 표시
                    <div className="user-profile-widget" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span className="widget-user-name" style={{ fontWeight: 'bold', color: '#333' }}>
                            {user.nickname}님
                        </span>
                        <button 
                            onClick={handleLogout} 
                            style={{
                                background: 'none',
                                border: '1px solid #ddd',
                                padding: '5px 10px',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                color: '#666'
                            }}
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    // ★ 로그인 안 했을 때
                    <Link to="/login" className="login-button">로그인</Link>
                )}
            </div>
        </header>
    );
};

export default Header;