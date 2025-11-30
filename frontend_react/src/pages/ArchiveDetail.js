import React, { useState } from 'react';
import Header from '../components/Header';
import './ArchiveDetail.css';

const ArchiveDetail = () => {
    const [promptText, setPromptText] = useState(`우아한 고양이가 커다란 찻잔 위에 앉아 있으며, 주변에는 커피와 초콜릿, 아이스크림 같은 카페 아이템들이 산재해 있다. 따뜻하고 아늑한 분위기, 파스텔 톤의 색감.`);
    
    const handleColorTokenClick = (e) => {
        const button = e.target;
        navigator.clipboard.writeText(button.dataset.value).then(() => {
            button.classList.add('copied');
            setTimeout(() => button.classList.remove('copied'), 1000);
        });
    };

    return (
        <div className="archive-detail-page">
            <div className="starfield-bg"></div>

            <Header />

            <main className="detail-container">
                <div className="detail-content">
                    <div className="detail-left">
                        <h2 id="artwork-title" className="artwork-title">동화의 꿀</h2>
                        
                        <div className="detail-info">
                            <div className="info-row">
                                <span className="info-label">작가 :</span>
                                <span id="artwork-artist" className="info-value">404 Creator</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">구매일 :</span>
                                <span id="artwork-created" className="info-value">25/10/1</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">최종 수정일 :</span>
                                <span id="artwork-modified" className="info-value">25/10/4</span>
                            </div>
                        </div>

                        <div className="description-box">
                            <h3>프롬프트 에디터</h3>
                            <p id="artwork-prompt" className="prompt-text">
                                {promptText}
                            </p>
                        </div>

                        <div className="ai-tools">
                            <h3>AI 툴</h3>
                            <div className="tool-icons">
                                <div className="tool-icon"><span className="icon-placeholder">🎨</span></div>
                                <div className="tool-icon"><span className="icon-placeholder">✨</span></div>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="btn-share">공유하기</button>
                            <button className="btn-edit">저장</button>
                        </div>
                    </div>

                    <div className="detail-right">
                        <div className="image-container">
                            <div className="prompt-label">프롬프트 편집</div>
                            <div className="image-prompt-overlay" aria-hidden="false">
                                <p className="image-prompt-small">
                                    몽환적이고 동화 같은 분위기의 그림. 깊고 어두운 남색 (<button className="color-token" data-value="#000080" onClick={handleColorTokenClick}>남색</button>)의 밤하늘 같은 배경에 반짝이는 하늘색 (<button className="color-token" data-value="#87CEEB" onClick={handleColorTokenClick}>하늘색</button>) 별들이 체크 무늬처럼 흩뿌려져 있습니다.
                                    <br/><br/>
                                    중앙에는 흙빛 갈색 (<button className="color-token" data-value="#A0522D" onClick={handleColorTokenClick}>흙빛 갈색</button>)의 조금은 낡은 듯한 화분이 놓여 있으며, 이 화분에서는 신비로운 빛을 내는 네 송이의 꽃이 피어납니다. 각 꽃은 보라색 (<button className="color-token" data-value="#800080" onClick={handleColorTokenClick}>보라색</button>), 민트색 (<button className="color-token" data-value="#3EB489" onClick={handleColorTokenClick}>민트색</button>), 스카이블루색 (<button className="color-token" data-value="#87CEEB" onClick={handleColorTokenClick}>스카이블루색</button>)을 주색으로 하고, 꽃잎 끝에는 연한 핑크색 (<button className="color-token" data-value="#FFC0CB" onClick={handleColorTokenClick}>연한 핑크색</button>) 하이라이트가 감돌고 있습니다.
                                    <br/><br/>
                                    마치 꿈속 한 장면처럼 부드럽게 빛나는 효과와 섬세한 디테일이 특징입니다.
                                </p>
                            </div>
                            <button className="btn-text-edit" type="button">텍스트 편집</button>
                            <button className="btn-long btn-share-long" type="button">공유하기</button>
                            <button className="btn-long btn-save-long" type="button">저장하기</button>
                        </div>
                    </div>
                </div> 
                
                <div className="ideas-section">
                    <h3>아이디어 PLUS</h3>
                    <div className="ideas-grid">
                        <div className="idea-card">
                            <p className="idea-title">Idea 1</p>
                            <p className="idea-text">보색이 전혀 다를게 수정하지 않을까?</p>
                        </div>
                        <div className="idea-card">
                            <p className="idea-title">Idea 2</p>
                            <p className="idea-text">이미지에 사람 얼굴 요소를 더 넣어봐도 괜찮을까?</p>
                        </div>
                        <div className="idea-card">
                            <p className="idea-title">Idea 3</p>
                            <p className="idea-text">이미지의 배경을 어떻게 변경하니까?</p>
                        </div>
                    </div>
                    <button className="btn-more-idea">다음보기</button>
                </div>
            </main>
        </div>
    );
}

export default ArchiveDetail;
