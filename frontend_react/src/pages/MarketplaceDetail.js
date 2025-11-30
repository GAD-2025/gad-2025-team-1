import React from 'react';
import Header from '../components/Header';
import './MarketplaceDetail.css';

const MarketplaceDetail = () => {
    return (
        <div className="marketplace-detail-page">
            <Header />

            <main className="detail-wrapper">
                <div className="detail-container">
                    
                    <div className="detail-left">
                        <div className="detail-image-box">
                            <img src="https://placehold.co/1024x1024/4A4A4A/FFFFFF?text=Artwork" alt="작품 이미지" className="main-artwork-img" />
                            <div className="image-overlay-icons">
                                <div className="icon-circle"><i className="fa-solid fa-sailboat"></i></div>
                                <div className="icon-circle"><i className="fa-solid fa-shuttle-space"></i></div>
                            </div>
                        </div>

                        <div className="info-section">
                            <div className="title-row">
                                <h1 className="text-2xl font-bold text-white">카멜롯의 일러스트</h1>
                                <p className="text-gray-400">by <span className="text-orange-500 font-semibold">김민지 작가</span></p>
                            </div>

                            <div className="stats-row">
                                <span className="text-sm font-bold text-gray-400">자체제작률: <span className="text-white">75%</span></span>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{ width: '75%' }}></div>
                                </div>
                            </div>

                            <div className="ai-analysis-box">
                                <h3 className="font-bold text-white mb-4">AI 분석 리포트</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-400">컬러:</span> <span className="text-white">주황, 네이비</span></div>
                                    <div><span className="text-gray-400">분위기:</span> <span className="text-white">Cute, 우주</span></div>
                                    <div><span className="text-gray-400">묘사:</span> <span className="text-white">High (8K)</span></div>
                                    <div><span className="text-gray-400">스타일:</span> <span className="text-purple-400">픽셀아트 (92%)</span></div>
                                </div>
                            </div>

                            <div className="purchase-row">
                                <button className="buy-btn">구매하기</button>
                                <div className="price-tag">1500 코인</div>
                            </div>
                        </div>
                    </div>

                    <div className="divider-vertical"></div>

                    <div className="detail-right">
                        <div className="glass-box flex-grow">
                            <div className="box-header">
                                <i className="fa-solid fa-lightbulb text-orange-500 mr-2"></i> 프롬프트
                            </div>
                            <div className="prompt-content-area">
                                <div className="blur-text">
                                    A cute, friendly robot astronaut character design... (Hidden)
                                </div>
                                <div className="prompt-overlay">
                                    <p className="font-bold mb-4">구매 후 공개됩니다.</p>
                                    <div className="flex gap-2">
                                        <button className="action-btn"><i className="fa-regular fa-copy"></i> 복사</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-box">
                            <div className="box-header">
                                <i className="fa-solid fa-user-edit text-orange-500 mr-2"></i> 작가의 한마디
                            </div>
                            <p className="text-sm text-gray-400 mb-3">AI와 픽셀아트 스타일을 결합하여 작업했습니다.</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="tag">#픽셀아트</span>
                                <span className="tag">#우주</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default MarketplaceDetail;
