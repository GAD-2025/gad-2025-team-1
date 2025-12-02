import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

const Upload = () => {
    const navigate = useNavigate();
    const [activeKeyword, setActiveKeyword] = useState('일러스트');
    const [isPublic, setIsPublic] = useState(true);
    const [previewImage, setPreviewImage] = useState(null);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [aiTool, setAiTool] = useState('');
    const [aiRate, setAiRate] = useState('');
    const [prompt, setPrompt] = useState('');

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

    const handleRemoveImage = () => {
        setPreviewImage(null);
    };

    const handleUploadBoxClick = () => {
        document.getElementById('imageInput').click();
    };

    const handleAiPriceClick = () => {
        alert('AI가 적정 가격을 분석 중입니다...');
        // TODO: AI 가격 제안 로직
    };

    const handleSubmit = () => {
        if (!previewImage) {
            alert('이미지를 업로드해주세요.');
            return;
        }
        
        // TODO: 서버로 데이터 전송
        alert('작품이 업로드되었습니다!');
        navigate('/archive');
    };

    return (
        <div className="upload-page">
            <Header />
            
            <main className="upload-container">
                <button className="back-button" onClick={() => navigate('/archive')}>&lt;</button>
                <div className="upload-header">
                    <h1 className="upload-title">작품 업로드</h1>
                </div>

                {/* 이미지 업로드 박스 */}
                <section className="image-upload-section">
                    <div className="upload-box-container">
                        {!previewImage ? (
                            <div className="image-upload-box" onClick={handleUploadBoxClick}>
                                <div className="upload-icon">📷</div>
                                <p className="upload-text">이미지를 업로드하려면 클릭하세요</p>
                                <input 
                                    type="file" 
                                    id="imageInput" 
                                    accept="image/*" 
                                    style={{display: 'none'}} 
                                    onChange={handleImageUpload}
                                />
                            </div>
                        ) : (
                            <div className="preview-container">
                                <img id="previewImage" src={previewImage} alt="미리보기" />
                                <button className="remove-image-btn" onClick={handleRemoveImage}>✕</button>
                            </div>
                        )}
                    </div>
                </section>

                {/* 작품 정보 입력 폼 */}
                <section className="artwork-info-section">
                    <div className="info-form">
                        {/* 작품 설명 */}
                        <div className="form-row">
                            <div className="form-label">작품 설명</div>
                            <div className="keyword-buttons">
                                <button 
                                    className={`keyword-btn ${activeKeyword === '일러스트' ? 'active' : ''}`}
                                    onClick={() => setActiveKeyword('일러스트')}
                                >
                                    일러스트
                                </button>
                                <button 
                                    className={`keyword-btn ${activeKeyword === '그래픽' ? 'active' : ''}`}
                                    onClick={() => setActiveKeyword('그래픽')}
                                >
                                    그래픽
                                </button>
                                <button 
                                    className={`keyword-btn ${activeKeyword === '3D' ? 'active' : ''}`}
                                    onClick={() => setActiveKeyword('3D')}
                                >
                                    3D
                                </button>
                            </div>
                            <textarea 
                                className="description-input" 
                                placeholder="활용 분야, 작품 설명을 입력해주세요..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* 가격 정보 */}
                        <div className="form-row">
                            <div className="form-label">가격 정보</div>
                            <div className="price-row">
                                <input 
                                    type="text" 
                                    className="price-input" 
                                    placeholder="가격 입력"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                <button className="ai-price-button" onClick={handleAiPriceClick}>
                                    AI 가격 제안
                                </button>
                            </div>
                        </div>

                        {/* 판매자 자체 제작률 */}
                        <div className="form-row">
                            <div className="form-label">판매자 자체 제작률</div>
                            <div className="rate-inputs">
                                <input 
                                    type="text" 
                                    className="rate-input" 
                                    placeholder="AI 사용 툴"
                                    value={aiTool}
                                    onChange={(e) => setAiTool(e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    className="rate-input" 
                                    placeholder="AI 사용 비율"
                                    value={aiRate}
                                    onChange={(e) => setAiRate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 프롬프트 입력 */}
                        <div className="form-row">
                            <div className="form-label">프롬프트 입력</div>
                            <textarea 
                                className="prompt-input" 
                                placeholder="프롬프트 내용을 입력해주세요..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>

                        {/* 작품 공개/비공개 설정 */}
                        <div className="form-row">
                            <div className="form-label">작품 공개/비공개 설정</div>
                            <button 
                                className={`visibility-button ${isPublic ? 'active' : ''}`}
                                onClick={() => setIsPublic(!isPublic)}
                            >
                                {isPublic ? '공개' : '비공개'} <span className="eye-icon">👁</span>
                            </button>
                        </div>

                        {/* 업로드 버튼 */}
                        <div className="form-row" style={{marginTop: '30px'}}>
                            <button className="submit-button" onClick={handleSubmit}>
                                작품 업로드
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Upload;
