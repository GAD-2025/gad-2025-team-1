import React, { useState, useEffect } from 'react';

// [1] 가상 데이터 (모든 liked를 false로 초기화했습니다)
const artworkData = [
    { id: 1, title: "몽상의 숲", author: "AI Art Lab", tags: ["자연", "풍경화", "트렌디"], category: "이미지 생성", price: "150C", priceValue: 150, date: "2024-11-01", views: 1200, color: "#38761d", liked: false },
    { id: 2, title: "도시적 디자이너", author: "Creative Soul", tags: ["모던", "앱", "미니멀"], category: "어플 디자인", price: "300C", priceValue: 300, date: "2024-10-25", views: 850, color: "#674ea7", liked: false },
    { id: 3, title: "미래 건축", author: "Future Build", tags: ["SF", "건축", "3D"], category: "마케팅 배너", price: "200C", priceValue: 200, date: "2024-11-10", views: 2100, color: "#1c4587", liked: false },
    { id: 4, title: "사용자 경험", author: "UX Master", tags: ["UX", "앱", "기획"], category: "어플 디자인", price: "100C", priceValue: 100, date: "2024-09-15", views: 500, color: "#783f04", liked: false },
    { id: 5, title: "SNS 광고 배너", author: "Marketing Pro", tags: ["광고", "SNS", "트렌디"], category: "마케팅 배너", price: "80C", priceValue: 80, date: "2024-11-20", views: 3000, color: "#cc0000", liked: false },
    { id: 6, title: "도시의 야경", author: "김작가", tags: ["야경", "풍경화", "감성"], category: "일러스트", price: "300C", priceValue: 300, date: "2024-10-05", views: 400, color: "#9a3412", liked: false },
    { id: 7, title: "몽환적인 바다", author: "이작가", tags: ["바다", "몽환", "추상"], category: "일러스트", price: "550C", priceValue: 550, date: "2024-08-30", views: 1500, color: "#9d174d", liked: false },
    { id: 8, title: "사이버펑크 빌딩", author: "박작가", tags: ["SF", "사이버펑크", "컨셉아트"], category: "컨셉아트", price: "720C", priceValue: 720, date: "2024-11-25", views: 200, color: "#1e40af", liked: false },
    { id: 9, title: "미니멀 아이콘", author: "Simplicity", tags: ["미니멀", "아이콘", "UI"], category: "어플 디자인", price: "50C", priceValue: 50, date: "2024-11-15", views: 900, color: "#4b5563", liked: false },
    { id: 10, title: "추상적 감정", author: "Artistic Mind", tags: ["추상", "예술", "감정"], category: "이미지 생성", price: "400C", priceValue: 400, date: "2024-07-20", views: 600, color: "#0f766e", liked: false },
    // 40개 데이터 확장을 위해 복사된 데이터들도 모두 liked: false로 설정했다고 가정
    { id: 11, title: "네온 사인", author: "Night Walker", tags: ["네온", "밤", "힙한"], category: "일러스트", price: "120C", priceValue: 120, date: "2024-11-22", views: 1100, color: "#be185d", liked: false },
    { id: 12, title: "레트로 게임", author: "Pixel Artist", tags: ["레트로", "픽셀", "게임"], category: "컨셉아트", price: "90C", priceValue: 90, date: "2024-10-10", views: 3200, color: "#059669", liked: false },
    { id: 13, title: "화성 거주지", author: "Space X", tags: ["우주", "SF", "배경"], category: "컨셉아트", price: "600C", priceValue: 600, date: "2024-11-18", views: 150, color: "#c2410c", liked: false },
    { id: 14, title: "랜딩 페이지", author: "Web Guru", tags: ["웹", "UI", "비즈니스"], category: "어플 디자인", price: "250C", priceValue: 250, date: "2024-09-01", views: 700, color: "#374151", liked: false },
    { id: 15, title: "가을 풍경", author: "Season Art", tags: ["가을", "자연", "풍경화"], category: "이미지 생성", price: "180C", priceValue: 180, date: "2024-10-15", views: 550, color: "#b45309", liked: false },
    { id: 16, title: "할로윈 파티", author: "Event Master", tags: ["할로윈", "이벤트", "배너"], category: "마케팅 배너", price: "50C", priceValue: 50, date: "2024-10-30", views: 4000, color: "#7c2d12", liked: false },
];

