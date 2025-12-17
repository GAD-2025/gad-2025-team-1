import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ArchiveDetail.css';

const ArchiveDetail = () => {
    // URL에서 작품 ID 가져오기 (문자열 형태)
    const { id } = useParams();
    const navigate = useNavigate();

    // ----------------------------------------------------------------------
    // State 관리
    // ----------------------------------------------------------------------
    const [activeTab, setActiveTab] = useState('info'); 
    const [artworkInfo, setArtworkInfo] = useState(null); // 작품 정보
    const [isLoading, setIsLoading] = useState(true);     // 로딩 상태

    // 프롬프트 및 편집 상태
    const [promptText, setPromptText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editablePrompt, setEditablePrompt] = useState('');

    // 채팅 상태
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'ai', text: '안녕하세요! 이 작품에 대해 궁금한 점이 있거나 새로운 아이디어가 필요하신가요?' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef(null);

    // 이미지 확대 모달
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState('');

    // ----------------------------------------------------------------------
    // [핵심] DB 데이터 가져오기
    // ----------------------------------------------------------------------
    useEffect(() => {
        const fetchArtworkDetail = async () => {
            setIsLoading(true);
            try {
                // 1. 전체 작품 목록 가져오기
                const response = await axios.get(process.env.REACT_APP_API_BASE_URL + '/api/artworks');
                
                // [디버깅용] 브라우저 콘솔(F12)에서 실제 들어오는 데이터 형태를 확인하세요!
                console.log("전체 작품 데이터:", response.data);

                if (response.data) {
                    // 2. URL의 id와 일치하는 작품 찾기 (수정됨)
                    // URL의 id는 문자열이고, DB의 id는 숫자일 수도 문자열일 수도 있으므로
                    // 둘 다 String으로 변환해서 비교하는 것이 가장 안전합니다.
                    const targetData = response.data.find(item => String(item.id) === String(id));

                    if (targetData) {
                        console.log("찾은 작품 정보:", targetData); // [디버깅용]

                        // 3. 찾은 데이터를 State에 저장 (수정됨)
                        // 백엔드에서 이미지 경로가 'image_url', 'imageUrl', 'file_path' 중 뭐로 올지 모르니 다 체크
                        // 또한 경로가 'uploads/...' 처럼 상대 경로로 올 경우를 대비해 처리
                        let rawImageUrl = targetData.image_url || targetData.imageUrl || targetData.file_path || '';
                        
                        // 만약 이미지가 http로 시작하지 않고, 파일명만 있다면 서버 주소 붙이기 (필요시)
                        // (이미지 경로가 온전한 URL로 온다면 이 부분은 건너뛰어도 됩니다)
                        if (rawImageUrl && !rawImageUrl.startsWith('http') && !rawImageUrl.startsWith('data:')) {
                            rawImageUrl = `${process.env.REACT_APP_API_BASE_URL}${rawImageUrl.startsWith('/') ? '' : '/'}${rawImageUrl}`;
                        }

                        setArtworkInfo({
                            id: targetData.id,
                            title: targetData.title || '제목 없음', // 제목이 비어있을 경우 대비
                            artist: targetData.artist_name || targetData.author || 'Unknown',
                            createdDate: targetData.created_at ? new Date(targetData.created_at).toLocaleDateString() : '날짜 정보 없음',
                            modifiedDate: targetData.updated_at ? new Date(targetData.updated_at).toLocaleDateString() : new Date().toLocaleDateString(),
                            category: targetData.category || 'Etc',
                            rate: targetData.ai_ratio ? `${targetData.ai_ratio}` : 'Unknown',
                            imageUrl: rawImageUrl // 가공된 이미지 URL
                        });

                        setPromptText(targetData.prompt || '프롬프트 정보가 없습니다.');
                        setEditablePrompt(targetData.prompt || '');
                    } else {
                        console.warn(`ID가 ${id}인 작품을 찾을 수 없습니다.`);
                        alert("해당 작품을 찾을 수 없습니다.");
                        navigate('/archive'); 
                    }
                }
            } catch (error) {
                console.error("작품 상세 정보 로딩 실패:", error);
                alert("데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchArtworkDetail();
        }
    }, [id, navigate]);

    // 채팅 스크롤 자동 이동
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // ----------------------------------------------------------------------
    // 핸들러 함수들
    // ----------------------------------------------------------------------
    const handleTabChange = (tab) => setActiveTab(tab);

    const handleEditClick = () => {
        setEditablePrompt(promptText);
        setIsEditing(true);
    };

    // 프롬프트 저장 (임시 구현: UI만 변경)
    const handleSaveClick = async () => {
        // 실제로는 axios.put 등을 사용해 DB에 저장해야 함
        // 현재는 UI 상에서만 변경된 척 처리
        setPromptText(editablePrompt);
        setIsEditing(false);
        alert('프롬프트가 수정되었습니다. (DB 저장은 별도 구현 필요)');
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
            let answer = '좋은 아이디어네요!';
            if (question.includes('색상')) answer = '색상을 변경하려면 프롬프트에서 "파스텔 톤"을 "비비드한 네온 컬러"로 변경해보세요.';
            else if (question.includes('배경')) answer = '배경을 "우주 공간"이나 "숲속"으로 묘사해보세요.';
            
            const aiResponse = { id: Date.now() + 1, sender: 'ai', text: answer };
            setChatMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    const handleThumbnailClick = (imgSrc) => {
        setModalImage(imgSrc);
        setShowModal(true);
    };
    const handleModalClose = () => setShowModal(false);

    // ----------------------------------------------------------------------
    // 스타일 객체 (기존 유지)
    // ----------------------------------------------------------------------
    const pageLayout = { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', position: 'relative', minHeight: '100vh' };
    const leftSectionStyle = { position: 'fixed', top: '120px', width: '320px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '20px' };
    const rightSectionStyle = { marginLeft: '360px', width: 'calc(100% - 360px)', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '800px' };
    const tabButtonStyle = (isActive) => ({ padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderBottom: isActive ? '3px solid #FF6B00' : '3px solid transparent', backgroundColor: 'transparent', color: isActive ? '#FF6B00' : '#888', transition: 'all 0.3s ease' });
    const infoBoxStyle = { backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '30px', color: '#fff' };

    // ----------------------------------------------------------------------
    // 렌더링
    // ----------------------------------------------------------------------
    
    // 1. 로딩 중일 때
    if (isLoading) {
        return (
            <div style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h2>작품 정보를 불러오는 중...</h2>
            </div>
        );
    }

    // 2. 데이터가 없을 때 (로딩 끝났는데 데이터 null)
    if (!artworkInfo) {
        return null; // or Error Page
    }

    // 3. 정상 렌더링
    return (
        <div className="archive-detail-page" style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white' }}>
            <div className="starfield-bg"></div>
            <Header />

            <main style={pageLayout}>
                {/* 좌측 Fixed 섹션 (썸네일) */}
                <aside style={leftSectionStyle}>
                    <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '16px', overflow: 'hidden', border: '1px solid #333', cursor: 'pointer' }}
                         onClick={() => handleThumbnailClick(artworkInfo.imageUrl)}>
                        <img src={artworkInfo.imageUrl} alt={artworkInfo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                             onError={(e) => {e.target.src = 'https://via.placeholder.com/320x320?text=No+Image'}} />
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#fff' }}>{artworkInfo.title}</h1>
                </aside>

                {/* 우측 섹션 (정보 및 편집) */}
                <section style={rightSectionStyle}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #333' }}>
                        <button style={tabButtonStyle(activeTab === 'info')} onClick={() => handleTabChange('info')}>작품 정보</button>
                        <button style={tabButtonStyle(activeTab === 'edit')} onClick={() => handleTabChange('edit')}>프롬프트 편집</button>
                    </div>

                    {/* 정보 탭 */}
                    {activeTab === 'info' && (
                        <div style={infoBoxStyle}>
                            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>상세 정보</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', lineHeight: '1.6' }}>
                                <span style={{ color: '#aaa' }}>제목</span><span>{artworkInfo.title}</span>
                                <span style={{ color: '#aaa' }}>작가</span><span>{artworkInfo.artist}</span>
                                <span style={{ color: '#aaa' }}>생성일</span><span>{artworkInfo.createdDate}</span>
                                <span style={{ color: '#aaa' }}>카테고리</span><span>{artworkInfo.category}</span>
                                <span style={{ color: '#aaa' }}>자체 제작률</span><span>{artworkInfo.rate}</span>
                                <span style={{ color: '#aaa' }}>프롬프트</span>
                                <span style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px', fontSize: '0.9em', wordBreak: 'break-all' }}>{promptText}</span>
                            </div>
                        </div>
                    )}

                    {/* 편집 탭 */}
                    {activeTab === 'edit' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={infoBoxStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h3 style={{ margin: 0 }}>프롬프트</h3>
                                    {isEditing ? (
                                        <button onClick={handleSaveClick} style={{ backgroundColor: '#FF6B00', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>저장하기</button>
                                    ) : (
                                        <button onClick={handleEditClick} style={{ backgroundColor: '#333', color: 'white', border: '1px solid #555', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>텍스트 편집</button>
                                    )}
                                </div>
                                {isEditing ? (
                                    <textarea value={editablePrompt} onChange={(e) => setEditablePrompt(e.target.value)} style={{ width: '100%', height: '150px', backgroundColor: '#222', color: '#fff', border: '1px solid #FF6B00', borderRadius: '8px', padding: '15px', lineHeight: '1.6', fontSize: '15px', resize: 'vertical' }} />
                                ) : (
                                    <div style={{ minHeight: '150px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '15px', lineHeight: '1.6', fontSize: '15px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{promptText}</div>
                                )}
                            </div>
                            
                            {/* AI 채팅 */}
                            <div style={{ ...infoBoxStyle, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <h3 style={{ margin: 0, color: '#FF6B00' }}>아이디어 PLUS +</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                    {["물체의 색상을 바꾸고 싶으면?", "이미지의 배경 변경?", "판타지 테마로?", "물체 삭제 가능?"].map((q, idx) => (
                                        <button key={idx} onClick={() => handleIdeaClick(q)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: '#ddd', cursor: 'pointer', textAlign: 'left', fontSize: '13px' }}>💡 {q}</button>
                                    ))}
                                </div>
                                <div className="chat-interface" style={{ border: '1px solid #444', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#1a1a1a', height: '400px', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {chatMessages.map((msg) => (
                                            <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', backgroundColor: msg.sender === 'user' ? '#FF6B00' : '#333', color: 'white', padding: '10px 15px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.4' }}>{msg.text}</div>
                                        ))}
                                        <div ref={chatEndRef}></div>
                                    </div>
                                    <form onSubmit={handleChatSubmit} style={{ display: 'flex', borderTop: '1px solid #444', padding: '10px', backgroundColor: '#222' }}>
                                        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="AI에게 질문..." style={{ flex: 1, padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#333', color: 'white', marginRight: '10px' }} />
                                        <button type="submit" style={{ padding: '0 20px', borderRadius: '4px', border: 'none', backgroundColor: '#555', color: 'white', cursor: 'pointer' }}>전송</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* 이미지 모달 */}
            {showModal && (
                <div onClick={handleModalClose} style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 1000, justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                    <img src={modalImage} alt="확대" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '10px' }} />
                </div>
            )}
        </div>
    );
}

export default ArchiveDetail;