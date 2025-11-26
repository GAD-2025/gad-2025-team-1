import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Explore = () => {
    // [1] 이미지 컬렉션 (30개의 고화질 우주/AI 아트)
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

    // [2] 데이터 생성 함수 (이미지 랜덤 배정)
    const generateData = () => {
        const data = [];
        const categories = ['이미지 생성', '어플 디자인', '마케팅 배너', '일러스트'];
        
        for (let i = 1; i <= 40; i++) { // 40개 데이터
            data.push({
                id: i,
                title: `Cosmic Art #${i}`,
                author: `Creator_${i}`,
                tags: ["자연", "우주", "AI"],
                category: categories[i % 4],
                price: `${Math.floor(Math.random() * 5000)}C`,
                priceValue: Math.floor(Math.random() * 5000),
                date: `2025-11-${String((i % 30) + 1).padStart(2, '0')}`,
                views: Math.floor(Math.random() * 1000),
                liked: false,
                // 이미지 순차 배정
                img: imageCollection[(i - 1) % imageCollection.length],
                color: "#1a1a1a" // 기본 배경색 (이미지 로딩 전)
            });
        }
        return data;
    };

    // [3] 상태 관리
    const [artworks, setArtworks] = useState([]); // 초기값 비워두고 useEffect에서 설정
    const [filteredData, setFilteredData] = useState([]);
    
    // 필터 상태
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("all");
    const [priceLevel, setPriceLevel] = useState("all");
    const [sortOrder, setSortOrder] = useState("relevance");
    const [showLikedOnly, setShowLikedOnly] = useState(false);
    
    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // 탐색 페이지는 크게 보여주기 위해 8개 유지 (원하시면 늘려드립니다)

    // UI 상태
    const [cart, setCart] = useState([]);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showRecentDropdown, setShowRecentDropdown] = useState(false);

    // [4] 초기 로드 (데이터 생성)
    useEffect(() => {
        const data = generateData();
        setArtworks(data);
        
        const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        setRecentSearches(savedSearches);
    }, []);

    // 데이터가 로드되면 필터링 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if(artworks.length > 0) applyFilters();
    }, [artworks, category, priceLevel, sortOrder, showLikedOnly]); 

    // [5] 필터링 로직
    const applyFilters = () => {
        setLoading(true);

        setTimeout(() => {
            let result = artworks.filter(item => {
                const matchQuery = item.title.toLowerCase().includes(keyword.toLowerCase()) || 
                                   item.author.toLowerCase().includes(keyword.toLowerCase()) ||
                                   item.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()));
                const matchCategory = category === 'all' || item.category === category;
                
                let matchPrice = true;
                if (priceLevel === 'free') matchPrice = item.priceValue === 0;
                else if (priceLevel === 'low') matchPrice = item.priceValue > 0 && item.priceValue <= 100;
                else if (priceLevel === 'mid') matchPrice = item.priceValue > 100 && item.priceValue <= 300;
                else if (priceLevel === 'high') matchPrice = item.priceValue > 300;
                
                const matchLiked = showLikedOnly ? item.liked : true;

                return matchQuery && matchCategory && matchPrice && matchLiked;
            });

            if (sortOrder === 'latest') {
                result.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else if (sortOrder === 'popular') {
                result.sort((a, b) => b.views - a.views);
            } else if (sortOrder === 'price_asc') {
                result.sort((a, b) => a.priceValue - b.priceValue);
            }

            setFilteredData(result);
            setCurrentPage(1);
            setLoading(false);
        }, 500);
    };

    const handleSearch = () => {
        if (!keyword.trim()) {
            alert("검색어를 입력해주세요.");
            return;
        }
        const newSearches = [keyword, ...recentSearches.filter(k => k !== keyword)].slice(0, 3);
        setRecentSearches(newSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
        
        setShowRecentDropdown(false);
        applyFilters();
    };

    const handleTagClick = (tag) => {
        setKeyword(tag.replace('#', ''));
    };

    const toggleLike = (e, id) => {
        e.stopPropagation();
        const newArtworks = artworks.map(item => 
            item.id === id ? { ...item, liked: !item.liked } : item
        );
        setArtworks(newArtworks); // artworks가 바뀌면 useEffect에 의해 applyFilters가 자동 실행됨
    };

    const addToCart = () => {
        if (!selectedArtwork) return;
        if (cart.find(item => item.id === selectedArtwork.id)) {
            alert("이미 장바구니에 있습니다.");
            return;
        }
        setCart([...cart, selectedArtwork]);
        alert(`🛒 '${selectedArtwork.title}' 장바구니에 담김!`);
    };

    const displayedItems = filteredData.slice(0, currentPage * itemsPerPage);

    const isNew = (dateString) => {
        const date = new Date(dateString);
        const now = new Date('2024-11-26');
        return Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24)) <= 30;
    };

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans relative">
            {/* [변경됨] 배경: Marketplace와 동일한 어두운 밤하늘 */}
            <div className="fixed inset-0 z-0 opacity-80 bg-cover bg-center pointer-events-none" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop')"}}>
            </div>

            {/* [변경됨] 헤더 디자인 통일 */}
            <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-extrabold text-white cursor-pointer hover:opacity-80 transition">
                        cre<span className="text-orange-500">AI</span>tive
                    </Link>
                    
                    <nav className="hidden md:flex space-x-8">
                        {/* 탐색 페이지는 로고와 연결되므로 별도 탭 활성화보다는 전체 메뉴 제공 */}
                        <Link to="/marketplace" className="text-gray-400 hover:text-white transition font-medium">거래하기</Link>
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
                        <button className="bg-orange-600 text-white px-5 py-2 font-bold rounded-lg text-sm hover:bg-orange-700 transition">
                            로그인
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 py-10">
                {/* 검색 섹션 */}
                <section className="text-center py-12">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-orange-500 drop-shadow-lg">당신의 영감을 찾아보세요!</h1>
                    
                    <div className="relative max-w-3xl mx-auto z-50 mt-8">
                        <div className="flex p-2 bg-gray-900 rounded-full shadow-2xl border border-gray-700">
                            <input 
                                type="text" 
                                className="flex-grow bg-transparent p-3 pl-6 text-white focus:outline-none placeholder-gray-500"
                                placeholder="검색어 입력..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onFocus={() => setShowRecentDropdown(true)}
                                onBlur={() => setTimeout(() => setShowRecentDropdown(false), 200)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button onClick={handleSearch} className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700">검색</button>
                        </div>
                        
                        {/* 최근 검색어 */}
                        {showRecentDropdown && recentSearches.length > 0 && (
                            <div className="absolute top-full left-4 right-4 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden text-left">
                                <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-700">최근 검색어</div>
                                <ul>
                                    {recentSearches.map((k, i) => (
                                        <li key={i} onClick={() => { setKeyword(k); handleSearch(); }} className="px-4 py-3 hover:bg-gray-800 cursor-pointer text-gray-300">
                                            {k}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        {['#트렌디', '#미니멀', '#추상', '#풍경화', '#컨셉아트'].map(tag => (
                            <button key={tag} onClick={() => handleTagClick(tag)} className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-1.5 rounded-full border border-gray-700">
                                {tag}
                            </button>
                        ))}
                    </div>
                </section>

                <hr className="border-gray-800 my-10" />

                {/* 필터 툴바 */}
                <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl mb-8 flex flex-col xl:flex-row gap-4 justify-between items-center border border-gray-800">
                    <div className="flex flex-wrap gap-2 justify-center">
                        <select className="bg-black text-gray-300 p-2 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="all">모든 카테고리</option>
                            <option value="이미지 생성">이미지 생성</option>
                            <option value="어플 디자인">어플 디자인</option>
                            <option value="마케팅 배너">마케팅 배너</option>
                            <option value="일러스트">일러스트</option>
                        </select>
                        <select className="bg-black text-gray-300 p-2 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500" value={priceLevel} onChange={(e) => setPriceLevel(e.target.value)}>
                            <option value="all">모든 가격</option>
                            <option value="free">무료</option>
                            <option value="low">100C 이하</option>
                            <option value="mid">100~300C</option>
                            <option value="high">300C 초과</option>
                        </select>
                        <button onClick={() => setShowLikedOnly(!showLikedOnly)} className={`px-4 py-2 rounded-lg border ${showLikedOnly ? 'bg-orange-600 border-orange-600 text-white' : 'bg-black border-gray-700 text-gray-400'}`}>
                            ♥ 찜한 작품만
                        </button>
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="text-gray-400 text-sm">정렬:</span>
                        <select className="bg-black text-white p-2 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="relevance">관련도순</option>
                            <option value="latest">최신순</option>
                            <option value="popular">인기순</option>
                            <option value="price_asc">가격 낮은순</option>
                        </select>
                    </div>
                </div>

                {/* 결과 그리드 (이미지 적용됨) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-xl bg-gray-900 border border-gray-800 h-80 animate-pulse"></div>
                        ))
                    ) : (
                        displayedItems.length > 0 ? (
                            displayedItems.map(item => (
                                <div key={item.id} className="group relative rounded-xl overflow-hidden cursor-pointer bg-gray-900 border border-gray-800 hover:shadow-2xl hover:scale-[1.02] hover:border-gray-600 transition duration-300">
                                    
                                    {/* 이미지 썸네일 */}
                                    <div className="h-48 relative overflow-hidden" onClick={() => setSelectedArtwork(item)}>
                                        <img 
                                            src={item.img} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        
                                        <div className="absolute top-0 left-0 w-full flex justify-between items-start p-3 z-10">
                                            <span className="text-[10px] bg-black/60 text-white px-2 py-1 rounded backdrop-blur-md border border-white/20">{item.category}</span>
                                            {isNew(item.date) && <span className="text-[10px] font-bold bg-orange-600 text-white px-2 py-0.5 rounded shadow">NEW</span>}
                                        </div>
                                        
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <span className="bg-white/90 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition">상세보기</span>
                                        </div>
                                    </div>

                                    {/* 하트 버튼 */}
                                    <button onClick={(e) => toggleLike(e, item.id)} className="absolute top-40 right-3 z-20 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20 transition border border-white/10">
                                        <span className={`text-xl ${item.liked ? "text-red-500" : "text-white"}`}>
                                            {item.liked ? "♥" : "♡"}
                                        </span>
                                    </button>

                                    {/* 하단 정보 */}
                                    <div className="p-4" onClick={() => setSelectedArtwork(item)}>
                                        <h3 className="text-white font-bold text-lg truncate mb-1">{item.title}</h3>
                                        <p className="text-xs text-gray-400 mb-3">by {item.author}</p>
                                        <div className="flex justify-between items-center border-t border-gray-800 pt-3">
                                            <div className="flex gap-1">
                                                {item.tags.slice(0, 2).map(tag => <span key={tag} className="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">#{tag}</span>)}
                                            </div>
                                            <span className="text-orange-500 font-bold text-lg">{item.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">조건에 맞는 작품이 없습니다.</div>
                        )
                    )}
                </div>

                {/* 더 보기 */}
                {!loading && displayedItems.length < filteredData.length && (
                    <div className="text-center mt-12">
                        <button onClick={() => setCurrentPage(prev => prev + 1)} className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-full border border-gray-700 transition">
                            더 보기 ({displayedItems.length} / {filteredData.length})
                        </button>
                    </div>
                )}
            </main>

            {/* 상세 모달 */}
            {selectedArtwork && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setSelectedArtwork(null)}>
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-4xl w-full relative flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedArtwork(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        {/* 모달 이미지 */}
                        <div className="w-full md:w-1/2 aspect-square rounded-xl overflow-hidden bg-black flex items-center justify-center">
                            <img src={selectedArtwork.img} alt={selectedArtwork.title} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="w-full md:w-1/2 flex flex-col justify-between text-white">
                            <div>
                                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{selectedArtwork.category}</span>
                                <h2 className="text-3xl font-extrabold mb-2 mt-1">{selectedArtwork.title}</h2>
                                <p className="text-sm text-gray-400 mb-6 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-700"></div> 
                                    By {selectedArtwork.author}
                                </p>
                                <div className="py-6 border-y border-gray-800 text-sm text-gray-300 leading-relaxed">
                                    이 작품은 AI 알고리즘을 통해 생성된 독창적인 디지털 아트워크입니다. 우주의 신비로움과 기술의 조화를 표현하고 있습니다. 구매 시 고해상도 원본 파일을 다운로드할 수 있습니다.
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-400">판매 가격</span>
                                    <span className="text-3xl font-bold text-orange-500">{selectedArtwork.price}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={addToCart} className="flex-1 py-3.5 border border-gray-600 rounded-xl font-bold hover:bg-gray-800 transition">장바구니</button>
                                    <button className="flex-[1.5] py-3.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-900/20 transition">구매하기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Explore;