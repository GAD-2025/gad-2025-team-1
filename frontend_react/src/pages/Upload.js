import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ★ axios 추가
import spaceBackground from '../assets/space_background.jpg'; 
import './Upload.css'; 

const Upload = () => {
    const navigate = useNavigate();
    
    // --- [State] ---
    const [activeKeyword, setActiveKeyword] = useState('일러스트');
    const [isPublic, setIsPublic] = useState(true);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null); // ★ 실제 파일 객체 저장용
    
    // 입력 필드 상태
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [aiTool, setAiTool] = useState('');
    const [aiRate, setAiRate] = useState('');
    const [prompt, setPrompt] = useState('');
    
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const categories = ['일러스트', '그래픽', '3D', '사진', '아이콘', '템플릿'];
    const mainColor = '#FF6B00';
    
    const pageStyle = {
        backgroundImage: `url(${spaceBackground})`,
        backgroundColor: '#000',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        position: 'relative',
        color: '#fff'
    };

    const boxStyle = { 
        border: 'none', borderRadius: '8px', padding: '20px', marginBottom: '20px', 
        textAlign: 'left', backgroundColor: '#fff', color: '#333', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' 
    };
    const labelStyle = { fontWeight: 'bold', marginBottom: '10px', color: '#333', display: 'block' };
    const inputStyle = { width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', color: '#000', outline: 'none' };
    const textAreaStyle = { ...inputStyle, height: '80px', resize: 'none' };

    // --- [Handlers] ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // ★ 파일 객체 저장
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setPreviewImage(null);
        setImageFile(null);
    };

    const handleUploadBoxClick = () => {
        document.getElementById('imageInput').click();
    };

    const handleAiPriceClick = () => {
        if(!price) {
            alert("가격을 먼저 입력해주세요.");
            return;
        }
        alert(`AI 분석 결과: 적정가는 ${parseInt(price) * 1.1}원 입니다.`);
    };

    // ★ [핵심] 서버로 데이터 전송
    const handleSubmit = async () => {
        // 1. 유효성 검사
        if (!imageFile) return alert('이미지를 업로드해주세요.');
        if (!price) return alert('가격을 입력해주세요.');

        // 2. 로그인된 유저 확인
        const storedUser = sessionStorage.getItem('currentUser');
        if (!storedUser) return alert('로그인이 필요합니다.');
        const user = JSON.parse(storedUser);

        // 3. FormData 생성 (이미지 파일 전송용)
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('userId', user.username);
        formData.append('title', description ? description.substring(0, 20) : '제목 없음'); // 제목은 설명 앞부분으로 대체하거나 별도 입력 받아야 함
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', activeKeyword);
        formData.append('ai_tool', aiTool);
        formData.append('ai_ratio', aiRate);
        formData.append('prompt', prompt);
        formData.append('is_public', isPublic);

        try {
            // 4. API 호출
            const response = await axios.post(process.env.REACT_APP_API_BASE_URL + '/api/artworks/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setShowSuccessModal(true);
            } else {
                alert('업로드에 실패했습니다.');
            }
        } catch (error) {
            console.error('업로드 에러:', error);
            alert('서버 오류가 발생했습니다.');
        }
    };

    const handleModalConfirm = () => {
        setShowSuccessModal(false);
        navigate('/archive'); // 보관함으로 이동
    };

    return (
        <div className="upload-page" style={pageStyle}>
            <Header /> 
            <main className="upload-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <button onClick={() => navigate('/archive')} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '10px', color: '#fff' }}>&lt;</button>
                    <h1 className="upload-title" style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#fff' }}>작품 업로드</h1>
                </div>

                <div style={{ display: 'flex', gap: '30px', flexDirection: 'column' }}>
                    <section style={boxStyle}>
                        <div className="form-label" style={labelStyle}>작품 이미지</div>
                        <div className="upload-box-container" onClick={handleUploadBoxClick}
                             style={{ border: '2px dashed #ddd', borderRadius: '8px', minHeight: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', backgroundColor: '#fafafa', position: 'relative', overflow: 'hidden' }}>
                            {!previewImage ? (
                                <div style={{ textAlign: 'center', color: '#888' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>📷</div>
                                    <p>이미지를 업로드하려면 클릭하세요</p>
                                </div>
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <img src={previewImage} alt="미리보기" style={{ maxHeight: '400px', maxWidth: '100%', objectFit: 'contain' }} />
                                    <button onClick={handleRemoveImage} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>✕</button>
                                </div>
                            )}
                            <input type="file" id="imageInput" accept="image/*" style={{display: 'none'}} onChange={handleImageUpload} />
                        </div>
                    </section>

                    <section className="artwork-info-section">
                        <div style={boxStyle}>
                            <div className="form-label" style={labelStyle}>카테고리 선택</div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                {categories.map(keyword => (
                                    <button key={keyword} onClick={() => setActiveKeyword(keyword)}
                                            style={{ padding: '8px 16px', borderRadius: '20px', border: `1px solid ${activeKeyword === keyword ? mainColor : '#ddd'}`, backgroundColor: activeKeyword === keyword ? mainColor : '#fff', color: activeKeyword === keyword ? '#fff' : '#666', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}>
                                        {keyword}
                                    </button>
                                ))}
                            </div>
                            <div className="form-label" style={labelStyle}>작품 설명 (제목으로 사용됨)</div>
                            <textarea placeholder="작품에 대한 간단한 설명을 입력해주세요..." value={description} onChange={(e) => setDescription(e.target.value)} style={textAreaStyle} />
                        </div>

                        <div style={boxStyle}>
                            <div className="form-label" style={labelStyle}>가격 정보</div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input type="number" placeholder="가격 입력 (원)" value={price} onChange={(e) => setPrice(e.target.value)} style={{ ...inputStyle, flex: 1, height: '45px' }} />
                                <button onClick={handleAiPriceClick} style={{ height: '45px', padding: '0 20px', backgroundColor: mainColor, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>AI 가격 제안</button>
                            </div>
                        </div>

                        <div style={boxStyle}>
                            <div className="form-label" style={labelStyle}>판매자 자체 제작률</div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="text" placeholder="AI 사용 툴 (예: Midjourney)" value={aiTool} onChange={(e) => setAiTool(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                                <input type="text" placeholder="AI 사용 비율 (예: 80%)" value={aiRate} onChange={(e) => setAiRate(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                            </div>
                        </div>

                        <div style={boxStyle}>
                            <div className="form-label" style={labelStyle}>프롬프트 입력</div>
                            <textarea placeholder="생성에 사용된 프롬프트를 입력해주세요..." value={prompt} onChange={(e) => setPrompt(e.target.value)} style={textAreaStyle} />
                        </div>

                        <div style={{ ...boxStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="form-label" style={{...labelStyle, marginBottom: 0}}>작품 공개 설정</div>
                            <button onClick={() => setIsPublic(!isPublic)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 20px', borderRadius: '20px', border: '1px solid #ddd', background: isPublic ? '#E3F2FD' : 'white', color: isPublic ? '#1976D2' : '#666', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                                {isPublic ? '공개' : '비공개'} 👁
                            </button>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                            <button onClick={handleSubmit} style={{ width: '100%', padding: '15px 0', backgroundColor: mainColor, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 6px rgba(255, 107, 0, 0.4)' }}>
                                작품 업로드 완료
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {showSuccessModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', width: '300px', boxShadow: '0 5px 20px rgba(0,0,0,0.3)' }}>
                        <div style={{ fontSize: '40px', marginBottom: '20px' }}>🎉</div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>작품 접수 완료!</h3>
                        <p style={{ color: '#666', marginBottom: '30px' }}>작품이 성공적으로 접수되었습니다.</p>
                        <button onClick={handleModalConfirm} style={{ width: '100%', padding: '12px', backgroundColor: mainColor, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>확인</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Upload;