const Explore = () => {
    // [2] 상태 관리
    const [artworks, setArtworks] = useState(artworkData);
    const [filteredData, setFilteredData] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("all");
    const [priceLevel, setPriceLevel] = useState("all");
    const [sortOrder, setSortOrder] = useState("relevance");
    const [showLikedOnly, setShowLikedOnly] = useState(false);
    
    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // 장바구니 & 모달 & 로딩
    const [cart, setCart] = useState([]);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [loading, setLoading] = useState(false);

    // 최근 검색어
    const [recentSearches, setRecentSearches] = useState([]);
    const [showRecentDropdown, setShowRecentDropdown] = useState(false);

    // [3] 초기 로드
    useEffect(() => {
        const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        setRecentSearches(savedSearches);
        applyFilters(); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // [4] 필터링 로직
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

    // 필터 변경 감지
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        applyFilters();
    }, [category, priceLevel, sortOrder, showLikedOnly]); 
    // 주의: artworks가 바뀌었을 때 전체 리로딩(스켈레톤)을 하면 찜하기가 불편하므로 여기엔 artworks를 넣지 않습니다.

    // 검색 실행
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

    // [중요] 찜하기 토글 함수 수정 (즉시 반응형)
    const toggleLike = (e, id) => {
        e.stopPropagation(); // 카드 클릭 방지

        // 1. 전체 원본 데이터 업데이트
        const newArtworks = artworks.map(item => 
            item.id === id ? { ...item, liked: !item.liked } : item
        );
        setArtworks(newArtworks);

        // 2. 현재 화면에 보이는 데이터도 즉시 업데이트 (로딩 없이 색상만 변경)
        const newFiltered = filteredData.map(item =>
            item.id === id ? { ...item, liked: !item.liked } : item
        );
        setFilteredData(newFiltered);
    };

    // 장바구니 담기
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
            <div className="fixed inset-0 z-0 opacity-40 bg-cover bg-center pointer-events-none" 
                 style={{backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/e/e5/Hubble_Ultra_Deep_Field_%28HUDF%29.jpg')"}}></div>

            {/* 헤더 */}
            <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-white cursor-pointer" onClick={() => window.location.reload()}>
                        cre<span className="text-orange-500">AI</span>tive
                    </span>
                    <div className="flex items-center space-x-6">
                        <div className="relative cursor-pointer group" title="장바구니">
                            <span className="text-2xl">🛒</span>
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cart.length}</span>
                            )}
                        </div>
                        <button className="bg-white text-gray-900 px-5 py-2 font-bold rounded-full text-sm hover:bg-gray-200">로그인</button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 py-10">
                {/* 검색 섹션 */}
                <section className="text-center py-12">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-orange-500 drop-shadow-lg">당신의 영감을 찾아보세요!</h1>
                    
                    <div className="relative max-w-3xl mx-auto z-50 mt-8">
                        <div className="flex p-2 bg-gray-800 rounded-full shadow-2xl border border-gray-700">
                            <input 
                                type="text" 
                                className="flex-grow bg-transparent p-3 pl-6 text-white focus:outline-none"
                                placeholder="검색어 입력..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onFocus={() => setShowRecentDropdown(true)}
                                onBlur={() => setTimeout(() => setShowRecentDropdown(false), 200)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button onClick={handleSearch} className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600">검색</button>
                        </div>
                        
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
                            <button key={tag} onClick={() => handleTagClick(tag)} className="text-sm bg-gray-700/50 hover:bg-gray-600 text-gray-300 px-4 py-1.5 rounded-full">
                                {tag}
                            </button>
                        ))}
                    </div>
                </section>

                <hr className="border-gray-800 my-10" />

                {/* 필터 툴바 */}
                <div className="bg-gray-800 p-4 rounded-xl mb-8 flex flex-col xl:flex-row gap-4 justify-between items-center border border-gray-700">
                    <div className="flex flex-wrap gap-2">
                        <select className="bg-gray-900 text-gray-300 p-2 rounded-lg border border-gray-600" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="all">모든 카테고리</option>
                            <option value="이미지 생성">이미지 생성</option>
                            <option value="어플 디자인">어플 디자인</option>
                            <option value="마케팅 배너">마케팅 배너</option>
                            <option value="일러스트">일러스트</option>
                        </select>
                        <select className="bg-gray-900 text-gray-300 p-2 rounded-lg border border-gray-600" value={priceLevel} onChange={(e) => setPriceLevel(e.target.value)}>
                            <option value="all">모든 가격</option>
                            <option value="free">무료</option>
                            <option value="low">100C 이하</option>
                            <option value="mid">100~300C</option>
                            <option value="high">300C 초과</option>
                        </select>
                        <button onClick={() => setShowLikedOnly(!showLikedOnly)} className={`px-4 py-2 rounded-lg border ${showLikedOnly ? 'bg-red-900/30 border-red-500 text-white' : 'bg-gray-900 border-gray-600 text-gray-400'}`}>
                            ♥ 찜한 작품만
                        </button>
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="text-gray-400 text-sm">정렬:</span>
                        <select className="bg-gray-900 text-white p-2 rounded-lg border border-gray-600" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="relevance">관련도순</option>
                            <option value="latest">최신순</option>
                            <option value="popular">인기순</option>
                            <option value="price_asc">가격 낮은순</option>
                        </select>
                    </div>
                </div>

                {/* 결과 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-xl bg-gray-800 border border-gray-700 h-80 animate-pulse"></div>
                        ))
                    ) : (
                        displayedItems.length > 0 ? (
                            displayedItems.map(item => (
                                <div key={item.id} className="group relative rounded-xl overflow-hidden cursor-pointer bg-gray-800 border border-gray-700 hover:shadow-2xl hover:scale-[1.02] transition duration-300">
                                    <div className="h-48 p-6 flex flex-col justify-between relative" style={{backgroundColor: item.color}} onClick={() => setSelectedArtwork(item)}>
                                        <div className="flex justify-between items-start z-10">
                                            <span className="text-xs bg-black/40 text-white px-2 py-1 rounded backdrop-blur-sm">{item.category}</span>
                                            {isNew(item.date) && <span className="text-xs font-bold bg-yellow-400 text-black px-2 py-0.5 rounded-full">NEW</span>}
                                        </div>
                                        <div className="z-10">
                                            <h3 className="text-xl font-bold text-white drop-shadow-md">{item.title}</h3>
                                            <p className="text-xs text-white/90">{item.author}</p>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                    </div>
                                    {/* 하트 버튼 */}
                                    <button onClick={(e) => toggleLike(e, item.id)} className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/20 hover:bg-white/20 transition">
                                        <span className={`text-2xl ${item.liked ? "text-red-500" : "text-white"}`}>
                                            {item.liked ? "♥" : "♡"}
                                        </span>
                                    </button>
                                    <div className="p-4 bg-gray-900 border-t border-gray-700 flex justify-between items-center" onClick={() => setSelectedArtwork(item)}>
                                        <div className="flex gap-1">
                                            {item.tags.slice(0, 2).map(tag => <span key={tag} className="text-[10px] text-gray-400 bg-gray-800 px-1 py-0.5 rounded">#{tag}</span>)}
                                        </div>
                                        <span className="text-orange-400 font-bold">{item.price}</span>
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
                        <button onClick={() => setCurrentPage(prev => prev + 1)} className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-full border border-gray-600 transition">
                            더 보기 ({displayedItems.length} / {filteredData.length})
                        </button>
                    </div>
                )}
            </main>

            {/* 상세 모달 */}
            {selectedArtwork && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setSelectedArtwork(null)}>
                    <div className="bg-white rounded-2xl p-8 max-w-3xl w-full mx-4 relative flex flex-col md:flex-row gap-8" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedArtwork(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                        
                        <div className="w-full md:w-1/2 aspect-square rounded-xl flex items-center justify-center text-gray-400" style={{backgroundColor: selectedArtwork.color}}>
                            이미지 미리보기
                        </div>
                        
                        <div className="w-full md:w-1/2 flex flex-col justify-between text-gray-900">
                            <div>
                                <span className="text-xs font-bold text-orange-500 uppercase">{selectedArtwork.category}</span>
                                <h2 className="text-3xl font-extrabold mb-2">{selectedArtwork.title}</h2>
                                <p className="text-sm text-gray-600 mb-6">By {selectedArtwork.author}</p>
                                <div className="py-4 border-y border-gray-100 text-sm text-gray-600">
                                    상세 설명...
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500">가격</span>
                                    <span className="text-3xl font-bold">{selectedArtwork.price}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={addToCart} className="flex-1 py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-50">장바구니</button>
                                    <button className="flex-[1.5] py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg">구매하기</button>
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