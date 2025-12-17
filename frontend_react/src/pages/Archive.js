import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Archive.css';

const Archive = () => {
    const navigate = useNavigate();
    
    // --- [State] ---
    const [currentUser, setCurrentUser] = useState(null); 
    const [userNickname, setUserNickname] = useState('');
    const [purchasedArtworks, setPurchasedArtworks] = useState([]); 
    const [uploadedArtworks, setUploadedArtworks] = useState([]); 
    
    // 선택된 작품 관리
    const [selectedUploadId, setSelectedUploadId] = useState(null);
    const [selectedUploadData, setSelectedUploadData] = useState({
        title: '', description: '', price: '', ai_tool: '', ai_ratio: '', prompt: '', is_public: true
    });

    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('내 작품 목록');
    const [searchTerm, setSearchTerm] = useState(''); 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // 슬라이드 Ref
    const sliderRef = useRef(null);
    const [isDown, setIsDown] = useState(false);
    const [isDragging, setIsDragging] = useState(false); 
    const [startY, setStartY] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const mainColor = '#FF6B00';

    // ★ [수정 3] 풍부한 상세 설명 버전으로 데이터 복구
    const mockUploads = useMemo(() => [
        { 
            id: 'mock-1', 
            title: '코스믹 락스타 (Cosmic Rockstar)', 
            image_url: '/images/이미지1.png', 
            description: '행성을 머리에 이고 우주의 리듬을 연주하는 락스타입니다. 보랏빛 성운과 흩날리는 별들 사이에서 불타오르는 기타 연주가 시각적으로 강렬한 에너지를 전달합니다.', 
            price: '15000', 
            ai_tool: 'Midjourney v6', 
            ai_ratio: '100%', 
            prompt: 'A character with a purple planet for a head playing a flaming electric guitar, deep space background with stars and nebula, vibrant violet and blue color palette, flat vector illustration style, retro-futuristic vibe --ar 1:1', 
            is_public: 1 
        },
        { 
            id: 'mock-2', 
            title: '메카닉 플로라 (Mechanic Flora)', 
            image_url: '/images/이미지2.png', 
            description: '자연과 기술의 결합을 설계도면 형식으로 표현한 작품입니다. 그리드 배경 위로 청록색과 보라색의 기계적인 꽃들이 정교하게 드로잉되어 있습니다.', 
            price: '22000', 
            ai_tool: 'Stable Diffusion XL', 
            ai_ratio: '90%', 
            prompt: 'Blueprint schematic of cybernetic flowers, technical drawing style on dark grid background, glowing neon teal and purple outlines, mechanical parts mixed with organic petals, sci-fi botany, high detail --v 5', 
            is_public: 1 
        },
        { 
            id: 'mock-3', 
            title: '도심 속의 여유 (Urban Sloth)', 
            image_url: '/images/이미지3.png', 
            description: '삭막한 빌딩 숲 사이에서 피어난 나뭇가지에 매달린 나무늘보의 여유로운 미소를 담았습니다. 파스텔 톤의 부드러운 색감이 힐링을 선물합니다.', 
            price: '12000', 
            ai_tool: 'DALL-E 3', 
            ai_ratio: '100%', 
            prompt: 'Cute sloth hanging on a tree branch growing out of a colorful city building, soft pastel colors, whimsical illustration style, clouds in the sky, lo-fi aesthetic, healing vibe, minimal shading', 
            is_public: 1 
        },
        { 
            id: 'mock-4', 
            title: '미지의 문턱 (The Threshold)', 
            image_url: '/images/이미지4.png', 
            description: '어두운 숲 속, 빛나는 거대한 아치형 입구 앞에 선 작은 탐험가를 그렸습니다. 랜턴 하나에 의지해 미지의 세계로 발을 들이려는 순간의 긴장감을 표현했습니다.', 
            price: '18000', 
            ai_tool: 'Midjourney v5.2', 
            ai_ratio: '85%', 
            prompt: 'A small adventurer holding a lantern standing in front of a large glowing magical portal in a dark forest, mystery, fantasy adventure, silhouette, dramatic lighting, vector art style, night atmosphere', 
            is_public: 1 
        },
        { 
            id: 'mock-5', 
            title: '로봇 바리스타 (Robo-Cafe)', 
            image_url: '/images/이미지5.png', 
            description: '따뜻한 감성을 지닌 하얀 로봇이 사랑을 담아 커피를 내리는 모습입니다. 베이지톤의 배경과 하트 모양의 김이 포근한 분위기를 연출합니다.', 
            price: '9000', 
            ai_tool: 'Niji Journey', 
            ai_ratio: '95%', 
            prompt: 'Cute round white robot pouring coffee into a mug, steam forming heart shapes, warm beige and brown palette, cozy cafe atmosphere, kawaii character design, simple lines, flat color', 
            is_public: 0 
        },
        { 
            id: 'mock-6', 
            title: '별빛을 머금은 꽃 (Starlight Blooms)', 
            image_url: '/images/이미지6.png', 
            description: '밤하늘의 별빛을 받으며 스스로 빛을 내는 신비로운 꽃들을 화분에 담았습니다. 어두운 배경과 대비되는 형광빛 꽃잎들이 몽환적입니다.', 
            price: '25000', 
            ai_tool: 'Stable Diffusion', 
            ai_ratio: '80%', 
            prompt: 'Bioluminescent flowers in a clay pot, glowing cyan purple and pink petals, dark blue starry night background, magical atmosphere, sparkles, fantasy botany, digital painting style, vibrant lighting', 
            is_public: 1 
        },
    ], []);

    // ★ [핵심 함수] 이미지 경로 처리 (수정 2 해결)
    // - /uploads/ 로 시작하면 백엔드(localhost:5000)에서 가져옴
    // - /images/ 로 시작하거나 http로 시작하면 그대로 사용 (프론트엔드/외부)
    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/300?text=No+Image';
        if (url.startsWith('/uploads/')) {
            return `http://localhost:5000${url}`;
        }
        return url; 
    };

    useEffect(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setCurrentUser(parsedUser);
            fetchAllData(parsedUser.username); 
        } else {
            alert("로그인이 필요합니다.");
            navigate('/login');
        }
    }, [navigate]);

    const fetchAllData = async (username) => {
        if (!username) return;
        setIsLoading(true);

        try {
            // 유저 정보
            const userRes = await axios.get(`http://localhost:5000/api/user-info/${username}`);
            if (userRes.data.success) setUserNickname(userRes.data.nickname);

            // 구매 목록
            const purchaseRes = await axios.get(`http://localhost:5000/api/purchases/${username}`);
            if (purchaseRes.data.success) {
                const mappedPurchases = purchaseRes.data.data.map(item => ({
                    ...item,
                    date: new Date(item.purchased_at).toLocaleDateString(),
                    badge: item.category === '일러스트' ? 'Art' : 'AI'
                }));
                setPurchasedArtworks(mappedPurchases);
            }

            // 내 업로드 목록
            const uploadRes = await axios.get(`http://localhost:5000/api/my-uploads/${username}`);
            
            let realUploads = [];
            if (uploadRes.data.success) {
                // 여기서 이미지 경로를 미리 변환하지 않고, 렌더링 할 때 getImageUrl 함수를 사용합니다.
                realUploads = uploadRes.data.data.map(item => ({
                    ...item,
                    isReal: true // 진짜 데이터 표시
                }));
            }

            // 진짜 데이터(최신순) + 가짜 데이터 합치기
            const combinedUploads = [...realUploads, ...mockUploads];
            setUploadedArtworks(combinedUploads);

            // 첫 번째 아이템 자동 선택
            if (combinedUploads.length > 0) {
                handleUploadSelect(combinedUploads[0]);
            }

        } catch (error) {
            console.error("데이터 로딩 실패:", error);
            setUploadedArtworks(mockUploads);
            handleUploadSelect(mockUploads[0]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadSelect = (item) => {
        if (isDragging) return;

        setSelectedUploadId(item.id);
        setSelectedUploadData({
            title: item.title,
            description: item.description || '',
            price: item.price || '',
            ai_tool: item.ai_tool || '',
            ai_ratio: item.ai_ratio || '',
            prompt: item.prompt || '',
            is_public: item.is_public === 1 || item.is_public === true
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setSelectedUploadData(prev => ({ ...prev, [name]: value }));
    };

    const handleUploadClick = () => navigate('/upload');
    const handleAiPriceClick = () => alert(`AI 분석 결과: 적정가는 ${parseInt(selectedUploadData.price || 0) * 1.1}원 입니다.`);

    const handleSaveClick = async () => {
        if (!selectedUploadId) return;

        if (String(selectedUploadId).startsWith('mock')) {
            alert('예시 데이터는 실제로 저장되지 않습니다. (UI 테스트용)');
            return;
        }

        try {
            const payload = {
                id: selectedUploadId,
                ...selectedUploadData,
                is_public: selectedUploadData.is_public ? 1 : 0
            };

            const res = await axios.put('http://localhost:5000/api/my-uploads/update', payload);

            if (res.data.success) {
                alert('성공적으로 저장되었습니다!');
            } else {
                alert('저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('저장 중 오류:', error);
            alert('서버 오류가 발생했습니다.');
        }
    };

    const handleDashboardClick = () => navigate('/setting');
    const togglePublic = () => setSelectedUploadData(prev => ({ ...prev, is_public: !prev.is_public }));

    // 검색 필터링
    const filteredPurchases = purchasedArtworks.filter(art => {
        const term = searchTerm.toLowerCase();
        return art.title.toLowerCase().includes(term) || art.artist_name.toLowerCase().includes(term);
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentGridItems = filteredPurchases.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);

    // 슬라이드 드래그 핸들러
    const handleMouseDown = (e) => { setIsDown(true); setIsDragging(false); setStartY(e.pageY - sliderRef.current.offsetTop); setScrollTop(sliderRef.current.scrollTop); };
    const handleMouseLeave = () => { setIsDown(false); setIsDragging(false); };
    const handleMouseUp = () => { setIsDown(false); setTimeout(() => setIsDragging(false), 0); };
    const handleMouseMove = (e) => { if (!isDown) return; e.preventDefault(); const y = e.pageY - sliderRef.current.offsetTop; const walk = (y - startY) * 2; if (Math.abs(walk) > 5) setIsDragging(true); sliderRef.current.scrollTop = scrollTop - walk; };

    const boxStyle = { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', marginBottom: '20px', textAlign: 'left', backgroundColor: '#fff' };
    const labelStyle = { fontWeight: 'bold', marginBottom: '10px', color: '#333' };

    return (
        <div className="archive-page">
            <Header />
            <main className="archive-container">
                <div className="archive-header">
                    <h1 className="archive-title">{userNickname ? `${userNickname}'s Library` : 'My Library'}</h1>
                    <div className="archive-count">
                        <span className="count-number">{filteredPurchases.length}</span>
                        <span className="count-label">보관 중인 작품</span>
                    </div>
                    <div className="search-bar">
                        <input type="text" placeholder="작품명 또는 작가 검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <button className="search-btn">검색</button>
                    </div>
                </div>

                <div className="filter-bar">
                    <button className={`filter-btn ${activeFilter === '내 작품 목록' ? 'active' : ''}`}>내 작품 목록</button>
                </div>

                {/* 상단 그리드 (구매 목록) */}
                <section className="artwork-grid-container">
                    {filteredPurchases.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                            <p style={{marginBottom: '10px'}}>{searchTerm ? `'${searchTerm}'에 대한 검색 결과가 없습니다.` : '보관함이 비어있습니다.'}</p>
                            {!searchTerm && <Link to="/explore" style={{color: mainColor, fontWeight: 'bold'}}>작품 탐색하러 가기 &gt;</Link>}
                        </div>
                    ) : (
                        <div className="artwork-grid">
                            {currentGridItems.map(art => (
                                <Link to={`/archive/detail/${art.id}`} key={art.id} className="artwork-link">
                                    <div className="artwork-item">
                                        {/* ★ 여기서 getImageUrl 함수를 사용해서 이미지가 정상적으로 뜨도록 수정 */}
                                        <img src={getImageUrl(art.image_url)} alt={art.title} className="item-thumbnail" 
                                             onError={(e) => {e.target.src = 'https://via.placeholder.com/300?text=No+Image'}} />
                                        <div className="item-info">
                                            <p className="item-title">{art.title}</p>
                                            <p className="item-artist">{art.artist_name}</p>
                                            <p className="item-date">{art.date}</p>
                                            <span className="item-badge">{art.badge}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                <button key={num} onClick={() => setCurrentPage(num)}
                                    style={{ padding: '5px 10px', border: '1px solid #ddd', backgroundColor: currentPage === num ? mainColor : 'white', color: currentPage === num ? 'white' : 'black', borderRadius: '5px', cursor: 'pointer' }}>
                                    {num}
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {/* 하단 관리 섹션 */}
                <section className="new-dashboard-section">
                    <div className="management-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="management-title">작품 관리</h2>
                        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div className="upload-group" onClick={handleUploadClick} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
                                <span style={{ fontSize: '16px', fontWeight: '500' }}>작품 업로드</span>
                                <div style={{ width: '32px', height: '32px', backgroundColor: mainColor, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold', paddingBottom: '4px' }}>+</div>
                            </div>
                            <button className="dashboard-check-btn" onClick={handleDashboardClick}>수익 대시보드 확인하기 &gt;</button>
                        </div>
                    </div>

                    <div className="artwork-info-section">
                        <div className="artwork-content" style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: '30px' }}>
                            {/* 좌측 슬라이더 */}
                            <div className="vertical-slider-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '160px', paddingTop: '54px' }}>
                                <div style={{ position: 'relative', width: '100%', height: '520px' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '60px', background: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))', pointerEvents: 'none', zIndex: 10 }}></div>
                                    <div className="image-list-scrollable" ref={sliderRef}
                                         onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
                                         style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', height: '100%', overflowY: 'auto', cursor: isDown ? 'grabbing' : 'grab', paddingBottom: '20px', scrollbarWidth: 'none' }}>
                                        
                                        {uploadedArtworks.length === 0 ? <p style={{color:'white', marginTop:'20px'}}>내역 없음</p> : 
                                            uploadedArtworks.map(item => (
                                                <div key={item.id} 
                                                     className={`image-item ${selectedUploadId === item.id ? 'selected' : ''}`} 
                                                     onClick={() => handleUploadSelect(item)}
                                                     style={{ textAlign: 'center', flexShrink: 0, position: 'relative' }}> 
                                                    
                                                    {/* ★ [수정 1] NEW 배지 위치 수정 (Bottom-Left) */}
                                                    {item.isReal && (
                                                        <div style={{ 
                                                            position: 'absolute', 
                                                            bottom: '5px',   // 하단
                                                            left: '5px',     // 왼쪽
                                                            backgroundColor: '#E53935', 
                                                            color: 'white', 
                                                            fontSize: '10px', 
                                                            fontWeight: 'bold', 
                                                            padding: '2px 6px', 
                                                            borderRadius: '4px', 
                                                            zIndex: 10, 
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.5)' 
                                                        }}>
                                                            NEW
                                                        </div>
                                                    )}

                                                    {/* ★ 관리 섹션 이미지도 getImageUrl 함수 적용 */}
                                                    <img src={getImageUrl(item.image_url)} alt={item.title} className="small-image" 
                                                         style={{ width: selectedUploadId === item.id ? '120px' : '70px', height: selectedUploadId === item.id ? '120px' : '70px', objectFit: 'cover', borderRadius: '8px', border: selectedUploadId === item.id ? `3px solid ${mainColor}` : '1px solid #ddd', transition: 'all 0.3s ease' }} 
                                                         onError={(e) => {e.target.src = 'https://via.placeholder.com/150?text=No+Img'}}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60px', background: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))', pointerEvents: 'none', zIndex: 10 }}></div>
                                </div>
                            </div>

                            {/* 우측 폼 (생략 없이 유지) */}
                            <div className="info-form" style={{ flex: 1 }}>
                                <div className="info-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h3 className="artwork-info-title" style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{selectedUploadData.title || '작품을 선택해주세요'}</h3>
                                    <button onClick={togglePublic} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 15px', borderRadius: '20px', border: '1px solid #ddd', background: selectedUploadData.is_public ? '#E3F2FD' : 'white', color: selectedUploadData.is_public ? '#1976D2' : '#666', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                                        {selectedUploadData.is_public ? '공개' : '비공개'} 👁
                                    </button>
                                </div>
                                <div className="form-section" style={boxStyle}>
                                    <div className="form-label" style={labelStyle}>작품 설명</div>
                                    <textarea name="description" value={selectedUploadData.description} onChange={handleFormChange} style={{ width: '100%', height: '80px', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', resize: 'none', color: '#000' }}></textarea>
                                </div>
                                <div className="form-section" style={boxStyle}>
                                    <div className="form-label" style={labelStyle}>가격 정보</div>
                                    <div className="price-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input type="text" name="price" value={selectedUploadData.price} onChange={handleFormChange} className="price-input" style={{ flex: 1, height: '45px', padding: '0 10px', border: '1px solid #ddd', borderRadius: '4px', color: '#000' }} />
                                        <button onClick={handleAiPriceClick} style={{ height: '45px', padding: '0 20px', backgroundColor: mainColor, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>AI 가격 제안</button>
                                    </div>
                                </div>
                                <div className="form-section" style={boxStyle}>
                                    <div className="form-label" style={labelStyle}>판매자 자체 제작률</div>
                                    <div className="rate-inputs" style={{ display: 'flex', gap: '10px' }}>
                                        <input type="text" name="ai_tool" value={selectedUploadData.ai_tool} onChange={handleFormChange} placeholder="AI 사용 툴" style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', color: '#000' }} />
                                        <input type="text" name="ai_ratio" value={selectedUploadData.ai_ratio} onChange={handleFormChange} placeholder="AI 사용 비율" style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', color: '#000' }} />
                                    </div>
                                </div>
                                <div className="form-section" style={boxStyle}>
                                    <div className="form-label" style={labelStyle}>프롬프트</div>
                                    <textarea name="prompt" value={selectedUploadData.prompt} onChange={handleFormChange} style={{ width: '100%', height: '80px', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', resize: 'none', color: '#000' }}></textarea>
                                </div>
                                <div className="form-row" style={{ marginTop: '20px' }}>
                                    <button onClick={handleSaveClick} style={{ width: '100%', padding: '15px 0', backgroundColor: mainColor, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>수정 사항 저장하기</button>
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