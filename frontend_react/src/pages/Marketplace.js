import React, { useState, useEffect } from 'react';
import Header from '../components/Header'; // 헤더 필요 시 주석 해제
import { Link } from 'react-router-dom';

const Marketplace = () => {
    // [1] Mock Data: 실제 우주 테마 이미지 URL 적용 (Unsplash 무료 이미지 활용)
    const initialArtworks = [
        { id: 1, title: "은하수의 속삭임", author: "CosmicDreamer", price: 1500, category: "일러스트", views: 120, date: "2025-11-28", img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&q=80" },
        { id: 2, title: "네온 우주 비행사", author: "StarWalker", price: 2500, category: "컨셉아트", views: 450, date: "2025-11-27", img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=500&q=80" },
        { id: 3, title: "심우주 성운", author: "NebulaArtist", price: 1800, category: "일러스트", views: 80, date: "2025-11-26", img: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=500&q=80" },
        { id: 4, title: "외계 행성 풍경", author: "AlienWorld", price: 3200, category: "마케팅 배너", views: 1200, date: "2025-11-25", img: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=500&q=80" },
        { id: 5, title: "사이버펑크 게이트", author: "FutureArchitect", price: 5000, category: "어플 디자인", views: 300, date: "2025-11-20", img: "https://images.unsplash.com/photo-1578374173705-969cbe23210a?w=500&q=80" },
        { id: 6, title: "별이 빛나는 밤", author: "NightSky", price: 1200, category: "컨셉아트", views: 50, date: "2025-11-15", img: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=500&q=80" },
        { id: 7, title: "코스믹 컬러 웨이브", author: "VibrantSpace", price: 800, category: "일러스트", views: 900, date: "2025-10-30", img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=500&q=80" },
        { id: 8, title: "기하학적 우주 구조", author: "AbstractMind", price: 2000, category: "마케팅 배너", views: 150, date: "2025-11-01", img: "https://images.unsplash.com/photo-1536697246787-1d76314a7b62?w=500&q=80" },
    ];

    // [2] 상태 관리
    const [artworks, setArtworks] = useState(initialArtworks);
    const [filteredArtworks, setFilteredArtworks] = useState(initialArtworks);
    
    // 필터링 상태
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortCriteria, setSortCriteria] = useState('recent');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const categories = ['All', '일러스트', '컨셉아트', '어플 디자인', '마케팅 배너'];

    // [3] 통합 필터링 로직
    useEffect(() => {
        let result = [...artworks];

        // 1. 검색어 필터
        if (searchTerm) {
            result = result.filter(art => 
                art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                art.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. 카테고리 필터
        if (selectedCategory !== 'All') {
            result = result.filter(art => art.category === selectedCategory);
        }

        // 3. 가격 범위 필터
        if (minPrice !== '') {
            result = result.filter(art => art.price >= Number(minPrice));
        }
        if (maxPrice !== '') {
            result = result.filter(art => art.price <= Number(maxPrice));
        }

        // 4. 정렬 로직
        switch (sortCriteria) {
            case 'price_asc': result.sort((a, b) => a.price - b.price); break;
            case 'price_desc': result.sort((a, b) => b.price - a.price); break;
            case 'popular': result.sort((a, b) => b.views - a.views); break;
            case 'recent': 
            default: result.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
        }

        setFilteredArtworks(result);
    }, [searchTerm, selectedCategory, sortCriteria, minPrice, maxPrice, artworks]);

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans relative pb-20">
            {/* 우주 배경 */}
            <div className="fixed inset-0 z-0 opacity-40 bg-cover bg-center pointer-events-none" 
                 style={{backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/e/e5/Hubble_Ultra_Deep_Field_%28HUDF%29.jpg')"}}></div>

            {/* <Header /> */}
            
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* 상단: 카테고리 검색 */}
                <section className="mb-12 text-center">
                    <h1 className="text-3xl font-bold text-orange-500 mb-6 tracking-wider">카테고리 검색</h1>
                    
                    <div className="flex max-w-2xl mx-auto bg-gray-800 rounded-full shadow-2xl border border-gray-700 p-1 focus-within:border-orange-500 transition-colors">
                        <input 
                            type="text" 
                            placeholder="작품명, 작가 검색..." 
                            className="flex-grow bg-transparent p-3 pl-6 text-white text-base focus:outline-none placeholder-gray-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition duration-200">
                            검색
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {categories.map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                                    selectedCategory === cat 
                                    ? 'bg-orange-600 border-orange-600 text-white shadow-lg' 
                                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                <hr className="border-gray-800 mb-8" />

                {/* 중단: 필터 툴바 (가격 범위 + 정렬) */}
                <section className="mb-8 bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-sm">
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <span className="text-white font-bold whitespace-nowrap">
                            총 <span className="text-orange-500">{filteredArtworks.length}</span>개
                        </span>
                        
                        <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-600">
                            <span className="text-xs text-gray-400">가격</span>
                            <input 
                                type="number" 
                                placeholder="Min" 
                                className="w-20 bg-transparent text-white text-sm focus:outline-none text-right"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <span className="text-gray-500">~</span>
                            <input 
                                type="number" 
                                placeholder="Max" 
                                className="w-20 bg-transparent text-white text-sm focus:outline-none text-right"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                            <span className="text-xs text-orange-500">C</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <select 
                            className="bg-gray-900 text-white text-sm py-2 px-4 rounded-lg border border-gray-600 focus:outline-none focus:border-orange-500 cursor-pointer"
                            value={sortCriteria}
                            onChange={(e) => setSortCriteria(e.target.value)}
                        >
                            <option value="recent">✨ 최신순</option>
                            <option value="popular">🔥 인기순</option>
                            <option value="price_asc">💰 낮은 가격순</option>
                            <option value="price_desc">💎 높은 가격순</option>
                        </select>
                    </div>
                </section>

                {/* 작품 그리드 (이미지 적용) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredArtworks.length > 0 ? (
                        filteredArtworks.map(art => (
                            <Link to={`/marketplace/detail/${art.id}`} key={art.id} className="group relative block bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-orange-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                
                                {/* [변경됨] 실제 이미지 썸네일 영역 */}
                                <div className="aspect-square w-full relative overflow-hidden bg-gray-900">
                                    <img 
                                        src={art.img} 
                                        alt={art.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy" // 성능 최적화
                                    />
                                    
                                    {/* 호버 오버레이 */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            상세보기
                                        </span>
                                    </div>
                                </div>

                                {/* 카드 정보 영역 */}
                                <div className="p-4 bg-gray-900 relative">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-white font-bold text-lg truncate pr-2">{art.title}</h3>
                                    </div>
                                    <p className="text-gray-500 text-xs mb-3">{art.category} · {art.author}</p>
                                    <div className="flex justify-between items-center border-t border-gray-800 pt-3">
                                        <span className="text-xs text-gray-400">즉시 구매</span>
                                        <span className="text-orange-500 font-bold text-lg">{art.price.toLocaleString()} C</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                            <p className="text-gray-400 text-lg">조건에 맞는 작품이 없습니다.</p>
                            <button 
                                onClick={() => {setSearchTerm(''); setSelectedCategory('All'); setMinPrice(''); setMaxPrice('');}} 
                                className="mt-4 text-orange-500 underline hover:text-orange-400"
                            >
                                필터 초기화
                            </button>
                        </div>
                    )}
                </div>

            </main>

            {/* 판매 등록 플로팅 버튼 */}
            <Link to="/upload" className="fixed bottom-8 right-8 z-50 group">
                <div className="bg-orange-600 text-white p-4 rounded-full shadow-2xl hover:bg-orange-500 transition-all duration-300 hover:scale-110 flex items-center gap-2 group-hover:pr-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
                        작품 판매하기
                    </span>
                </div>
            </Link>

            <footer className="py-8 border-t border-gray-800 mt-12 bg-gray-900/90 text-center text-sm text-gray-600">
                &copy; 2025 creAI-tive Art Marketplace. All rights reserved.
            </footer>
        </div>
    );
};

export default Marketplace;