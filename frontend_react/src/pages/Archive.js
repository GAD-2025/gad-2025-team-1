import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import './Archive.css';

const Archive = () => {
    const navigate = useNavigate();
    
    // 상태 관리
    const [activeFilter, setActiveFilter] = useState('내 작품 목록');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeKeyword, setActiveKeyword] = useState('일러스트');
    const [selectedImage, setSelectedImage] = useState(2);
    const [isPublic, setIsPublic] = useState(true);
    
    // ★ 서버 데이터 연동용 상태
    const [serverArtworks, setServerArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    // [1] 더미 데이터 (하단 작품 관리 섹션용 - 디자인 유지)
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
    const handleDashboardClick = () => navigate('/setting');

    // [2] 서버에서 내 인벤토리 가져오기
    useEffect(() => {
        const fetchInventory = async () => {
            const userId = localStorage.getItem('userId') || 'admin';
            try {
                const response = await fetch(`http://localhost:5000/api/inventory/${userId}`);
                const data = await response.json();
                
                if (data.success) {
                    const formatted = data.inventory.map(item => ({
                        id: item.id,
                        title: item.title,
                        artist: item.artist_name || 'Unknown', 
                        date: new Date().toLocaleDateString(),
                        modified: '-',
                        badge: item.type === 'liked' ? '찜' : '소유 중',
                        img: item.image_url,
                        type: item.type // 'purchased' or 'liked'
                    }));
                    setServerArtworks(formatted);
                }
            } catch (err) {
                console.error("인벤토리 로딩 실패:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    // 필터링: '내 작품 목록' 탭에서는 구매한(purchased) 작품만 보여줌
    const displayArtworks = serverArtworks.filter(art => {
        const matchSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = activeFilter === '내 작품 목록' ? art.type === 'purchased' : true;
        return matchSearch && matchType;
    });

    // [3] 그리드 렌더링
    const renderArtworkGrid = () => (
        <section className="artwork-grid">
            {loading ? (
                <div style={{color:'white', padding:'20px'}}>로딩 중...</div>
            ) : displayArtworks.length > 0 ? (
                displayArtworks.map(art => (
                    <div className="artwork-item" key={art.id}>
                        <img src={art.img} alt={art.title} className="item-thumbnail" />
                        <div className="item-info">
                            <p className="item-title">{art.title}</p>
                            <p className="item-artist">{art.artist}</p>
                            <p className="item-date">{art.date}</p>
                            <span className="item-badge" style={{color: '#ff6b00', fontWeight:'bold'}}>{art.badge}</span>
                        </div>
                    </div>
                ))
            ) : (
                <div style={{color:'#888', padding:'40px', gridColumn:'1/-1', textAlign:'center'}}>
                    보유한 작품이 없습니다. <br/>
                    <Link to="/explore" style={{color:'#ff6b00', textDecoration:'underline'}}>작품 구매하러 가기</Link>
                </div>
            )}
        </section>
    );

    return (
        <div className="archive-page">
            <Header />

            <main className="archive-container">
                <div className="archive-header">
                    <h1 className="archive-title">My Library</h1>
                    <div className="archive-count">
                        <span className="count-number">{displayArtworks.length}</span>
                        <span className="count-label">보관 중인 작품</span>
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

                {/* 하단 작품 관리 섹션 */}
                <section className="new-dashboard-section">
                    <div className="management-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="management-title">작품 관리</h2>
                        <button className="dashboard-check-btn" onClick={handleDashboardClick}>
                            수익 대시보드 확인하기 &gt;
                        </button>
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