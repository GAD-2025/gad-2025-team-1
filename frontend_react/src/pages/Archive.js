import React, { useState } from 'react';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import './Archive.css';
//ㅇ//
const Archive = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('내 작품 목록');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeKeyword, setActiveKeyword] = useState('일러스트');
    const [selectedImage, setSelectedImage] = useState(2);
    const [isPublic, setIsPublic] = useState(true);

    const artworks = [
        { id: 1, title: '픽셀의 경계', artist: 'Pixel Weaver', date: '25/10/1', modified: '25/10/4', badge: '찜 최종종종', img: '/images/이미지6.png' },
        { id: 2, title: '동화의 끝', artist: '404 Creator', date: '25/10/1', modified: '25/10/4', badge: '-', img: '/images/이미지5.png', link: '/archive/detail' },
        { id: 3, title: '바다', artist: 'Synapse_7', date: '25/10/1', modified: '25/10/4', badge: '-', img: '/images/이미지1.png' },
        { id: 4, title: '픽셀의 경계', artist: 'Pixel Weaver', date: '25/10/1', modified: '25/10/4', badge: '-', img: '/images/이미지2.png' },
        { id: 5, title: '주시위 놀이', artist: '404 Creator', date: '25/10/1', modified: '25/10/4', badge: '-', img: '/images/이미지3.png' },
        { id: 6, title: '별의 정원', artist: 'Synapse_7', date: '25/10/1', modified: '25/10/4', badge: '-', img: '/images/이미지4.png' },
    ];

    const imageList = [
        { id: 1, label: "픽셀의 경계", src: "https://picsum.photos/60/60?random=1" },
        { id: 2, label: "동화의 꽃", src: "https://picsum.photos/60/60?random=2" },
        { id: 3, label: "바다", src: "https://picsum.photos/60/60?random=3" },
        { id: 4, label: "픽셀의 경계2", src: "https://picsum.photos/60/60?random=4" },
        { id: 5, label: "주사위 놀이", src: "https://picsum.photos/60/60?random=5" }
    ];

    const handleUploadClick = () => navigate('/upload');
    const handleAiPriceClick = () => alert('AI가 적정 가격을 분석 중입니다...');
    const handleSaveClick = () => alert('작품 정보가 저장되었습니다.');

    const renderArtworkGrid = () => (
        <section className="artwork-grid">
            {artworks.map(art => {
                const item = (
                    <div className="artwork-item" data-id={art.id}>
                        <img src={`${process.env.PUBLIC_URL}${art.img}`} alt={art.title} className="item-thumbnail" />
                        <div className="item-info">
                            <p className="item-title">{art.title}</p>
                            <p className="item-artist">ID: {art.artist}</p>
                            <p className="item-date">구매일: {art.date}</p>
                            <p className="item-purchase">수정일: {art.modified}</p>
                            <span className="item-badge">{art.badge}</span>
                        </div>
                    </div>
                );
                return art.link ? <Link to={art.link} key={art.id}>{item}</Link> : <div key={art.id}>{item}</div>;
            })}
        </section>
    );

    return (
        <div className="archive-page">
            <Header />

            <main className="archive-container">
                <div className="archive-header">
                    <h1 className="archive-title">김민지's Library</h1>
                    <div className="archive-count">
                        <span className="count-number">{artworks.length}</span>
                        <span className="count-label">보관 중인 작품 개수</span>
                    </div>
                    <div className="search-bar">
                        <input type="text" placeholder="작품명, 작가, 태그 검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <button className="search-btn">검색</button>
                    </div>
                </div>

                <div className="filter-bar">
                    <button className={`filter-btn ${activeFilter === '내 작품 목록' ? 'active' : ''}`} onClick={() => setActiveFilter('내 작품 목록')}>
                        내 작품 목록
                    </button>
                    <div className="top-box upload-box" onClick={handleUploadClick} style={{marginLeft: 'auto', minWidth: '200px', maxWidth: '200px', height: '50px', padding: '10px'}}>
                        <div className="box-title" style={{fontSize: '14px', marginBottom: '0'}}>작품 업로드</div>
                        <div className="upload-plus" style={{fontSize: '30px'}}>+</div>
                    </div>
                </div>

                {renderArtworkGrid()}

                <section className="new-dashboard-section">
                    <div className="management-header">
                        <h2 className="management-title">작품 관리</h2>
                    </div>

                    <div className="top-boxes">
                        <div className="top-box sales-box">
                            <div className="box-title">판매 현황</div>
                            <div className="sales-chart">
                                <div className="chart-bar" style={{ height: "60%" }}></div>
                                <div className="chart-bar" style={{ height: "30%" }}></div>
                                <div className="chart-bar" style={{ height: "100%" }}></div>
                                <div className="chart-bar" style={{ height: "80%" }}></div>
                                <div className="chart-bar" style={{ height: "50%" }}></div>
                            </div>
                        </div>

                        <div className="top-box revenue-box">
                            <div className="box-title">수익</div>
                            <div className="revenue-content">
                                <div className="revenue-month">11월</div>
                                <div className="revenue-amount">160000</div>
                            </div>
                        </div>
                    </div>

                    <div className="artwork-info-section">
                        <h3 className="artwork-info-title">작품 정보</h3>
                        <div className="artwork-content">
                            <div className="image-list">
                                <div className="timeline-stroke"></div>
                                {imageList.map(item => (
                                    <div key={item.id} className={`image-item ${selectedImage === item.id ? 'selected' : ''}`} onClick={() => setSelectedImage(item.id)}>
                                        <img src={item.src} alt={item.label} className="small-image" />
                                        <span className="image-label">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="info-form">
                                <div className="form-row">
                                    <div className="form-label">작품 설명</div>
                                    <div className="keyword-buttons">
                                        {['일러스트', '그래픽', '3D'].map(kw => (
                                            <button key={kw} className={`keyword-btn ${activeKeyword === kw ? 'active' : ''}`} onClick={() => setActiveKeyword(kw)}>
                                                {kw}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea className="description-input" placeholder="활용 분야, 작품 설명을 입력해주세요..."></textarea>
                                </div>

                                <div className="form-row">
                                    <div className="form-label">가격 정보</div>
                                    <div className="price-row">
                                        <input type="text" className="price-input" placeholder="가격 입력" />
                                        <button className="ai-price-button" onClick={handleAiPriceClick}>AI 가격 제안</button>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-label">판매자 자체 제작률</div>
                                    <div className="rate-inputs">
                                        <input type="text" className="rate-input" placeholder="AI 사용 툴" />
                                        <input type="text" className="rate-input" placeholder="AI 사용 비율" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-label">프롬프트 입력</div>
                                    <textarea className="prompt-input" placeholder="프롬프트 내용을 입력해주세요..."></textarea>
                                </div>

                                <div className="form-row">
                                    <div className="form-label">작품 공개/비공개 설정</div>
                                    <button className={`visibility-button ${isPublic ? 'active' : ''}`} onClick={() => setIsPublic(!isPublic)}>
                                        {isPublic ? '공개' : '비공개'} <span className="eye-icon">👁</span>
                                    </button>
                                </div>

                                <div className="form-row" style={{marginTop: '10px'}}>
                                    <button className="save-button" onClick={handleSaveClick}>저장하기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Archive;
