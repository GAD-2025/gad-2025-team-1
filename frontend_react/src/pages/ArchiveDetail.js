import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import { useParams } from 'react-router-dom'; // URL 파라미터 가져오기
import axios from 'axios'; // DB 통신
import './ArchiveDetail.css';

const ArchiveDetail = () => {
    // --- [Router] URL에서 id 가져오기 ---
    const { id } = useParams();

    // --- [State] 데이터 상태 관리 ---
    const [activeTab, setActiveTab] = useState('info'); // 'info' | 'edit'
    
    // DB에서 가져온 작품 정보를 저장할 State (초기값 null)
    const [artworkInfo, setArtworkInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 프롬프트 및 편집 상태
    const [promptText, setPromptText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editablePrompt, setEditablePrompt] = useState('');

    // 채팅 관련 상태
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'ai', text: '안녕하세요! 이 작품에 대해 궁금한 점이 있거나 새로운 아이디어가 필요하신가요?' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef(null);

    // 모달 상태
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState('');

    // --- [Effect] DB 데이터 가져오기 ---
    useEffect(() => {
        const fetchArtworkDetail = async () => {
            try {
                // API 호출: ID에 해당하는 작품 상세 정보 요청
                // (백엔드 엔드포인트는 상황에 맞게 수정 필요, 여기선 /api/artwork/:id 로 가정)
                const response = await axios.get(`http://localhost:5000/api/artwork/${id}`);
                
                if (response.data.success) {
                    const data = response.data.data;
                    
                    // DB 데이터를 State에 매핑
                    setArtworkInfo({
                        title: data.title,
                        artist: data.artist_name || 'Unknown', // DB 컬럼명에 맞게 조정
                        createdDate: new Date(data.created_at).toLocaleDateString(),
                        modifiedDate: new Date(data.updated_at || data.created_at).toLocaleDateString(),
                        category: data.category || '일러스트',
                        rate: data.ai_ratio ? `${data.ai_ratio}` : 'Unknown', // 예: 80%
                        imageUrl: data.image_url // 이미지 경로
                    });

                    // 프롬프트 상태 초기화
                    setPromptText(data.prompt || '프롬프트 정보가 없습니다.');
                    setEditablePrompt(data.prompt || '');
                }
            } catch (error) {
                console.error("작품 상세 정보 로딩 실패:", error);
                // 에러 시 더미 데이터 혹은 경고창 (테스트용 더미 데이터 설정 가능)
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchArtworkDetail();
        }
    }, [id]);

    // 채팅 스크롤 하단 고정
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // --- [Handler] 핸들러 함수 ---

    const handleTabChange = (tab) => setActiveTab(tab);

    const handleEditClick = () => {
        setEditablePrompt(promptText);
        setIsEditing(true);
    };

    // ★ 프롬프트 DB 저장 핸들러
    const handleSaveClick = async () => {
        try {
            // DB 업데이트 요청
            const response = await axios.put(`http://localhost:5000/api/artwork/${id}/prompt`, {
                prompt: editablePrompt
            });

            if (response.data.success) {
                setPromptText(editablePrompt);
                setIsEditing(false);
                alert('프롬프트가 수정되어 DB에 저장되었습니다.');
                
                // 수정된 날짜 등 UI 갱신이 필요하다면 여기서 artworkInfo 업데이트
                setArtworkInfo(prev => ({
                    ...prev,
                    modifiedDate: new Date().toLocaleDateString()
                }));
            } else {
                alert('저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('프롬프트 저장 오류:', error);
            alert('서버 오류로 저장하지 못했습니다.');
        }
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const newUserMsg = { id: Date.now(), sender: 'user', text: chatInput };
        setChatMessages(prev => [...prev, newUserMsg]);
        setChatInput('');

        setTimeout(() => {
            const aiResponse = { id: Date.now() + 1, sender: 'ai', text: '현재 AI 서버와 연결되지 않았습니다. (임시 응답)' };
            setChatMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    const handleIdeaClick = (question) => {
        const newUserMsg = { id: Date.now(), sender: 'user', text: question };
        setChatMessages(prev => [...prev, newUserMsg]);

        setTimeout(() => {
            let answer = '';
            if (question.includes('색상')) {
                answer = '색상을 변경하려면 프롬프트에서 "파스텔 톤"을 "비비드한 네온 컬러" 또는 "흑백"으로 변경해보세요.';
            } else if (question.includes('배경')) {
                answer = '배경을 바꾸려면 "카페 아이템들이 산재해 있다" 대신 "우주 공간에 떠 있다" 또는 "숲속 한가운데"로 묘사해보세요.';
            } else if (question.includes('판타지')) {
                answer = '판타지 테마를 위해 "날개가 달린 고양이", "마법 가루가 뿌려진", "신비로운 빛" 같은 키워드를 추가해보세요.';
            } else if (question.includes('없앨')) {
                answer = '특정 물체를 없애려면 "Negative Prompt(부정 프롬프트)"에 해당 물체의 이름을 적거나, Inpainting 기능을 사용하여 해당 영역을 지우고 다시 생성할 수 있습니다.';
            } else {
                answer = '좋은 아이디어네요! 프롬프트에 구체적인 묘사를 추가해보세요.';
            }
            
            const aiResponse = { id: Date.now() + 1, sender: 'ai', text: answer };
            setChatMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    const handleThumbnailClick = (imgSrc) => {
        setModalImage(imgSrc);
        setShowModal(true);
    };
    const handleModalClose = () => setShowModal(false);

    // --- 스타일 정의 ---
    const pageLayout = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        position: 'relative',
        minHeight: '100vh'
    };

    const leftSectionStyle = {
        position: 'fixed',
        top: '120px',
        width: '320px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    };

    const rightSectionStyle = {
        marginLeft: '360px',
        width: 'calc(100% - 360px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        minHeight: '800px'
    };

    const tabButtonStyle = (isActive) => ({
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: 'none',
        borderBottom: isActive ? '3px solid #FF6B00' : '3px solid transparent',
        backgroundColor: 'transparent',
        color: isActive ? '#FF6B00' : '#888',
        transition: 'all 0.3s ease'
    });

    const infoBoxStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '30px',
        color: '#fff'
    };

    // 로딩 중일 때 표시할 UI
    if (isLoading) {
        return (
            <div className="archive-detail-page" style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white' }}>
                <Header />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <h2>작품 정보를 불러오는 중입니다...</h2>
                </div>
            </div>
        );
    }

    // 데이터가 없을 때 (에러 등)
    if (!artworkInfo) {
        return (
            <div className="archive-detail-page" style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white' }}>
                <Header />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <h2>작품 정보를 찾을 수 없습니다.</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="archive-detail-page" style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white' }}>
            <div className="starfield-bg"></div>
            <Header />

            <main style={pageLayout}>
                {/* 1. 좌측 섹션: Fixed (이미지 연동) */}
                <aside style={leftSectionStyle}>
                    <div 
                        style={{ 
                            width: '100%', 
                            aspectRatio: '1/1', 
                            borderRadius: '16px', 
                            overflow: 'hidden', 
                            border: '1px solid #333',
                            cursor: 'pointer'
                        }}
                        // DB에서 가져온 이미지 경로 사용 (process.env.PUBLIC_URL 조합)
                        onClick={() => handleThumbnailClick(`${process.env.PUBLIC_URL}${artworkInfo.imageUrl}`)}
                    >
                        <img 
                            src={`${process.env.PUBLIC_URL}${artworkInfo.imageUrl}`} 
                            alt={artworkInfo.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {e.target.src = 'https://via.placeholder.com/320x320?text=No+Image'}} // 이미지 에러 처리
                        />
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#fff' }}>
                        {artworkInfo.title}
                    </h1>
                </aside>

                {/* 2. 우측 섹션: 정보 연동 */}
                <section style={rightSectionStyle}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #333' }}>
                        <button style={tabButtonStyle(activeTab === 'info')} onClick={() => handleTabChange('info')}>
                            작품 정보
                        </button>
                        <button style={tabButtonStyle(activeTab === 'edit')} onClick={() => handleTabChange('edit')}>
                            프롬프트 편집
                        </button>
                    </div>

                    {/* 작품 정보 탭 */}
                    {activeTab === 'info' && (
                        <div style={infoBoxStyle}>
                            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>상세 정보</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', lineHeight: '1.6' }}>
                                <span style={{ color: '#aaa' }}>제목</span><span>{artworkInfo.title}</span>
                                <span style={{ color: '#aaa' }}>작가</span><span>{artworkInfo.artist}</span>
                                <span style={{ color: '#aaa' }}>생성일</span><span>{artworkInfo.createdDate}</span>
                                <span style={{ color: '#aaa' }}>최종 수정일</span><span>{artworkInfo.modifiedDate}</span>
                                <span style={{ color: '#aaa' }}>카테고리</span><span>{artworkInfo.category}</span>
                                <span style={{ color: '#aaa' }}>자체 제작률</span><span>{artworkInfo.rate}</span>
                                <span style={{ color: '#aaa' }}>프롬프트</span>
                                <span style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px', fontSize: '0.9em', wordBreak: 'break-all' }}>
                                    {promptText}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* 프롬프트 편집 탭 */}
                    {activeTab === 'edit' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={infoBoxStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h3 style={{ margin: 0 }}>프롬프트</h3>
                                    {isEditing ? (
                                        <button 
                                            onClick={handleSaveClick}
                                            style={{ backgroundColor: '#FF6B00', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            저장하기
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={handleEditClick}
                                            style={{ backgroundColor: '#333', color: 'white', border: '1px solid #555', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            텍스트 편집
                                        </button>
                                    )}
                                </div>
                                {isEditing ? (
                                    <textarea 
                                        value={editablePrompt}
                                        onChange={(e) => setEditablePrompt(e.target.value)}
                                        style={{ width: '100%', height: '150px', backgroundColor: '#222', color: '#fff', border: '1px solid #FF6B00', borderRadius: '8px', padding: '15px', lineHeight: '1.6', fontSize: '15px', resize: 'vertical' }}
                                    />
                                ) : (
                                    <div style={{ minHeight: '150px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '15px', lineHeight: '1.6', fontSize: '15px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                        {promptText}
                                    </div>
                                )}
                            </div>

                            <div style={{ ...infoBoxStyle, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <h3 style={{ margin: 0, color: '#FF6B00' }}>아이디어 PLUS +</h3>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                    {[
                                        "물체의 색상을 바꾸고 싶으면 어떻게 하나요?",
                                        "이미지의 배경은 어떻게 변경하나요?",
                                        "판타지 테마로 바꾸고 싶으면 어떻게 하나요?",
                                        "이미지 속 물체를 없앨 수도 있나요?"
                                    ].map((q, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => handleIdeaClick(q)}
                                            style={{ 
                                                padding: '12px', borderRadius: '8px', border: '1px solid #444', 
                                                backgroundColor: '#2a2a2a', color: '#ddd', cursor: 'pointer', textAlign: 'left', fontSize: '13px' 
                                            }}
                                            onMouseOver={(e) => e.target.style.borderColor = '#FF6B00'}
                                            onMouseOut={(e) => e.target.style.borderColor = '#444'}
                                        >
                                            💡 {q}
                                        </button>
                                    ))}
                                </div>

                                {/* AI 채팅 인터페이스 */}
                                <div className="chat-interface" style={{ border: '1px solid #444', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#1a1a1a', height: '400px', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {chatMessages.map((msg) => (
                                            <div key={msg.id} style={{ 
                                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                                maxWidth: '80%',
                                                backgroundColor: msg.sender === 'user' ? '#FF6B00' : '#333',
                                                color: 'white',
                                                padding: '10px 15px',
                                                borderRadius: '12px',
                                                fontSize: '14px',
                                                lineHeight: '1.4'
                                            }}>
                                                {msg.text}
                                            </div>
                                        ))}
                                        <div ref={chatEndRef}></div>
                                    </div>
                                    <form onSubmit={handleChatSubmit} style={{ display: 'flex', borderTop: '1px solid #444', padding: '10px', backgroundColor: '#222' }}>
                                        <input 
                                            type="text" 
                                            value={chatInput} 
                                            onChange={(e) => setChatInput(e.target.value)}
                                            placeholder="AI에게 무엇이든 물어보세요..." 
                                            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#333', color: 'white', marginRight: '10px' }}
                                        />
                                        <button type="submit" style={{ padding: '0 20px', borderRadius: '4px', border: 'none', backgroundColor: '#555', color: 'white', cursor: 'pointer' }}>
                                            전송
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* 이미지 확대 모달 */}
            {showModal && (
                <div 
                    id="imageModal" 
                    style={{
                        display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.9)', zIndex: 1000, justifyContent: 'center', alignItems: 'center', cursor: 'pointer'
                    }}
                    onClick={handleModalClose}
                >
                    <img 
                        src={modalImage} 
                        alt="확대 이미지" 
                        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '10px' }}
                    />
                </div>
            )}
        </div>
    );
}

export default ArchiveDetail;