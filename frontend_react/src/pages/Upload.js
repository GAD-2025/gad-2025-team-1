import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import spaceBackground from '../assets/space_background.jpg'; // 배경 이미지 경로 (실제 경로에 맞게 수정 필요)
import './Upload.css'; 

const Upload = () => {
    const navigate = useNavigate();
    
    // --- [State] ---
    const [activeKeyword, setActiveKeyword] = useState('일러스트');
    const [isPublic, setIsPublic] = useState(true);
    const [previewImage, setPreviewImage] = useState(null);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [aiTool, setAiTool] = useState('');
    const [aiRate, setAiRate] = useState('');
    const [prompt, setPrompt] = useState('');
    
    // 모달 상태
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // 카테고리 목록
    const categories = ['일러스트', '그래픽', '3D', '사진', '아이콘', '템플릿'];

    // --- [Styles] ---
    const mainColor = '#FF6B00';
    
    // 배경 스타일: 검은색 베이스에 우주 이미지를 덮음
    const pageStyle = {
        backgroundImage: `url(${spaceBackground})`,
        backgroundColor: '#000', // 흰색이 비치지 않게 검은색으로 설정
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        position: 'relative',
        color: '#fff' // 전체 텍스트 기본 흰색 (타이틀용)
    };

    // 입력 폼 스타일 (흰색 박스 유지)
    const boxStyle = { 
        border: 'none', 
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '20px', 
        textAlign: 'left', 
        backgroundColor: '#fff', // 컨텐츠 박스는 흰색
        color: '#333', // 박스 내부 글씨는 검은색
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)' // 어두운 배경 위라 그림자 추가
    };
    
    const labelStyle = { fontWeight: 'bold', marginBottom: '10px', color: '#333', display: 'block' };
    const inputStyle = { width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', color: '#000', outline: 'none' };
    const textAreaStyle = { ...inputStyle, height: '80px', resize: 'none' };

    // --- [Handlers] ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
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

    const handleSubmit = () => {
        if (!previewImage) {
            alert('이미지를 업로드해주세요.');
            return;
        }
        
        // 데이터 전송 로직 (생략)
        
        // 모달 띄우기
        setShowSuccessModal(true);
    };

    const handleModalConfirm = () => {
        setShowSuccessModal(false);
        navigate('/archive');
    };

    return (
        <div className="upload-page" style={pageStyle}>
            {/* Header 컴포넌트 내부 스타일이 투명 혹은 적절하게 처리되어 있다고 가정 */}
            <Header /> 
            
            <main className="upload-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
                {/* 상단 네비게이션 (흰색 텍스트) */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <button onClick={() => navigate('/archive')} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '10px', color: '#fff' }}>&lt;</button>
                    <h1 className="upload-title" style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#fff' }}>작품 업로드</h1>
                </div>

                <div style={{ display: 'flex', gap: '30px', flexDirection: 'column' }}>
                    
                    {/* 1. 이미지 업로드 섹션 */}
                    <section style={boxStyle}>
                        <div className="form-label" style={labelStyle}>작품 이미지</div>
                        <div className="upload-box-container" 
                             onClick={handleUploadBoxClick}
                             style={{ 
                                 border: '2px dashed #ddd', 
                                 borderRadius: '8px', 
                                 minHeight: '300px', 
                                 display: 'flex', 
                                 justifyContent: 'center', 
                                 alignItems: 'center', 
                                 cursor: 'pointer',
                                 backgroundColor: '#fafafa',
                                 position: 'relative',
                                 overflow: 'hidden'
                             }}>
                            
                            {!previewImage ? (
                                <div style={{ textAlign: 'center', color: '#888' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>📷</div>
                                    <p>이미지를 업로드하려면 클릭하세요</p>
                                </div>
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <img src={previewImage} alt="미리보기" style={{ maxHeight: '400px', maxWidth: '100%', objectFit: 'contain' }} />
                                    <button onClick={handleRemoveImage} 
                                            style={{ 
                                                position: 'absolute', top: '10px', right: '10px', 
                                                background: 'rgba(0,0,0,0.5)', color: 'white', 
                                                border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' 
                                            }}>✕</button>
                                </div>
                            )}
                            <input type="file" id="imageInput" accept="image/*" style={{display: 'none'}} onChange={handleImageUpload} />
                        </div>
                    </section>

                    {/* 2. 정보 입력 섹션 */}
                    <section className="artwork-info-section">
                        
                        {/* 카테고리 & 설명 */}
                        <div style={boxStyle}>
                            <div className="form-label" style={labelStyle}>카테고리 선택</div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                {categories.map(keyword => (
                                    <button 
                                        key={keyword}
                                        onClick={() => setActiveKeyword(keyword)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            border: `1px solid ${activeKeyword === keyword ? mainColor : '#ddd'}`,
                                            backgroundColor: activeKeyword === keyword ? mainColor : '#fff',
                                            color: activeKeyword === keyword ? '#fff' : '#666',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {keyword}
                                    </button>
                                ))}
                            </div>

                            <div className="form-label" style={labelStyle}>작품 설명</div>
                            <textarea 
                                placeholder="활용 분야, 작품 설명을 입력해주세요..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={textAreaStyle}
                            />
                        </div>

                        {/* 가격 정보 */}
                        <div style={boxStyle}>
                            <div className="form-label" style={labelStyle}>가격 정보</div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input 
                                    type="text" 
                                    placeholder="가격 입력 (원)"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    style={{ ...inputStyle, flex: 1, height: '45px' }}
                                />
                                <button onClick={handleAiPriceClick} 
                                    style={{ 
                                        height: '45px', padding: '0 20px', 
                                        backgroundColor: mainColor, color: 'white', 
                                        border: 'none', borderRadius: '4px', 
                                        cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap'
                                    }}>
                                    AI 가격 제안
                                </button>
                            </div>
                        </div>

                        {/* 판매자 자체 제작률 */}
                        <div style={boxStyle}>
                            <div className="form-label" style={labelStyle}>판매자 자체 제작률</div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    placeholder="AI 사용 툴 (예: Midjourney)"
                                    value={aiTool}
                                    onChange={(e) => setAiTool(e.target.value)}
                                    style={{ ...inputStyle, flex: 1 }}
                                />
                                <input 
                                    type="text" 
                                    placeholder="AI 사용 비율 (예: 80%)"
                                    value={aiRate}
                                    onChange={(e) => setAiRate(e.target.value)}
                                    style={{ ...inputStyle, flex: 1 }}
                                />
                            </div>
                        </div>

                        {/* 프롬프트 입력 */}
                        <div style={boxStyle}>
                            <div className="form-label" style={labelStyle}>프롬프트 입력</div>
                            <textarea 
                                placeholder="생성에 사용된 프롬프트를 입력해주세요..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                style={textAreaStyle}
                            />
                        </div>

                        {/* 작품 공개/비공개 설정 */}
                        <div style={{ ...boxStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="form-label" style={{...labelStyle, marginBottom: 0}}>작품 공개 설정</div>
                            <button 
                                onClick={() => setIsPublic(!isPublic)}
                                style={{ 
                                    display: 'flex', alignItems: 'center', gap: '5px', 
                                    padding: '8px 20px', borderRadius: '20px', 
                                    border: '1px solid #ddd', 
                                    background: isPublic ? '#E3F2FD' : 'white', 
                                    color: isPublic ? '#1976D2' : '#666', 
                                    cursor: 'pointer', fontSize: '14px', fontWeight: '500' 
                                }}
                            >
                                {isPublic ? '공개' : '비공개'} 👁
                            </button>
                        </div>

                        {/* 최종 업로드 버튼 */}
                        <div style={{ marginTop: '30px' }}>
                            <button onClick={handleSubmit} 
                                style={{ 
                                    width: '100%', padding: '15px 0', 
                                    backgroundColor: mainColor, color: 'white', 
                                    border: 'none', borderRadius: '8px', 
                                    cursor: 'pointer', fontWeight: 'bold', fontSize: '18px',
                                    boxShadow: '0 4px 6px rgba(255, 107, 0, 0.4)' // 버튼 강조 효과
                                }}>
                                작품 업로드 완료
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {/* --- [모달] 업로드 완료 --- */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', // 배경 어둡게
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '40px', borderRadius: '12px',
                        textAlign: 'center', width: '300px',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ fontSize: '40px', marginBottom: '20px' }}>🎉</div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>작품 접수 완료!</h3>
                        <p style={{ color: '#666', marginBottom: '30px' }}>작품이 성공적으로 접수되었습니다.</p>
                        <button onClick={handleModalConfirm}
                            style={{
                                width: '100%', padding: '12px',
                                backgroundColor: mainColor, color: 'white',
                                border: 'none', borderRadius: '8px',
                                fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
                            }}>
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Upload;