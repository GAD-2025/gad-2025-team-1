import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
    // 1. 상태 관리: 불필요한 bio, userType 제거
    const [formData, setFormData] = useState({
        userId: '',
        userPw: '',
        userPwConfirm: '',
        userName: '',
        userEmail: ''
    });
    const [pwError, setPwError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { userId, userPw, userPwConfirm, userName, userEmail } = formData;

        // 유효성 검사
        if (userId.length < 4) {
            alert('아이디는 4글자 이상이어야 합니다.');
            return;
        }
        if (userPw !== userPwConfirm) {
            setPwError(true);
            return;
        }
        setPwError(false);
        
        // 2. 서버로 보낼 데이터 (4가지만 전송)
        const userData = {
            id: userId,
            password: userPw,
            name: userName,
            email: userEmail
        };

        try {
            // 포트 번호 5000번 확인
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (result.success) {
                alert(`${userName}님 가입을 축하합니다! 로그인 페이지로 이동합니다.`);
                navigate('/login');
            } else {
                alert('회원가입 실패: ' + result.message);
            }
        } catch (err) {
            console.error(err);
            alert('서버와 통신 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <div className="signup-header">
                    <Link to="/" className="logo">creAItive</Link>
                    <p className="signup-desc">나만의 창작 우주를 시작해보세요</p>
                </div>

                <form id="signupForm" onSubmit={handleSubmit}>
                    {/* 아이디 */}
                    <div className="form-group">
                        <label className="form-label">아이디 <span className="required">*</span></label>
                        <input type="text" className="form-input" id="userId" 
                               placeholder="4자 이상 입력" required onChange={handleChange} />
                    </div>

                    {/* 비밀번호 */}
                    <div className="form-group">
                        <label className="form-label">비밀번호 <span className="required">*</span></label>
                        <input type="password" className="form-input" id="userPw" 
                               placeholder="비밀번호 입력" required onChange={handleChange}/>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="form-group">
                        <label className="form-label">비밀번호 확인 <span className="required">*</span></label>
                        <input type="password" className="form-input" id="userPwConfirm" 
                               placeholder="비밀번호 재입력" required onChange={handleChange}/>
                        {pwError && <p className="error-msg" style={{display: 'block', color:'red', fontSize:'12px', marginTop:'5px'}}>비밀번호가 일치하지 않습니다.</p>}
                    </div>

                    {/* 이름 */}
                    <div className="form-group">
                        <label className="form-label">이름 (닉네임) <span className="required">*</span></label>
                        <input type="text" className="form-input" id="userName" 
                               placeholder="이름 입력" required onChange={handleChange} />
                    </div>

                    {/* 이메일 */}
                    <div className="form-group">
                        <label className="form-label">이메일 <span className="required">*</span></label>
                        <input type="email" className="form-input" id="userEmail" 
                               placeholder="example@email.com" required onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn-signup">가입하기</button>
                </form>

                <div className="login-link">
                    이미 계정이 있으신가요? <Link to="/login">로그인 하기</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;