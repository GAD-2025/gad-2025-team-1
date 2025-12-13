import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import './Archive.css';

const Archive = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('내 작품 목록');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeKeyword, setActiveKeyword] = useState('일러스트');
    const [selectedImage, setSelectedImage] = useState(2);
    const [isPublic, setIsPublic] = useState(true);

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // --- 드래그 슬라이드 관련 상태 ---
    const sliderRef = useRef(null);
    const [isDown, setIsDown] = useState(false);
    const [startY, setStartY] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const mainColor = '#FF6B00';

    const artworks = [
        { id: 1, title: '픽셀의 경계', artist: 'Pixel Weaver', date: '25/10/1', modified: '25/10/4', badge: '찜', img: '/images/이미지6.png' },
        { id: 2, title: '동화의 끝', artist: '404 Creator', date: '25/10/1', modified: '25/10/4', badge: '-', img: '/images/이미지5.png' },
        { id: 3, title: '바다', artist: 'Synapse_7', date: '25/10/1', modified: '25/10/4', badge: '-', img: '/images/이미지1.png' },
        { id: 4, title: '픽셀의 경계', artist: 'Pixel Weaver', date: '25/10/1', modified: '25/10/4', badge: '-', img: '/images/이미지2.png' },
        { id: 5, title: '주사위 놀이', artist: '404 Creator', date: '25/10/1', modified: '25/10/4', badge: '-', img: '/images/이미지3.png' },
        { id: 6, title: '별의 정원', artist: 'Synapse_7', date: '25/10/1', modified: '25/10/4', badge: '-', img: '/images/이미지4.png' },
        { id: 7, title: '추가 작품 1', artist: 'Artist_A', date: '25/10/5', modified: '25/10/6', badge: 'New', img: '/images/이미지1.png' },
        { id: 8, title: '추가 작품 2', artist: 'Artist_B', date: '25/10/5', modified: '25/10/6', badge: 'New', img: '/images/이미지2.png' },
    ];

    const imageList = [
        { id: 1, label: "픽셀의 경계", src: "https://picsum.photos/60/60?random=1" },
        { id: 2, label: "동화의 꽃", src: "https://picsum.photos/60/60?random=2" },
        { id: 3, label: "바다", src: "https://picsum.photos/60/60?random=3" },
        { id: 4, label: "픽셀의 경계2", src: "https://picsum.photos/60/60?random=4" },
        { id: 5, label: "주사위 놀이", src: "https://picsum.photos/60/60?random=5" },
        { id: 6, label: "별의 정원", src: "https://picsum.photos/60/60?random=6" },
        { id: 7, label: "추가 썸네일", src: "https://picsum.photos/60/60?random=7" },
        { id: 8, label: "추가 썸네일2", src: "https://picsum.photos/60/60?random=8" },
        { id: 9, label: "추가 썸네일3", src: "https://picsum.photos/60/60?random=9" },
        { id: 10, label: "추가 썸네일4", src: "https://picsum.photos/60/60?random=10" },
        { id: 11, label: "추가 썸네일5", src: "https://picsum.photos/60/60?random=11" },
        { id: 12, label: "추가 썸네일6", src: "https://picsum.photos/60/60?random=12" },
    ];

    const keywords = ['일러스트', '3D', '아이콘', '템플릿', '사진'];

    const handleUploadClick = () => navigate('/upload');
    const handleAiPriceClick = () => alert('AI가 적정 가격을 분석 중입니다...');
    const handleSaveClick = () => alert('작품 정보가 저장되었습니다.');
    const handleDashboardClick = () => navigate('/setting');

    // 페이지네이션
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentArtworks = artworks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(artworks.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    // --- 드래그 슬라이드 핸들러 ---
    const handleMouseDown = (e) => {
        setIsDown(true);
        setStartY(e.pageY - sliderRef.current.offsetTop);
        setScrollTop(sliderRef.current.scrollTop);
    };
    const handleMouseLeave = () => setIsDown(false);
    const handleMouseUp = () => setIsDown(false);
    const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const y = e.pageY - sliderRef.current.offsetTop;
        const walk = (y - startY) * 2; 
        sliderRef.current.scrollTop = scrollTop - walk;
    };

    // 스타일 정의
    const boxStyle = {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'left',
        backgroundColor: '#fff'
    };

    const labelStyle = {
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333'
    };

    const renderArtworkGrid = () => (
        <section className="artwork-grid-container">
            <div className="artwork-grid">
                {currentArtworks.map(art => (
                    <Link to="/archive/detail" key={art.id} className="artwork-link">
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
                    </Link>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => handlePageChange(number)}
                            style={{
                                padding: '5px 10px',
                                border: '1px solid #ddd',
                                backgroundColor: currentPage === number ? mainColor : 'white',
                                color: currentPage === number ? 'white' : 'black',
                                cursor: 'pointer',
                                borderRadius: '5px'
                            }}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            )}
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

                <div className="filter-bar" style={{ display: 'flex', alignItems: 'center' }}>
                    <button className={`filter-btn ${activeFilter === '내 작품 목록' ? 'active' : ''}`} onClick={() => setActiveFilter('내 작품 목록')}>
                        내 작품 목록
                    </button>

                    <div 
                        className="upload-group" 
                        onClick={handleUploadClick} 
                        style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}
                    >
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>작품 업로드</span>
                        <div style={{
                            width: '32px', height: '32px', backgroundColor: mainColor, borderRadius: '50%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
                            fontSize: '24px', fontWeight: 'bold', paddingBottom: '4px', boxSizing: 'border-box'
                        }}>+</div>
                    </div>
                </div>

                {renderArtworkGrid()}

                <section className="new-dashboard-section">
                    <div className="management-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="management-title">작품 관리</h2>
                        <button className="dashboard-check-btn" onClick={handleDashboardClick}>
                            수익 대시보드 확인하기 &gt;
                        </button>
                    </div>

                    <div className="artwork-info-section">
                        
                        <div className="artwork-content" style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: '30px' }}>
                            
                            {/* --- 왼쪽: 드래그 슬라이드 썸네일 --- */}
                            <div className="vertical-slider-container" style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                minWidth: '160px',
                                paddingTop: '54px' 
                            }}>
                                {/* ★ 중요 수정:
                                    리스트와 그라데이션을 감싸는 Relative 래퍼를 생성.
                                    이렇게 하면 그라데이션의 top/bottom이 이 박스(높이 520px)를 기준으로 잡힙니다.
                                */}
                                <div style={{ position: 'relative', width: '100%', height: '520px' }}>
                                    
                                    {/* 상단 그라데이션 (검은색) */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '60px', 
                                        background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
                                        pointerEvents: 'none',
                                        zIndex: 10
                                    }}></div>

                                    {/* 스크롤 리스트 */}
                                    <div 
                                        className="image-list-scrollable" 
                                        ref={sliderRef}
                                        onMouseDown={handleMouseDown}
                                        onMouseLeave={handleMouseLeave}
                                        onMouseUp={handleMouseUp}
                                        onMouseMove={handleMouseMove}
                                        style={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            gap: '15px', 
                                            alignItems: 'center',
                                            height: '100%',     // 부모 높이(520px)를 꽉 채움
                                            overflowY: 'auto',
                                            cursor: isDown ? 'grabbing' : 'grab',
                                            paddingBottom: '20px',
                                            userSelect: 'none',
                                            msOverflowStyle: 'none',
                                            scrollbarWidth: 'none',
                                        }}
                                    >
                                        <style>{`
                                            .image-list-scrollable::-webkit-scrollbar { display: none; }
                                        `}</style>

                                        {imageList.map(item => {
                                            const isSelected = selectedImage === item.id;
                                            return (
                                                <div key={item.id} 
                                                     className={`image-item ${isSelected ? 'selected' : ''}`} 
                                                     onClick={() => setSelectedImage(item.id)}
                                                     onDragStart={(e) => e.preventDefault()}
                                                     style={{ 
                                                         textAlign: 'center', 
                                                         transition: 'all 0.3s ease',
                                                         flexShrink: 0,
                                                         pointerEvents: isDown ? 'none' : 'auto' 
                                                     }}
                                                >
                                                    <img 
                                                        src={item.src} 
                                                        alt={item.label} 
                                                        className="small-image" 
                                                        style={{ 
                                                            width: isSelected ? '120px' : '70px', 
                                                            height: isSelected ? '120px' : '70px', 
                                                            objectFit: 'cover', 
                                                            borderRadius: '8px',
                                                            border: isSelected ? `3px solid ${mainColor}` : '1px solid #ddd',
                                                            boxShadow: isSelected ? '0 4px 8px rgba(0,0,0,0.2)' : 'none'
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* 하단 그라데이션 (검은색) */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,  // 이제 래퍼의 하단(520px 위치)에 정확히 붙음
                                        left: 0,
                                        width: '100%',
                                        height: '60px',
                                        background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
                                        pointerEvents: 'none',
                                        zIndex: 10
                                    }}></div>
                                </div>
                            </div>

                            {/* --- 오른쪽: 입력 폼 --- */}
                            <div className="info-form" style={{ flex: 1 }}>
                                {/* ... (이전과 동일) ... */}
                                <div className="info-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h3 className="artwork-info-title" style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>작품 정보</h3>
                                    
                                    <button 
                                        className={`visibility-button ${isPublic ? 'active' : ''}`} 
                                        onClick={() => setIsPublic(!isPublic)} 
                                        style={{ 
                                            display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 15px', borderRadius: '20px', 
                                            border: '1px solid #ddd', 
                                            background: isPublic ? '#E3F2FD' : 'white', 
                                            color: isPublic ? '#1976D2' : '#666',
                                            cursor: 'pointer', fontSize: '14px', fontWeight: '500'
                                        }}
                                    >
                                        {isPublic ? '공개' : '비공개'} <span className="eye-icon">👁</span>
                                    </button>
                                </div>

                                <div className="form-section" style={boxStyle}>
                                    <div className="form-label" style={labelStyle}>작품 설명</div>
                                    <div className="keyword-buttons" style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
                                        {keywords.map(kw => {
                                            const isActive = activeKeyword === kw;
                                            return (
                                                <button 
                                                    key={kw} 
                                                    onClick={() => setActiveKeyword(kw)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '20px',
                                                        cursor: 'pointer',
                                                        fontSize: '13px',
                                                        fontWeight: '500',
                                                        backgroundColor: isActive ? mainColor : 'white',
                                                        color: isActive ? 'white' : mainColor,
                                                        border: `1px solid ${mainColor}`
                                                    }}
                                                >
                                                    {kw}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <textarea className="description-input" placeholder="활용 분야, 작품 설명을 입력해주세요..." 
                                        style={{ width: '100%', height: '80px', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', resize: 'none' }}></textarea>
                                </div>

                                <div className="form-section" style={boxStyle}>
                                    <div className="form-label" style={labelStyle}>가격 정보</div>
                                    <div className="price-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input 
                                            type="text" 
                                            className="price-input" 
                                            placeholder="가격 입력" 
                                            style={{ 
                                                flex: 1, 
                                                height: '45px',
                                                padding: '0 10px',
                                                border: '1px solid #ddd', 
                                                borderRadius: '4px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <button 
                                            className="ai-price-button" 
                                            onClick={handleAiPriceClick} 
                                            style={{ 
                                                height: '45px',
                                                padding: '0 20px', 
                                                backgroundColor: mainColor,
                                                color: 'white', 
                                                border: 'none', 
                                                borderRadius: '4px', 
                                                cursor: 'pointer',
                                                boxSizing: 'border-box',
                                                fontWeight: '500'
                                            }}
                                        >
                                            AI 가격 제안
                                        </button>
                                    </div>
                                </div>

                                <div className="form-section" style={boxStyle}>
                                    <div className="form-label" style={labelStyle}>판매자 자체 제작률</div>
                                    <div className="rate-inputs" style={{ display: 'flex', gap: '10px' }}>
                                        <input type="text" className="rate-input" placeholder="AI 사용 툴" style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                        <input type="text" className="rate-input" placeholder="AI 사용 비율" style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                </div>

                                <div className="form-section" style={boxStyle}>
                                    <div className="form-label" style={labelStyle}>프롬프트</div>
                                    <textarea className="prompt-input" placeholder="프롬프트 내용을 입력해주세요..." 
                                        style={{ width: '100%', height: '80px', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', resize: 'none' }}></textarea>
                                </div>

                                <div className="form-row" style={{ marginTop: '20px' }}>
                                    <button 
                                        className="save-button" 
                                        onClick={handleSaveClick} 
                                        style={{ 
                                            width: '100%', 
                                            padding: '15px 0', 
                                            backgroundColor: mainColor,
                                            color: 'white', 
                                            border: 'none', 
                                            borderRadius: '8px', 
                                            cursor: 'pointer', 
                                            fontWeight: 'bold',
                                            fontSize: '16px'
                                        }}
                                    >
                                        저장하기
                                    </button>
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