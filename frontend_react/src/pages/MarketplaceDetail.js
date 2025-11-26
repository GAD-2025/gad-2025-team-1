import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const MarketplaceDetail = () => {
    const { id } = useParams(); // URL 파라미터 (작품 ID)
    const [artwork, setArtwork] = useState(null);

    // [1] 데이터 로드 (Marketplace.js와 동일한 로직으로 해당 작품 찾기)
    useEffect(() => {
        window.scrollTo(0, 0); // 페이지 상단으로 이동

        // Marketplace.js와 동일한 이미지 컬렉션
        const imageCollection = [
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
            "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&q=80",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80",
            "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80",
            "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&q=80",
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80", 
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
            "https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=600&q=80",
            "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=600&q=80", 
            "https://images.unsplash.com/photo-1534293630900-a3528f80cb32?w=600&q=80",
            // ... 30개 이미지가 반복됨
        ];

        const targetId = parseInt(id) || 1;
        
        // 가상의 작품 데이터 생성
        const generatedItem = {
            id: targetId,
            title: `Cosmic Art #${targetId}`,
            author: `Artist_${targetId}`,
            price: (Math.floor(targetId * 1234) % 5000) + 500, // 랜덤 가격
            category: ['일러스트', '컨셉아트', '어플 디자인', '마케팅 배너'][targetId % 4],
            // ID에 맞는 이미지 매칭 (Marketplace와 동일한 규칙)
            img: imageCollection[(targetId - 1) % 10], 
            creationRate: 60 + (targetId % 40), // 60~99% 랜덤
            buyersCount: 10 + (targetId * 5),
            description: "이 작품은 AI 알고리즘과 작가의 리터칭이 결합된 고퀄리티 아트워크입니다. 상업적 용도로 자유롭게 사용 가능합니다.",
            tags: ["#우주", "#AI", "#디지털아트", "#고해상도"]
        };

        setArtwork(generatedItem);
    }, [id]);

    if (!artwork) return <div className="text-white text-center py-20">로딩 중...</div>;

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans relative pb-20">
            {/* 배경 */}
            <div className="fixed inset-0 z-0 opacity-80 bg-cover bg-center pointer-events-none" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop')"}}>
            </div>

            {/* 헤더 */}
            <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-extrabold text-white cursor-pointer hover:opacity-80 transition">
                        cre<span className="text-orange-500">AI</span>tive
                    </Link>
                    <nav className="hidden md:flex space-x-8">
                        <Link to="/marketplace" className="text-white font-bold border-b-2 border-orange-500 pb-1">거래하기</Link>
                        <Link to="/archive" className="text-gray-400 hover:text-white transition font-medium">작품 보관함</Link>
                        <Link to="/myspace" className="text-gray-400 hover:text-white transition font-medium">마이스페이스</Link>
                        <Link to="/setting" className="text-gray-400 hover:text-white transition font-medium">설정</Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
                            <img src="https://i.pravatar.cc/150?img=12" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-400">김민지님</p>
                            <span className="text-[10px] bg-orange-600 text-white px-1.5 rounded">구매자</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* [LEFT] 이미지 및 상세 정보 */}
                    <div className="space-y-6">
                        {/* 1. 이미지 카드 (흰색 테두리 디자인 적용) */}
                        <div className="bg-white p-3 rounded-3xl shadow-2xl">
                            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center relative">
                                {/* [핵심] 여기에 클릭한 작품 이미지가 들어갑니다 */}
                                <img src={artwork.img} alt={artwork.title} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* 2. 정보 그리드 (살구색 배경 박스들) */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* 카테고리 */}
                            <div className="bg-[#FFDCC2] rounded-2xl p-4 text-center flex flex-col justify-center items-center text-gray-900 h-24">
                                <span className="text-xs font-bold mb-1 opacity-70">카테고리</span>
                                <span className="font-extrabold text-base break-keep">{artwork.category}</span>
                            </div>
                            
                            {/* 자체 제작 비율 */}
                            <div className="bg-[#FFDCC2] rounded-2xl p-4 flex flex-col justify-center text-gray-900 h-24 relative overflow-hidden">
                                <div className="flex justify-between items-end mb-2 z-10 relative">
                                    <span className="text-xs font-bold opacity-70">자체제작률</span>
                                    <span className="font-extrabold text-xl">{artwork.creationRate}%</span>
                                </div>
                                {/* 게이지 바 */}
                                <div className="w-full h-2 bg-white rounded-full overflow-hidden z-10 relative">
                                    <div className="h-full bg-orange-500" style={{width: `${artwork.creationRate}%`}}></div>
                                </div>
                                <div className="flex justify-between text-[9px] mt-1 opacity-60 z-10 relative font-bold">
                                    <span>자체제작</span>
                                    <span>AI</span>
                                </div>
                            </div>

                            {/* 사용 AI 툴 */}
                            <div className="bg-[#FFDCC2] rounded-2xl p-4 flex flex-col justify-center items-center text-gray-900 h-24">
                                <span className="text-xs font-bold mb-2 opacity-70">사용 AI툴</span>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-xs font-bold">Mj</div>
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-xs font-bold">SD</div>
                                </div>
                            </div>
                        </div>

                        {/* 3. 대형 구매하기 버튼 (주황색 바) */}
                        <div className="bg-orange-500 rounded-2xl p-1 flex items-center justify-between shadow-lg hover:bg-orange-600 transition cursor-pointer group">
                            <div className="px-8 py-4 text-white font-extrabold text-xl">구매하기</div>
                            <div className="flex-grow text-right px-8 py-4 bg-black/10 rounded-r-xl group-hover:bg-black/20 transition">
                                <span className="text-white font-bold text-2xl">{artwork.price.toLocaleString()} 코인</span>
                            </div>
                        </div>
                    </div>

                    {/* [RIGHT] 프롬프트 및 부가 정보 */}
                    <div className="space-y-6">
                        
                        {/* 1. 프롬프트 카드 (블러 처리) */}
                        <div className="bg-[#FFF5E6] rounded-3xl p-8 text-gray-800 shadow-xl relative overflow-hidden h-[300px] flex flex-col">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="text-orange-500">✨</span> 프롬프트
                            </h3>
                            
                            {/* 블러 텍스트 */}
                            <div className="relative flex-grow">
                                <p className="filter blur-[6px] select-none opacity-50 leading-relaxed text-sm h-full overflow-hidden">
                                    Create a high-quality, photorealistic image of {artwork.title}. 
                                    Cinematic lighting, 8k resolution, detailed texture, trending on ArtStation.
                                    Use vivid colors and dynamic composition. (Hidden Prompt Content...)
                                    Create a high-quality, photorealistic image of {artwork.title}. 
                                    Cinematic lighting, 8k resolution, detailed texture, trending on ArtStation.
                                </p>
                                {/* 오버레이 메시지 */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                    <span className="bg-black/60 text-white px-4 py-2 rounded-full text-xs backdrop-blur-md mb-4 font-bold shadow-lg">
                                        🔒 구매 후 공개됩니다
                                    </span>
                                </div>
                            </div>

                            {/* 하단 버튼 3개 */}
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                                <button className="flex-1 border border-gray-400 bg-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition shadow-sm">
                                    복사하기
                                </button>
                                <button className="flex-1 border border-gray-400 bg-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition shadow-sm">
                                    공유하기
                                </button>
                                <button className="flex-1 border border-orange-500 text-orange-600 bg-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-50 transition shadow-sm">
                                    다운받기
                                </button>
                            </div>
                        </div>

                        {/* 2. 작가의 한마디 */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl text-gray-800">
                            <div className="mb-6 text-center">
                                <h4 className="font-bold text-sm text-gray-500 mb-2">[ 작가의 한마디 ]</h4>
                                <p className="text-sm leading-7 text-gray-900 font-medium">
                                    "{artwork.description}"
                                </p>
                            </div>
                            
                            <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-2 justify-center">
                                {artwork.tags.map((tag, idx) => (
                                    <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 3. 구매한 사람들 (프로필 원형) */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl flex items-center justify-between text-gray-800 h-24">
                            <div>
                                <h4 className="font-bold text-base leading-tight">이 작품을<br/>구매한 사람들</h4>
                            </div>
                            <div className="flex items-center -space-x-3">
                                {[1, 2, 3].map((num) => (
                                    <div key={num} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?img=${num + 10}`} alt="User" className="w-full h-full object-cover"/>
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                    {artwork.buyersCount}+
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default MarketplaceDetail;