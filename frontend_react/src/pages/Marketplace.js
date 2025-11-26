import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Marketplace = () => {
    // [1] Mock Data: 60개 생성
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
        "https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=600&q=80",
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
        "https://images.unsplash.com/photo-1614726365206-38536b2d2940?w=600&q=80",
        "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
        "https://images.unsplash.com/photo-1578374173705-969cbe23210a?w=600&q=80",
        "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
        "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=600&q=80",
        "https://images.unsplash.com/photo-1520034475321-cbe63696469a?w=600&q=80",
        "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=600&q=80",
        "https://images.unsplash.com/photo-1536697246787-1d76314a7b62?w=600&q=80",
        "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=600&q=80",
        "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&q=80",
        "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?w=600&q=80",
        "https://images.unsplash.com/photo-1529641484336-efd5172d8dc1?w=600&q=80",
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80",
        "https://images.unsplash.com/photo-1507608869274-2c33ee180888?w=600&q=80",
        "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&q=80",
        "https://images.unsplash.com/photo-1563205764-647729d39002?w=600&q=80",
    ];

    const avatars = [
        "https://i.pravatar.cc/150?img=1", "https://i.pravatar.cc/150?img=2", 
        "https://i.pravatar.cc/150?img=3", "https://i.pravatar.cc/150?img=4"
    ];

    const generateData = () => {
        const data = [];
        const categories = ['일러스트', '컨셉아트', '어플 디자인', '마케팅 배너'];
        const aiModels = ["Midjourney", "Stable Diffusion", "DALL-E 3"];
        
        for (let i = 1; i <= 60; i++) {
            data.push({
                id: i,
                title: `Cosmic Art #${i}`,
                author: `Artist_${i}`,
                authorImg: avatars[i % 4],
                price: Math.floor(Math.random() * 5000), 
                category: categories[i % 4],
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 500),
                date: `2025-11-${String((i % 30) + 1).padStart(2, '0')}`,
                img: imageCollection[(i - 1) % imageCollection.length],
                aiModel: aiModels[i % 3],
                badge: i % 5 === 0 ? "BEST" : (i % 7 === 0 ? "NEW" : null)
            });
        }
        return data;
    };

    const [initialArtworks] = useState(generateData());

    // [2] 상태 관리
    const [artworks] = useState(initialArtworks);
    const [filteredArtworks, setFilteredArtworks] = useState(initialArtworks);
    
    // 필터 상태
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortCriteria, setSortCriteria] = useState('recent');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(5000);

    const [cart] = useState([]); 

    // 페이지네이션
    const itemsPerPage = 20; 
    const [currentPage, setCurrentPage] = useState(1);

    const categories = ['All', '일러스트', '컨셉아트', '어플 디자인', '마케팅 배너'];

    // [3] 필터 로직
    useEffect(() => {
        let result = [...artworks];

        if (searchTerm) {
            result = result.filter(art => 
                art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                art.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            result = result.filter(art => art.category === selectedCategory);
        }

        result = result.filter(art => art.price >= minPrice && art.price <= maxPrice);

        switch (sortCriteria) {
            case 'price_asc': result.sort((a, b) => a.price - b.price); break;
            case 'price_desc': result.sort((a, b) => b.price - a.price); break;
            case 'popular': result.sort((a, b) => b.views - a.views); break;
            case 'recent': 
            default: result.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
        }

        setFilteredArtworks(result);
        setCurrentPage(1); 
    }, [searchTerm, selectedCategory, sortCriteria, minPrice, maxPrice, artworks]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredArtworks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans relative pb-20">
            {/* [변경됨] 배경: 어두운 밤하늘 스타일로 변경 */}
            <div className="fixed inset-0 z-0 opacity-80 bg-cover bg-center pointer-events-none" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop')"}}>
            </div>

            {/* [변경됨] 헤더 디자인 통일 (검은색 배경 + 주황색 버튼) */}
            <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-extrabold text-white cursor-pointer hover:opacity-80 transition">
                        cre<span className="text-orange-500">AI</span>tive
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        {/* 활성화된 탭 */}
                        <Link to="/marketplace" className="text-white font-bold border-b-2 border-orange-500 pb-1">거래하기</Link>
                        {/* 비활성화된 탭 */}
                        <Link to="/archive" className="text-gray-400 hover:text-white transition font-medium">작품 보관함</Link>
                        <Link to="/myspace" className="text-gray-400 hover:text-white transition font-medium">마이스페이스</Link>
                        <Link to="/setting" className="text-gray-400 hover:text-white transition font-medium">설정</Link>
                    </nav>

                    <div className="flex items-center space-x-6">
                        <div className="relative cursor-pointer group" title="장바구니">
                            <span className="text-2xl text-gray-400 group-hover:text-white transition">🛒</span>
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cart.length}</span>
                            )}
                        </div>
                        {/* [변경됨] 로그인 버튼: 주황색 배경 */}
                        <button className="bg-orange-600 text-white px-5 py-2 font-bold rounded-lg text-sm hover:bg-orange-700 transition">
                            로그인
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* 상단 검색 */}
                <section className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">작품 거래소</h1>
                    <p className="text-gray-400 text-sm mb-8">전 세계 크리에이터들의 AI 아트를 탐색하고 거래하세요.</p>
                    
                    <div className="flex max-w-xl mx-auto bg-gray-900 rounded-full shadow-lg border border-gray-700 p-1 focus-within:border-orange-500 transition-colors mb-6">
                        <input 
                            type="text" 
                            placeholder="작품명, 작가, 태그 검색..." 
                            className="flex-grow bg-transparent p-3 pl-6 text-white text-sm focus:outline-none placeholder-gray-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-700 transition">
                            검색
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                    selectedCategory === cat 
                                    ? 'bg-orange-600 border-orange-600 text-white shadow-lg' 
                                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* 사이드바 필터 */}
                    <aside className="w-full lg:w-64 bg-black/60 p-6 rounded-xl border border-gray-800 backdrop-blur-sm sticky top-24">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold">필터</h3>
                            <button 
                                onClick={() => {setMinPrice(0); setMaxPrice(5000);}} 
                                className="text-xs text-orange-500 hover:underline"
                            >
                                초기화
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="text-xs text-gray-400 font-bold mb-2 block">가격 범위</label>
                            
                            <div className="flex items-end justify-between h-12 gap-1 mb-2 px-1">
                                {[20, 45, 30, 60, 80, 50, 70, 40, 30, 50].map((h, i) => (
                                    <div key={i} className="w-full bg-orange-600/40 rounded-t-sm" style={{height: `${h}%`}}></div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between gap-2 mb-4">
                                <div className="bg-gray-900 rounded px-2 py-1 border border-gray-700 w-full">
                                    <span className="text-[10px] text-gray-500 block">최저가</span>
                                    <input 
                                        type="number" 
                                        value={minPrice} 
                                        onChange={(e) => setMinPrice(Number(e.target.value))}
                                        className="w-full bg-transparent text-white text-sm font-bold focus:outline-none"
                                    />
                                </div>
                                <span className="text-gray-500">-</span>
                                <div className="bg-gray-900 rounded px-2 py-1 border border-gray-700 w-full">
                                    <span className="text-[10px] text-gray-500 block">최고가</span>
                                    <input 
                                        type="number" 
                                        value={maxPrice} 
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        className="w-full bg-transparent text-white text-sm font-bold focus:outline-none"
                                    />
                                </div>
                            </div>
                            
                            <input 
                                type="range" 
                                min="0" max="5000" 
                                value={maxPrice} 
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <div className="text-right text-xs text-gray-500 mt-1">
                                0C ~ 5,000C
                            </div>
                        </div>
                    </aside>

                    {/* 그리드 영역 */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm text-gray-400">
                                검색 결과 <span className="text-white font-bold">{filteredArtworks.length}</span>건
                            </span>
                            <select 
                                className="bg-transparent text-white text-sm border-none focus:ring-0 cursor-pointer text-right"
                                value={sortCriteria}
                                onChange={(e) => setSortCriteria(e.target.value)}
                            >
                                <option value="recent" className="bg-gray-900">✨ 최신순</option>
                                <option value="popular" className="bg-gray-900">🔥 인기순</option>
                                <option value="price_asc" className="bg-gray-900">💰 낮은 가격순</option>
                                <option value="price_desc" className="bg-gray-900">💎 높은 가격순</option>
                            </select>
                        </div>

                        {/* 4열 그리드 */}
                        <div className="grid grid-cols-4 gap-5">
                            {currentItems.length > 0 ? (
                                currentItems.map(art => (
                                    <Link to={`/marketplace/detail/${art.id}`} key={art.id} className="group block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="aspect-square w-full relative overflow-hidden bg-gray-800">
                                            <img 
                                                src={art.img} 
                                                alt={art.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            {art.badge && (
                                                <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                                    {art.badge}
                                                </span>
                                            )}
                                            <span className="absolute top-2 right-2 bg-black/60 backdrop-blur text-gray-300 text-[9px] px-1.5 py-0.5 rounded border border-gray-600">
                                                {art.aiModel}
                                            </span>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="text-white font-bold text-sm truncate mb-1">{art.title}</h3>
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <img src={art.authorImg} alt="" className="w-4 h-4 rounded-full border border-gray-600" />
                                                <span className="text-gray-400 text-xs truncate">{art.author}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-t border-gray-700 pt-2 mt-2">
                                                <span className="text-orange-500 font-bold text-sm">{art.price.toLocaleString()} C</span>
                                                <div className="flex items-center text-[10px] text-gray-500 gap-1">
                                                    <span>♥ {art.likes}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center bg-gray-900/50 rounded-xl border border-dashed border-gray-800">
                                    <p className="text-gray-400">조건에 맞는 작품이 없습니다.</p>
                                </div>
                            )}
                        </div>

                        {/* 페이지네이션 */}
                        {filteredArtworks.length > itemsPerPage && (
                            <div className="flex justify-center items-center mt-12 gap-4">
                                <button 
                                    className={`px-4 py-2 rounded-lg border text-sm font-bold transition ${currentPage === 1 ? 'border-gray-800 text-gray-600 cursor-not-allowed' : 'border-gray-700 text-white hover:bg-gray-800'}`}
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    &lt; 이전
                                </button>
                                <span className="text-gray-400 text-sm font-medium">
                                    {currentPage} / {totalPages}
                                </span>
                                <button 
                                    className={`px-4 py-2 rounded-lg border text-sm font-bold transition ${currentPage === totalPages ? 'border-gray-800 text-gray-600 cursor-not-allowed' : 'border-gray-700 text-white hover:bg-gray-800'}`}
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    다음 &gt;
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Link to="/upload" className="fixed bottom-8 right-8 z-50 group">
                <div className="bg-orange-600 text-white p-4 rounded-full shadow-2xl hover:bg-orange-500 transition-all duration-300 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
            </Link>

            <footer className="py-8 border-t border-gray-800 mt-12 bg-black text-center text-sm text-gray-600">
                &copy; 2025 creAI-tive Art Marketplace. All rights reserved.
            </footer>
        </div>
    );
};

export default Marketplace;