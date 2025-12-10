import React, { useState } from 'react';
import Header from '../components/Header';
import './Setting.css';

// 내부 모달 컴포넌트
const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-icon">🚧</div>
                <h3>알림</h3>
                <p>현재 준비 중인 기능입니다.</p>
                <button className="btn-primary" onClick={onClose}>확인</button>
            </div>
        </div>
    );
};

const Setting = () => {
    // 탭 및 폼 상태 관리
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [supportTab, setSupportTab] = useState('faq');
    const [historyTab, setHistoryTab] = useState('purchase');
    const [inquiryForm, setInquiryForm] = useState({ title: '', content: '' });
    
    // 모달 상태
    const [showModal, setShowModal] = useState(false);

    // 1:1 문의 제출
    const handleInquirySubmit = (e) => {
        e.preventDefault();
        alert('문의가 접수되었습니다. 답변은 이메일로 전송됩니다.');
        setInquiryForm({ title: '', content: '' });
    };

    // 컨텐츠 렌더링 함수
    const renderContent = () => {
        switch (activeMenu) {
            case 'dashboard':
                return (
                    <div className="section-container fade-in">
                        <h2 className="section-title">수익 대시보드</h2>
                        <div className="dashboard-grid">
                            {/* 1. 전체 수익 */}
                            <div className="dash-card total-revenue">
                                <h3>전체 수익 현황</h3>
                                <p className="revenue-amount">₩ 12,500,000</p>
                                <span className="trend positive">▲ 지난달 대비 12% 상승</span>
                            </div>

                            {/* 2. 판매 랭킹 */}
                            <div className="dash-card">
                                <h3>판매 랭킹</h3>
                                <ul className="rank-list">
                                    <li>1. AI 풍경화 패키지 <span className="count">52건</span></li>
                                    <li>2. 사이버펑크 캐릭터 <span className="count">38건</span></li>
                                    <li>3. 로고 디자인 프롬프트 <span className="count">15건</span></li>
                                </ul>
                            </div>

                            {/* 3. 구매자 분석 (차트 추가됨) */}
                            <div className="dash-card">
                                <h3>구매자 분석</h3>
                                
                                {/* 원형 차트 영역 */}
                                <div className="charts-container">
                                    <div className="chart-wrapper">
                                        <div 
                                            className="pie-chart" 
                                            style={{background: 'conic-gradient(#FF5900 0% 65%, #eee 65% 100%)'}}
                                        >
                                            <span className="chart-label">65%</span>
                                        </div>
                                        <span className="chart-title">재구매율</span>
                                    </div>
                                    <div className="chart-wrapper">
                                        <div 
                                            className="pie-chart"
                                            style={{background: 'conic-gradient(#2ecc71 0% 35%, #eee 35% 100%)'}}
                                        >
                                            <span className="chart-label">35%</span>
                                        </div>
                                        <span className="chart-title">신규 유입</span>
                                    </div>
                                </div>

                                {/* 성별 바 차트 영역 */}
                                <div className="gender-bar-container">
                                    <div className="gender-labels">
                                        <span>남성 55%</span>
                                        <span>여성 45%</span>
                                    </div>
                                    <div className="gender-bar">
                                        <div className="gender-male" style={{width: '55%'}}></div>
                                        <div className="gender-female" style={{width: '45%'}}></div>
                                    </div>
                                </div>

                                <div className="stat-row" style={{ marginTop: '15px' }}>
                                    <span>주요 연령대</span>
                                    <span>20-30대</span>
                                </div>
                            </div>

                            {/* 4. 정산 현황 */}
                            <div className="dash-card">
                                <h3>정산 현황</h3>
                                <p className="settlement-status">정산 예정일: <strong>12월 15일</strong></p>
                                <p className="settlement-amount">₩ 850,000</p>
                                <button className="btn-outline" onClick={() => setShowModal(true)}>
                                    정산 내역 상세보기
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'support':
                return (
                    <div className="section-container fade-in">
                        <h2 className="section-title">고객센터</h2>
                        <div className="toggle-wrapper">
                            <button 
                                className={`toggle-btn ${supportTab === 'faq' ? 'active' : ''}`}
                                onClick={() => setSupportTab('faq')}
                            >
                                FAQ
                            </button>
                            <button 
                                className={`toggle-btn ${supportTab === 'inquiry' ? 'active' : ''}`}
                                onClick={() => setSupportTab('inquiry')}
                            >
                                1:1 문의
                            </button>
                        </div>

                        {supportTab === 'faq' ? (
                            <div className="faq-list">
                                <details>
                                    <summary>수익 정산은 언제 되나요?</summary>
                                    <p>매월 15일과 말일에 등록하신 계좌로 자동 정산됩니다.</p>
                                </details>
                                <details>
                                    <summary>환불 규정이 궁금합니다.</summary>
                                    <p>디지털 콘텐츠 특성상 다운로드 이후에는 환불이 불가능합니다.</p>
                                </details>
                                <details>
                                    <summary>저작권 문제는 없나요?</summary>
                                    <p>네, 구매하신 모든 작품은 상업적 이용이 가능합니다.</p>
                                </details>
                            </div>
                        ) : (
                            <form className="inquiry-form" onSubmit={handleInquirySubmit}>
                                <div className="form-group">
                                    <label>제목</label>
                                    <input 
                                        type="text" 
                                        placeholder="문의 제목을 입력해주세요" 
                                        value={inquiryForm.title}
                                        onChange={(e) => setInquiryForm({...inquiryForm, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>내용</label>
                                    <textarea 
                                        placeholder="문의하실 내용을 자세히 적어주세요"
                                        rows="5"
                                        value={inquiryForm.content}
                                        onChange={(e) => setInquiryForm({...inquiryForm, content: e.target.value})}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn-primary">문의 접수하기</button>
                            </form>
                        )}
                    </div>
                );

            case 'history':
                return (
                    <div className="section-container fade-in">
                        <h2 className="section-title">구매/결제 내역</h2>
                        <div className="tabs-wrapper">
                            <button 
                                className={`tab-btn ${historyTab === 'purchase' ? 'active' : ''}`}
                                onClick={() => setHistoryTab('purchase')}
                            >
                                구매 내역
                            </button>
                            <button 
                                className={`tab-btn ${historyTab === 'download' ? 'active' : ''}`}
                                onClick={() => setHistoryTab('download')}
                            >
                                다운로드 내역
                            </button>
                            <button 
                                className={`tab-btn ${historyTab === 'payment' ? 'active' : ''}`}
                                onClick={() => setHistoryTab('payment')}
                            >
                                결제 정보
                            </button>
                        </div>

                        <div className="history-content">
                            {historyTab === 'purchase' && (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>주문번호</th>
                                            <th>상품명</th>
                                            <th>결제금액</th>
                                            <th>날짜</th>
                                            <th>상태</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>20241024-001</td>
                                            <td>판타지 배경 팩</td>
                                            <td>15,000원</td>
                                            <td>2024.10.24</td>
                                            <td><span className="badge complete">구매완료</span></td>
                                        </tr>
                                        <tr>
                                            <td>20241020-052</td>
                                            <td>레트로 아이콘</td>
                                            <td>5,000원</td>
                                            <td>2024.10.20</td>
                                            <td><span className="badge complete">구매완료</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                            {historyTab === 'download' && (
                                <div className="empty-state">
                                    <p>최근 30일간 다운로드 내역이 없습니다.</p>
                                </div>
                            )}
                            {historyTab === 'payment' && (
                                <div className="payment-info-card">
                                    <h3>등록된 결제 수단</h3>
                                    <div className="card-item">
                                        <div className="card-icon">VISA</div>
                                        <div className="card-detail">
                                            <p>신한카드 ****-****-****-1234</p>
                                            <span className="expire">만료일: 12/28</span>
                                        </div>
                                        <button className="btn-text">삭제</button>
                                    </div>
                                    <button className="btn-outline full-width">+ 새 카드 등록하기</button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="setting-page">
            <Header />
            <main className="setting-layout">
                {/* 사이드바 메뉴 */}
                <aside className="setting-sidebar">
                    <div className="sidebar-header">
                        <h3>설정</h3>
                    </div>
                    <ul className="sidebar-menu">
                        <li 
                            className={activeMenu === 'dashboard' ? 'active' : ''} 
                            onClick={() => setActiveMenu('dashboard')}
                        >
                            수익 대시보드
                        </li>
                        <li 
                            className={activeMenu === 'support' ? 'active' : ''} 
                            onClick={() => setActiveMenu('support')}
                        >
                            고객센터
                        </li>
                        <li 
                            className={activeMenu === 'history' ? 'active' : ''} 
                            onClick={() => setActiveMenu('history')}
                        >
                            구매/결제 내역
                        </li>
                    </ul>
                </aside>

                {/* 메인 컨텐츠 영역 */}
                <section className="setting-content">
                    {renderContent()}
                </section>
            </main>

            {/* 모달 렌더링 */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default Setting;