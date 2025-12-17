import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [loginId, setLoginId] = useState('');
    const [loginPw, setLoginPw] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: loginId, password: loginPw })
            });

            const result = await response.json();

            if (result.success) {
                sessionStorage.setItem('currentUser', JSON.stringify(result.user));
                alert(`${result.user.nickname}님 환영합니다!`);
                navigate('/myspace');
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error(err);
            setError('서버와 연결할 수 없습니다. 서버가 켜져있는지 확인해주세요.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <Link to="/" className="logo">creAItive</Link>
                    <p className="login-desc">다시 만나서 반가워요!</p>
                </div>

                <form id="loginForm" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">아이디</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            id="loginId" 
                            placeholder="아이디 입력" 
                            required 
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            onFocus={() => setError('')}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">비밀번호</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            id="loginPw" 
                            placeholder="비밀번호 입력" 
                            required 
                            value={loginPw}
                            onChange={(e) => setLoginPw(e.target.value)}
                            onFocus={() => setError('')}
                        />
                    </div>

                    {error && <div className="error-msg" style={{display: 'block'}}><i className="fas fa-exclamation-circle"></i> {error}</div>}

                    <button type="submit" className="btn-login">로그인</button>
                </form>

                <div className="bottom-links">
                    <Link to="#">아이디 찾기</Link>
                    <Link to="#">비밀번호 찾기</Link>
                </div>

                <div className="signup-link-area">
                    아직 회원이 아니신가요? <Link to="/signup">회원가입 하기</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
