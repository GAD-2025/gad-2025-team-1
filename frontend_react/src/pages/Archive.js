import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Archive.css';

const Archive = () => {
    const navigate = useNavigate();
    
    // --- [State] 데이터 상태 ---
    const [userNickname, setUserNickname] = useState('');
    
    // 1. 상단 그리드용 (구매한 작품)
    const [purchasedArtworks, setPurchasedArtworks] = useState([]); 
    
    // 2. 하단 관리용 (내가 업로드한 작품)
    const [uploadedArtworks, setUploadedArtworks] = useState([]); 
    
    // 3. 하단 선택된 작품 관리 상태
    const [selectedUploadId, setSelectedUploadId] = useState(null);
    const [selectedUploadData, setSelectedUploadData] = useState({
        title: '', description: '', price: '', 
        ai_tool: '', ai_ratio: '', prompt: '', is_public: true
    });

    const [isLoading, setIsLoading] = useState(true);

    // 기타 UI 상태
    const [activeFilter, setActiveFilter] = useState('내 작품 목록');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // 드래그 슬라이드 Refs & State
    const sliderRef = useRef(null);
    const [isDown, setIsDown] = useState(false);
    const [isDragging, setIsDragging] = useState(false); 
    const [startY, setStartY] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const mainColor = '#FF6B00';
    const currentUserId = 'admin'; // 현재 로그인 유저 (DB의 username과 일치해야 함)

    // =========================================================
    // [Function] 데이터 가져오기 (재사용을 위해 함수로 분리)
    // =========================================================
    const fetchAllData = async () => {
        try {
            // 1. 유저 닉네임
            const userRes = await axios.get(`http://localhost:5000/api/user-info/${currentUserId}`);
            if (userRes.data.success) setUserNickname(userRes.data.nickname);

            // 2. 구매 목록 가져오기 (상단 그리드)
            const purchaseRes = await axios.get(`http://localhost:5000/api/purchases/${currentUserId}`);
            if (purchaseRes.data.success) {
                const mappedPurchases = purchaseRes.data.data.map(item => ({
                    ...item,
                    date: new Date(item.purchased_at).toLocaleDateString(),
                    badge: item.category === '일러스트' ? 'Art' : 'AI'
                }));
                setPurchasedArtworks(mappedPurchases);
            }

            // 3. 내 업로드 목록 가져오기 (하단 슬라이더)
            const uploadRes = await axios.get(`http://localhost:5000/api/my-uploads/${currentUserId}`);
            if (uploadRes.data.success) {
                setUploadedArtworks(uploadRes.data.data);
                
                // 처음 로딩 시, 선택된 항목이 없으면 첫 번째 항목 선택
                // 단, 저장 후 리로딩일 때는 기존 선택 유지 로직이 필요할 수 있음
                if (!selectedUploadId && uploadRes.data.data.length > 0) {
                    const firstItem = uploadRes.data.data[0];
                    setSelectedUploadId(firstItem.id);
                    setSelectedUploadData({
                        title: firstItem.title,
                        description: firstItem.description || '',
                        price: firstItem.price || '',
                        ai_tool: firstItem.ai_tool || '',
                        ai_ratio: firstItem.ai_ratio || '',
                        prompt: firstItem.prompt || '',
                        is_public: firstItem.is_public === 1 // DB에서 1은 true
                    });
                }
            }

        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 초기 로딩
    useEffect(() => {
        fetchAllData();
    }, []);

    // --- [Handler] 하단 슬라이더 이미지 클릭 시 폼 데이터 업데이트 ---
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
            is_public: item.is_public === 1
        });
    };

    // --- [Handler] 폼 입력 변경 핸들러 ---
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setSelectedUploadData(prev => ({ ...prev, [name]: value }));
    };

    const handleUploadClick = () => navigate('/upload');
    const handleAiPriceClick = () => alert(`AI 분석 결과: 적정가는 ${parseInt(selectedUploadData.price || 0) * 1.1}원 입니다.`);

    // --- [Handler] ★ 저장하기 버튼 (DB 연동) ---
    const handleSaveClick = async () => {
        if (!selectedUploadId) return;

        try {
            const payload = {
                id: selectedUploadId,
                ...selectedUploadData
            };

            const res = await axios.put('http://localhost:5000/api/my-uploads/update', payload);

            if (res.data.success) {
                alert('성공적으로 저장되었습니다!');
                // 저장 후 목록을 다시 불러와서 최신 상태 유지 (가격 변경 등이 리스트에도 반영되도록)
                // 단, 현재 선택된 폼 데이터는 유지
                const uploadRes = await axios.get(`http://localhost:5000/api/my-uploads/${currentUserId}`);
                if (uploadRes.data.success) {
                    setUploadedArtworks(uploadRes.data.data);
                }
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

    // 페이지네이션
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentGridItems = purchasedArtworks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(purchasedArtworks.length / itemsPerPage);

    // 드래그 슬라이드 이벤트
    const handleMouseDown = (e) => { 
        setIsDown(true); 
        setIsDragging(false); 
        setStartY(e.pageY - sliderRef.current.offsetTop); 
        setScrollTop(sliderRef.current.scrollTop); 
    };
    
    const handleMouseLeave = () => {
        setIsDown(false);
        setIsDragging(false);
    };
    
    const handleMouseUp = () => { 
        setIsDown(false);
        setTimeout(() => setIsDragging(false), 0); 
    };
    
    const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const y = e.pageY - sliderRef.current.offsetTop;
        const walk = (y - startY) * 2;
        
        if (Math.abs(walk) > 5) {
            setIsDragging(true);
        }
        sliderRef.current.scrollTop = scrollTop - walk;
    };

    // 스타일
    const boxStyle = { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', marginBottom: '20px', textAlign: 'left', backgroundColor: '#fff' };
    const labelStyle = { fontWeight: 'bold', marginBottom: '10px', color: '#333' };

    // --- [렌더링] 상단 그리드 (구매 목록) ---
    const renderArtworkGrid = () => (
        <section className="artwork-grid-container">
            {purchasedArtworks.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>구매한 작품이 없습니다.</div>
            ) : (
                <div className="artwork-grid">
                    {currentGridItems.map(art => (
                        <Link to={`/archive/detail/${art.id}`} key={art.id} className="artwork-link">
                            <div className="artwork-item">
                                <img src={`${process.env.PUBLIC_URL}${art.image_url}`} alt={art.title} className="item-thumbnail" />
                                <div className="item-info">
                                    <p className="item-title">{art.title}</p>
                                    <p className="item-artist">Artist: {art.artist_name}</p>
                                    <p className="item-date">구매일: {art.date}</p>
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
    );

    return (
        <div className="archive-page">
            <Header />
            <main className="archive-container">
                {/* 상단 헤더 */}
                <div className="archive-header">
                    <h1 className="archive-title">{userNickname ? `${userNickname}'s Library` : 'Library'}</h1>
                    <div className="archive-count">
                        <span className="count-number">{purchasedArtworks.length}</span>
                        <span className="count-label">보관 중인 작품</span>
                    </div>
                    <div className="search-bar">
                        <input type="text" placeholder="검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <button className="search-btn">검색</button>
                    </div>
                </div>

                {/* 필터 및 업로드 버튼 */}
                <div className="filter-bar" style={{ display: 'flex', alignItems: 'center' }}>
                    <button className={`filter-btn ${activeFilter === '내 작품 목록' ? 'active' : ''}`}>내 작품 목록</button>
                    <div className="upload-group" onClick={handleUploadClick} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>작품 업로드</span>
                        <div style={{ width: '32px', height: '32px', backgroundColor: mainColor, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold', paddingBottom: '4px' }}>+</div>
                    </div>
                </div>

                {/* 상단: 구매한 작품 그리드 */}
                {renderArtworkGrid()}

                {/* 하단: 작품 관리 섹션 (내가 업로드한 작품) */}
                <section className="new-dashboard-section">
                    <div className="management-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="management-title">작품 관리)</h2>
                        <button className="dashboard-check-btn" onClick={handleDashboardClick}>수익 대시보드 확인하기 &gt;</button>
                    </div>

                    <div className="artwork-info-section">
                        <div className="artwork-content" style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: '30px' }}>
                            
                            {/* 좌측 슬라이더: 업로드한 작품 리스트 */}
                            <div className="vertical-slider-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '160px', paddingTop: '54px' }}>
                                <div style={{ position: 'relative', width: '100%', height: '520px' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '60px', background: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))', pointerEvents: 'none', zIndex: 10 }}></div>
                                    
                                    <div className="image-list-scrollable" ref={sliderRef}
                                        onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
                                        style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', height: '100%', overflowY: 'auto', cursor: isDown ? 'grabbing' : 'grab', paddingBottom: '20px', scrollbarWidth: 'none' }}>
                                        
                                        {uploadedArtworks.length === 0 ? <p style={{color:'white', marginTop:'20px'}}>업로드 내역 없음</p> : 
                                            uploadedArtworks.map(item => (
                                                <div key={item.id} 
                                                     className={`image-item ${selectedUploadId === item.id ? 'selected' : ''}`} 
                                                     onClick={() => handleUploadSelect(item)}
                                                     style={{ textAlign: 'center', flexShrink: 0 }}>
                                                    <img src={`${process.env.PUBLIC_URL}${item.image_url}`} alt={item.title} className="small-image" 
                                                         style={{ width: selectedUploadId === item.id ? '120px' : '70px', height: selectedUploadId === item.id ? '120px' : '70px', objectFit: 'cover', borderRadius: '8px', border: selectedUploadId === item.id ? `3px solid ${mainColor}` : '1px solid #ddd', transition: 'all 0.3s ease' }} />
                                                </div>
                                            ))
                                        }
                                    </div>

                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60px', background: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))', pointerEvents: 'none', zIndex: 10 }}></div>
                                </div>
                            </div>

                            {/* 우측 입력 폼: 선택된 작품 정보 표시 */}
                            <div className="info-form" style={{ flex: 1 }}>
                                <div className="info-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h3 className="artwork-info-title" style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                                        {selectedUploadData.title || '작품을 선택해주세요'}
                                    </h3>
                                    <button onClick={togglePublic} 
                                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 15px', borderRadius: '20px', border: '1px solid #ddd', background: selectedUploadData.is_public ? '#E3F2FD' : 'white', color: selectedUploadData.is_public ? '#1976D2' : '#666', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                                        {selectedUploadData.is_public ? '공개' : '비공개'} 👁
                                    </button>
                                </div>

                                <div className="form-section" style={boxStyle}>
                                    <div className="form-label" style={labelStyle}>작품 설명</div>
                                    <textarea name="description" value={selectedUploadData.description} onChange={handleFormChange}
                                        style={{ width: '100%', height: '80px', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', resize: 'none', color: '#000' }}></textarea>
                                </div>

                                <div className="form-section" style={boxStyle}>
                                    <div className="form-label" style={labelStyle}>가격 정보</div>
                                    <div className="price-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input type="text" name="price" value={selectedUploadData.price} onChange={handleFormChange}
                                            className="price-input" style={{ flex: 1, height: '45px', padding: '0 10px', border: '1px solid #ddd', borderRadius: '4px', color: '#000' }} />
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
                                    <textarea name="prompt" value={selectedUploadData.prompt} onChange={handleFormChange}
                                        style={{ width: '100%', height: '80px', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', resize: 'none', color: '#000' }}></textarea>
                                </div>

                                <div className="form-row" style={{ marginTop: '20px' }}>
                                    <button onClick={handleSaveClick} style={{ width: '100%', padding: '15px 0', backgroundColor: mainColor, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                                        수정 사항 저장하기
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