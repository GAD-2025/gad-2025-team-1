import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import './ArchiveDetail.css';

const ArchiveDetail = () => {
    // --- State 관리 ---
    const [activeTab, setActiveTab] = useState('info'); // 'info' | 'edit'
    
    // 작품 정보 데이터
    const artworkInfo = {
        title: '동화의 끝',
        artist: '404 Creator',
        createdDate: '25/10/1',
        modifiedDate: '25/10/4',
        category: '일러스트',
        rate: '80%' 
    };

    // 프롬프트 및 편집 상태
    const [promptText, setPromptText] = useState(`우아한 고양이가 커다란 찻잔 위에 앉아 있으며, 주변에는 커피와 초콜릿, 아이스크림 같은 카페 아이템들이 산재해 있다. 따뜻하고 아늑한 분위기, 파스텔 톤의 색감.`);
    const [isEditing, setIsEditing] = useState(false);
    const [editablePrompt, setEditablePrompt] = useState(promptText);

    // 채팅 관련 상태
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'ai', text: '안녕하세요! 이 작품에 대해 궁금한 점이 있거나 새로운 아이디어가 필요하신가요?' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef(null);

    // 모달 상태
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState('');

    // --- 핸들러 함수 ---

    // 채팅 스크롤 하단 고정
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleTabChange = (tab) => setActiveTab(tab);

    const handleEditClick = () => {
        setEditablePrompt(promptText);
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setPromptText(editablePrompt);
        setIsEditing(false);
        alert('프롬프트가 수정된 버전으로 저장되었습니다.');
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

    // 아이디어 버튼 클릭 처리 (질문 추가됨)
    const handleIdeaClick = (question) => {
        const newUserMsg = { id: Date.now(), sender: 'user', text: question };
        setChatMessages(prev => [...prev, newUserMsg]);

        // AI 응답 시뮬레이션
        setTimeout(() => {
            let answer = '';
            if (question.includes('색상')) {
                answer = '색상을 변경하려면 프롬프트에서 "파스텔 톤"을 "비비드한 네온 컬러" 또는 "흑백"으로 변경해보세요.';
            } else if (question.includes('배경')) {
                answer = '배경을 바꾸려면 "카페 아이템들이 산재해 있다" 대신 "우주 공간에 떠 있다" 또는 "숲속 한가운데"로 묘사해보세요.';
            } else if (question.includes('판타지')) {
                answer = '판타지 테마를 위해 "날개가 달린 고양이", "마법 가루가 뿌려진", "신비로운 빛" 같은 키워드를 추가해보세요.';
            } else if (question.includes('없앨')) {
                // ★ 추가된 질문에 대한 답변 로직
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

    // ★ 좌측 고정 섹션 스타일 (fixed 적용)
    // 화면 스크롤과 무관하게 뷰포트에 고정됩니다.
    const leftSectionStyle = {
        position: 'fixed',    // ★ 요청하신 fix 적용
        top: '120px',         // 헤더 아래 위치
        width: '320px',       // 고정 너비 지정
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    };

    // ★ 우측 콘텐츠 섹션 스타일
    // 좌측 섹션이 fixed로 뜨면서 공간을 차지하지 않게 되므로, margin-left로 공간을 만들어줍니다.
    const rightSectionStyle = {
        marginLeft: '360px',  // ★ 좌측 섹션 너비(320px) + 간격(40px) 확보
        width: 'calc(100% - 360px)', // 남은 공간 사용
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

    return (
        <div className="archive-detail-page" style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white' }}>
            <div className="starfield-bg"></div>
            <Header />

            <main style={pageLayout}>
                {/* 1. 좌측 섹션: Fixed (화면 고정) */}
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
                        onClick={() => handleThumbnailClick(`${process.env.PUBLIC_URL}/images/이미지5.png`)}
                    >
                        <img 
                            src={`${process.env.PUBLIC_URL}/images/이미지5.png`} 
                            alt={artworkInfo.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#fff' }}>
                        {artworkInfo.title}
                    </h1>
                </aside>

                {/* 2. 우측 섹션: 스크롤 가능 (margin-left로 위치 잡음) */}
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
                                <span style={{ color: '#aaa' }}>구매일</span><span>{artworkInfo.createdDate}</span>
                                <span style={{ color: '#aaa' }}>최종 수정일</span><span>{artworkInfo.modifiedDate}</span>
                                <span style={{ color: '#aaa' }}>카테고리</span><span>{artworkInfo.category}</span>
                                <span style={{ color: '#aaa' }}>자체 제작률</span><span>{artworkInfo.rate}</span>
                                <span style={{ color: '#aaa' }}>프롬프트</span>
                                <span style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px', fontSize: '0.9em' }}>
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
                                    <div style={{ minHeight: '150px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '15px', lineHeight: '1.6', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                                        {promptText}
                                    </div>
                                )}
                            </div>

                            <div style={{ ...infoBoxStyle, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <h3 style={{ margin: 0, color: '#FF6B00' }}>아이디어 PLUS +</h3>
                                
                                {/* 질문 버튼 리스트 (4번째 질문 추가 완료) */}
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