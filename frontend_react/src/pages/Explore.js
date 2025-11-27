import React, { useState, useEffect, useCallback } from 'react';
import './Explore.css';

const Explore = () => {
    const artworkData = [
        { id: 1, title: "몽상의 숲", author: "AI Art Lab", tags: ["자연", "풍경화", "트렌디"], category: "이미지 생성", price: "150C", priceValue: 150, date: "2024-11-01", views: 1200, color: "#38761d", liked: false },
        { id: 2, title: "도시적 디자이너", author: "Creative Soul", tags: ["모던", "앱", "미니멀"], category: "어플 디자인", price: "300C", priceValue: 300, date: "2024-10-25", views: 850, color: "#674ea7", liked: false },
        { id: 3, title: "미래 건축", author: "Future Build", tags: ["SF", "건축", "3D"], category: "마케팅 배너", price: "200C", priceValue: 200, date: "2024-11-10", views: 2100, color: "#1c4587", liked: true },
        { id: 4, title: "사용자 경험", author: "UX Master", tags: ["UX", "앱", "기획"], category: "어플 디자인", price: "100C", priceValue: 100, date: "2024-09-15", views: 500, color: "#783f04", liked: false },
        { id: 5, title: "SNS 광고 배너", author: "Marketing Pro", tags: ["광고", "SNS", "트렌디"], category: "마케팅 배너", price: "80C", priceValue: 80, date: "2024-11-20", views: 3000, color: "#cc0000", liked: false },
        { id: 6, title: "도시의 야경", author: "김작가", tags: ["야경", "풍경화", "감성"], category: "일러스트", price: "300C", priceValue: 300, date: "2024-10-05", views: 400, color: "#9a3412", liked: false },
        { id: 7, title: "몽환적인 바다", author: "이작가", tags: ["바다", "몽환", "추상"], category: "일러스트", price: "550C", priceValue: 550, date: "2024-08-30", views: 1500, color: "#9d174d", liked: false },
        { id: 8, title: "사이버펑크 빌딩", author: "박작가", tags: ["SF", "사이버펑크", "컨셉아트"], category: "컨셉아트", price: "720C", priceValue: 720, date: "2024-11-25", views: 200, color: "#1e40af", liked: false },
        { id: 9, title: "미니멀 아이콘", author: "Simplicity", tags: ["미니멀", "아이콘", "UI"], category: "어플 디자인", price: "50C", priceValue: 50, date: "2024-11-15", views: 900, color: "#4b5563", liked: false },
        { id: 10, title: "추상적 감정", author: "Artistic Mind", tags: ["추상", "예술", "감정"], category: "이미지 생성", price: "400C", priceValue: 400, date: "2024-07-20", views: 600, color: "#0f766e", liked: false },
        { id: 11, title: "네온 사인", author: "Night Walker", tags: ["네온", "밤", "힙한"], category: "일러스트", price: "120C", priceValue: 120, date: "2024-11-22", views: 1100, color: "#be185d", liked: false },
        { id: 12, title: "레트로 게임", author: "Pixel Artist", tags: ["레트로", "픽셀", "게임"], category: "컨셉아트", price: "90C", priceValue: 90, date: "2024-10-10", views: 3200, color: "#059669", liked: false },
        { id: 13, title: "화성 거주지", author: "Space X", tags: ["우주", "SF", "배경"], category: "컨셉아트", price: "600C", priceValue: 600, date: "2024-11-18", views: 150, color: "#c2410c", liked: false },
        { id: 14, title: "랜딩 페이지", author: "Web Guru", tags: ["웹", "UI", "비즈니스"], category: "어플 디자인", price: "250C", priceValue: 250, date: "2024-09-01", views: 700, color: "#374151", liked: false },
        { id: 15, title: "가을 풍경", author: "Season Art", tags: ["가을", "자연", "풍경화"], category: "이미지 생성", price: "180C", priceValue: 180, date: "2024-10-15", views: 550, color: "#b45309", liked: false },
        { id: 16, title: "할로윈 파티", author: "Event Master", tags: ["할로윈", "이벤트", "배너"], category: "마케팅 배너", price: "50C", priceValue: 50, date: "2024-10-30", views: 4000, color: "#7c2d12", liked: false },
        { id: 17, title: "겨울 왕국", author: "Snow Man", tags: ["겨울", "눈", "판타지"], category: "일러스트", price: "330C", priceValue: 330, date: "2024-11-28", views: 2200, color: "#0ea5e9", liked: false },
        { id: 18, title: "AI 로봇", author: "Tech Lab", tags: ["로봇", "AI", "미래"], category: "이미지 생성", price: "450C", priceValue: 450, date: "2024-08-05", views: 900, color: "#475569", liked: false },
        { id: 19, title: "모바일 뱅킹", author: "FinTech", tags: ["금융", "앱", "UI"], category: "어플 디자인", price: "500C", priceValue: 500, date: "2024-11-05", views: 300, color: "#1e3a8a", liked: false },
        { id: 20, title: "블랙 프라이데이", author: "Sale King", tags: ["세일", "광고", "배너"], category: "마케팅 배너", price: "40C", priceValue: 40, date: "2024-11-25", views: 5000, color: "#000000", liked: false },
        { id: 21, title: "숲속의 오두막", author: "Nature Lover", tags: ["힐링", "숲", "동화"], category: "일러스트", price: "220C", priceValue: 220, date: "2024-09-20", views: 1300, color: "#166534", liked: false },
        { id: 22, title: "고양이 초상화", author: "Cat Mom", tags: ["동물", "고양이", "귀여운"], category: "이미지 생성", price: "110C", priceValue: 110, date: "2024-11-12", views: 2500, color: "#f59e0b", liked: false },
        { id: 23, title: "대시보드 UI", author: "Admin Pro", tags: ["관리자", "웹", "데이터"], category: "어플 디자인", price: "350C", priceValue: 350, date: "2024-10-01", views: 600, color: "#312e81", liked: false },
        { id: 24, title: "신년 인사", author: "Card Maker", tags: ["새해", "카드", "전통"], category: "마케팅 배너", price: "60C", priceValue: 60, date: "2024-12-01", views: 800, color: "#9f1239", liked: false },
        { id: 25, title: "수중 도시", author: "Deep Sea", tags: ["물", "SF", "판타지"], category: "컨셉아트", price: "650C", priceValue: 650, date: "2024-07-15", views: 180, color: "#0891b2", liked: false },
        { id: 26, title: "빈티지 카페", author: "Coffee Love", tags: ["카페", "빈티지", "감성"], category: "일러스트", price: "190C", priceValue: 190, date: "2024-10-22", views: 1400, color: "#78350f", liked: false },
        { id: 27, title: "운동 앱 UI", author: "Health Care", tags: ["운동", "건강", "앱"], category: "어플 디자인", price: "280C", priceValue: 280, date: "2024-11-08", views: 950, color: "#15803d", liked: false },
        { id: 28, title: "봄의 정원", author: "Flower Art", tags: ["봄", "꽃", "화사한"], category: "이미지 생성", price: "160C", priceValue: 160, date: "2024-04-10", views: 2000, color: "#db2777", liked: false },
        { id: 29, title: "판타지 드래곤", author: "Dragon Lord", tags: ["판타지", "몬스터", "용"], category: "컨셉아트", price: "800C", priceValue: 800, date: "2024-11-29", views: 50, color: "#4c1d95", liked: false },
        { id: 30, title: "유튜브 인트로", author: "Video Star", tags: ["유튜브", "영상", "썸네일"], category: "마케팅 배너", price: "70C", priceValue: 70, date: "2024-11-15", views: 3500, color: "#b91c1c", liked: false },
    ];

    const [currentKeyword, setCurrentKeyword] = useState("");
    const [showLikedOnly, setShowLikedOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilteredData, setCurrentFilteredData] = useState([]);
    const [cart, setCart] = useState([]);
    const [currentOpenedItemId, setCurrentOpenedItemId] = useState(null);
    const [recentSearches, setRecentSearches] = useState(JSON.parse(localStorage.getItem('recentSearches')) || []);
    const [isSearching, setIsSearching] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showRecent, setShowRecent] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('relevance');

    const itemsPerPage = 8;

    const applyFilters = useCallback(() => {
        setIsSearching(true);
        setTimeout(() => {
            let filtered = artworkData.filter(item => {
                const matchQuery = currentKeyword === "" || item.title.toLowerCase().includes(currentKeyword) ||
                                   item.author.toLowerCase().includes(currentKeyword) ||
                                   item.tags.some(tag => tag.toLowerCase().includes(currentKeyword));
                const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
                
                let matchPrice = true;
                if (priceFilter === 'free') matchPrice = item.priceValue === 0;
                else if (priceFilter === 'low') matchPrice = item.priceValue > 0 && item.priceValue <= 100;
                else if (priceFilter === 'mid') matchPrice = item.priceValue > 100 && item.priceValue <= 300;
                else if (priceFilter === 'high') matchPrice = item.priceValue > 300;
                
                const matchLiked = showLikedOnly ? item.liked : true;

                return matchQuery && matchCategory && matchPrice && matchLiked;
            });

            if (sortOrder === 'latest') {
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else if (sortOrder === 'popular') {
                filtered.sort((a, b) => b.views - a.views);
            } else if (sortOrder === 'price_asc') {
                filtered.sort((a, b) => a.priceValue - b.priceValue);
            }

            setCurrentFilteredData(filtered);
            setCurrentPage(1);
            setIsSearching(false);
        }, 500);
    }, [currentKeyword, categoryFilter, priceFilter, sortOrder, showLikedOnly]);

    useEffect(() => {
        if (currentKeyword) {
            applyFilters();
        }
    }, [currentKeyword, categoryFilter, priceFilter, sortOrder, showLikedOnly, applyFilters]);

    const executeSearch = () => {
        const query = searchInput.trim();
        if (!query) {
            alert("검색어를 입력해주세요.");
            return;
        }
        saveRecentSearch(query);
        setCurrentKeyword(query.toLowerCase());
        setShowRecent(false);
    };

    const saveRecentSearch = (keyword) => {
        const updatedSearches = recentSearches.filter(item => item !== keyword);
        updatedSearches.unshift(keyword);
        if (updatedSearches.length > 3) updatedSearches.pop();
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    const searchKeyword = (keyword) => {
        const cleanKeyword = keyword.replace('#', '');
        setSearchInput(cleanKeyword);
        executeSearch();
    };

    const toggleLike = (event, id) => {
        event.stopPropagation();
        const updatedData = artworkData.map(d => d.id === id ? { ...d, liked: !d.liked } : d);
        const item = updatedData.find(d => d.id === id);
        if (item) {
            if (item.liked) showToast(`'${item.title}' 찜 완료! ❤️`);
            else showToast(`찜 삭제 완료.`);
        }
        // This is a hack since we are not using a proper state management for artworkData
        // In a real app, artworkData would be part of the state.
        setCurrentFilteredData(currentFilteredData.map(d => d.id === id ? { ...d, liked: !d.liked } : d));
    };

    const toggleLikedFilter = () => {
        setShowLikedOnly(!showLikedOnly);
    };

    const addToCartCurrentItem = () => {
        if (!currentOpenedItemId) return;
        if (cart.includes(currentOpenedItemId)) {
            showToast("이미 장바구니에 담긴 작품입니다.");
            return;
        }
        setCart([...cart, currentOpenedItemId]);
        const item = artworkData.find(d => d.id === currentOpenedItemId);
        if(item) showToast(`🛒 '${item.title}' 장바구니에 담김!`);
    };

    const openModalDetails = (id) => {
        setCurrentOpenedItemId(id);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = '';
        setCurrentOpenedItemId(null);
    };

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage("");
        }, 3000);
    };

    const resetFilters = () => {
        setCategoryFilter('all');
        setPriceFilter('all');
        setSortOrder('relevance');
        setShowLikedOnly(false);
    };

    const resetSearch = (e) => {
        if(e) e.preventDefault();
        setSearchInput('');
        setCurrentKeyword('');
    };

    const isNew = (dateString) => {
        const date = new Date(dateString);
        const now = new Date('2024-11-26');
        const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24)); 
        return diffDays <= 30; 
    };

    const itemsToShow = currentFilteredData.slice(0, currentPage * itemsPerPage);
    const currentOpenItem = artworkData.find(item => item.id === currentOpenedItemId);

    return (
        <div className="antialiased">
            {isModalOpen && currentOpenItem && (
                <div id="artworkDetailModal" className="modal-overlay" style={{display: 'flex'}} onClick={closeModal}>
                    <div className="modal-content relative max-w-3xl w-full mx-4 text-left" onClick={e => e.stopPropagation()}>
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <div className="flex flex-col md:flex-row gap-8">
                            <div id="modalImageArea" className="w-full md:w-1/2 aspect-square md:h-80 rounded-xl flex items-center justify-center text-gray-400 shadow-inner" style={{backgroundColor: currentOpenItem.color}}>
                                <span className="text-sm">Artwork Image Preview</span>
                            </div>

                            <div className="w-full md:w-1/2 flex flex-col justify-between">
                                <div>
                                    <span id="modalCategory" className="text-xs font-bold text-orange-500 tracking-wider uppercase mb-2 block">{currentOpenItem.category}</span>
                                    <h2 id="modalArtworkTitle" className="text-3xl font-extrabold mb-2 text-gray-900 leading-tight">{currentOpenItem.title}</h2>
                                    <div className="flex items-center gap-2 mb-6">
                                         <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                                         <p className="text-sm text-gray-600">By <span id="modalAuthor" className="font-semibold text-gray-900">{currentOpenItem.author}</span></p>
                                    </div>
                                    
                                    <div className="border-t border-b border-gray-100 py-4 mb-6">
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            이 작품은 AI가 생성한 고유한 디지털 자산입니다. 구매 시 상업적 이용이 가능한 라이선스가 포함되며, 고해상도 원본 파일을 다운로드할 수 있습니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <header className="sticky top-0 z-[100] bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <a href="#" className="logo-placeholder" onClick={resetSearch}>
                            cre<span className="ai">AI</span>tive
                        </a>
                        
                        <nav className="hidden md:flex space-x-6">
                            <a href="#" className="text-gray-300 hover:text-white transition">거래하기</a>
                            <button className="text-gray-300 hover:text-white transition">작품 보관함</button>
                            <button className="text-gray-300 hover:text-white transition">마이스페이스</button>
                            <button className="text-gray-300 hover:text-white transition">설정</button>
                        </nav>

                        <div className="flex items-center space-x-6">
                            <div className="relative cursor-pointer group" title="장바구니">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cart.length > 0 && <span id="cartCountBadge" className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-gray-900 animate-bounce">{cart.length}</span>}
                            </div>

                            <button className="bg-white text-gray-900 px-5 py-2 font-bold rounded-full text-sm hover:bg-gray-200 transition">로그인</button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <section className="py-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-orange-500 drop-shadow-lg">당신의 영감을 찾아보세요!</h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-light">
                        최신 트렌드의 작품부터 희귀한 보석같은 작품까지,<br/>지금 바로 탐색을 시작하세요!
                    </p>
                    
                    <div className="relative max-w-3xl mx-auto z-50">
                        <div className="flex p-2 bg-gray-800 rounded-full shadow-2xl border border-gray-700 focus-within:border-orange-500 transition-colors">
                            <input type="text" id="searchInput" 
                                   placeholder="작품명, 작가, #태그 검색 (예: 몽환, 김작가)" 
                                   autoComplete="off"
                                   value={searchInput}
                                   onChange={(e) => setSearchInput(e.target.value)}
                                   onKeyPress={(e) => e.key === 'Enter' && executeSearch()}
                                   onFocus={() => setShowRecent(true)}
                                   onBlur={() => setTimeout(() => setShowRecent(false), 200)}
                                   className="flex-grow bg-transparent p-3 pl-6 text-white focus:outline-none placeholder-gray-400 rounded-l-full"
                                   />
                            <button onClick={executeSearch} className="search-btn cta-button text-white px-8 py-3 font-semibold rounded-full hover:opacity-90 transition">
                                검색
                            </button>
                        </div>

                        {showRecent && recentSearches.length > 0 && (
                            <div id="recentSearchDropdown" className="absolute top-full left-4 right-4 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                                <div className="px-4 py-3 bg-gray-800/80 text-xs text-gray-500 font-bold border-b border-gray-700 flex justify-between items-center backdrop-blur-sm">
                                    <span>최근 검색어</span>
                                    <button onClick={() => setRecentSearches([])} className="text-gray-500 hover:text-red-400 transition underline">전체 삭제</button>
                                </div>
                                <ul id="recentSearchList" className="text-left py-1">
                                    {recentSearches.map(keyword => (
                                        <li key={keyword} className="px-4 py-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0 text-gray-300 hover:text-white transition flex justify-between items-center group"
                                            onClick={() => searchKeyword(keyword)}>
                                            <div className="flex items-center gap-3">
                                                <svg className="w-4 h-4 text-gray-500 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                <span>{keyword}</span>
                                            </div>
                                            <span className="text-xs text-gray-600 group-hover:text-gray-400">검색</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                        <button className="text-xs md:text-sm bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 px-4 py-1.5 rounded-full transition" onClick={() => searchKeyword('트렌디')}>#트렌디</button>
                        <button className="text-xs md:text-sm bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 px-4 py-1.5 rounded-full transition" onClick={() => searchKeyword('미니멀')}>#미니멀</button>
                        <button className="text-xs md:text-sm bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 px-4 py-1.5 rounded-full transition" onClick={() => searchKeyword('추상')}>#추상</button>
                        <button className="text-xs md:text-sm bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 px-4 py-1.5 rounded-full transition" onClick={() => searchKeyword('풍경화')}>#풍경화</button>
                        <button className="text-xs md:text-sm bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 px-4 py-1.5 rounded-full transition" onClick={() => searchKeyword('컨셉아트')}>#컨셉아트</button>
                    </div>
                </section>

                <div className="border-t border-gray-800 my-10"></div>

                {currentKeyword ? (
                    <section id="searchResultsSection" className="mb-20 relative min-h-[500px]">
                        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">검색 결과 <span id="resultCount" className="text-orange-500 text-xl ml-2">({isSearching ? "로딩중..." : `${currentFilteredData.length}건`})</span></h2>
                                <p className="text-gray-400">검색어: "<span id="currentQuery" className="text-white font-semibold">{currentKeyword}</span>"</p>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-xl mb-8 flex flex-col xl:flex-row gap-4 justify-between items-center border border-gray-700 shadow-lg">
                            <div className="flex flex-wrap gap-2 w-full xl:w-auto items-center justify-center md:justify-start">
                                <select id="filterCategory" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-gray-900 text-gray-300 text-sm border border-gray-600 rounded-lg p-2.5 focus:ring-orange-500 focus:border-orange-500 outline-none">
                                    <option value="all">모든 카테고리</option>
                                    <option value="이미지 생성">이미지 생성</option>
                                    <option value="어플 디자인">어플 디자인</option>
                                    <option value="마케팅 배너">마케팅 배너</option>
                                    <option value="일러스트">일러스트</option>
                                    <option value="컨셉아트">컨셉아트</option>
                                </select>
                                <select id="filterPrice" value={priceFilter} onChange={e => setPriceFilter(e.target.value)} className="bg-gray-900 text-gray-300 text-sm border border-gray-600 rounded-lg p-2.5 focus:ring-orange-500 focus:border-orange-500 outline-none">
                                    <option value="all">모든 가격</option>
                                    <option value="free">무료 (0C)</option>
                                    <option value="low">100C 이하</option>
                                    <option value="mid">100C ~ 300C</option>
                                    <option value="high">300C 초과</option>
                                </select>
                                <button id="btnToggleLike" onClick={toggleLikedFilter} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold border transition duration-200 ${showLikedOnly ? 'bg-red-900/30 border-red-500 text-white' : 'bg-gray-900 border-gray-600 text-gray-400 hover:text-white hover:border-red-500'}`}>
                                    <span className="text-red-500 text-lg">♥</span> 찜한 작품만
                                </button>
                            </div>

                            <div className="flex items-center gap-2 w-full xl:w-auto justify-end">
                                <label htmlFor="sortOrder" className="text-sm text-gray-400 whitespace-nowrap">정렬:</label>
                                <select id="sortOrder" value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-gray-900 text-white text-sm border border-gray-600 rounded-lg p-2.5 focus:ring-orange-500 focus:border-orange-500 outline-none">
                                    <option value="relevance">관련도순</option>
                                    <option value="latest">최신순</option>
                                    <option value="popular">인기순</option>
                                    <option value="price_asc">가격 낮은순</option>
                                </select>
                            </div>
                        </div>

                        {isSearching ? (
                            <div id="resultsGrid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="rounded-xl overflow-hidden bg-gray-800 border border-gray-700 animate-pulse">
                                        <div className="h-48 bg-gray-700/50"></div> <div className="p-6 space-y-3">
                                            <div className="h-6 bg-gray-700/50 rounded w-3/4"></div> <div className="h-4 bg-gray-700/50 rounded w-1/2"></div> </div>
                                        <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                                            <div className="flex space-x-2">
                                                <div className="h-4 w-10 bg-gray-700/50 rounded"></div>
                                                <div className="h-4 w-10 bg-gray-700/50 rounded"></div>
                                            </div>
                                            <div className="h-5 w-12 bg-gray-700/50 rounded"></div> </div>
                                    </div>
                                ))}
                            </div>
                        ) : itemsToShow.length > 0 ? (
                            <>
                                <div id="resultsGrid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {itemsToShow.map(item => (
                                        <div key={item.id} className="group relative rounded-xl overflow-hidden cursor-pointer transition duration-300 hover:shadow-2xl bg-gray-800 border border-gray-700 hover:border-gray-500 fade-in">
                                            <div className="h-48 relative p-6 flex flex-col justify-between" style={{backgroundColor: item.color}} onClick={() => openModalDetails(item.id)}>
                                                <div className="flex justify-between items-start z-10">
                                                    <span className="text-xs bg-black/40 text-white px-2 py-1 rounded backdrop-blur-sm border border-white/10">{item.category}</span>
                                                    {isNew(item.date) && <span className="text-xs font-bold bg-yellow-400 text-black px-2 py-0.5 rounded-full shadow-lg">NEW</span>}
                                                </div>
                                                <div className="z-10">
                                                    <h3 className="text-xl font-bold text-white drop-shadow-md group-hover:scale-105 transition-transform origin-left">{item.title}</h3>
                                                    <p className="text-xs text-white/90 font-light">{item.author}</p>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                            </div>
                                            
                                            <button onClick={(e) => toggleLike(e, item.id)} className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/20 transition duration-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${item.liked ? "text-red-500 fill-current" : "text-white hover:text-red-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>

                                            <div className="p-4 bg-gray-900 border-t border-gray-700 flex justify-between items-center" onClick={() => openModalDetails(item.id)}>
                                                <div className="flex space-x-1 overflow-hidden">
                                                    {item.tags.slice(0, 2).map(tag => `<span class="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">#${tag}</span>`).join('')}
                                                </div>
                                                <span className="text-orange-400 font-bold text-lg">{item.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {itemsToShow.length < currentFilteredData.length && (
                                    <div id="loadMoreContainer" className="text-center mt-12">
                                        <button onClick={() => setCurrentPage(currentPage + 1)} className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-full border border-gray-600 transition duration-200 flex items-center justify-center mx-auto gap-2 group">
                                            <span>더 보기</span>
                                            <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </button>
                                        <p className="text-gray-500 text-sm mt-3">
                                            <span id="displayedCount">{itemsToShow.length}</span> / <span id="totalCount">{currentFilteredData.length}</span> 작품 표시 중
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div id="noResultsMsg" className="text-center py-20 bg-gray-900/50 rounded-xl border border-dashed border-gray-700">
                                <p className="text-xl text-gray-400 mb-2">조건에 맞는 작품이 없습니다.</p>
                                <button onClick={resetFilters} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition">필터 초기화</button>
                            </div>
                        )}
                    </section>
                ) : (
                    <div id="defaultContent">
                        <section className="mb-20">
                            <div className="flex items-baseline justify-start space-x-4 mb-4">
                                <span className="text-2xl md:text-3xl font-bold text-white">금주의 추천 작품</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 rounded-xl cursor-pointer hover:ring-2 hover:ring-white transition shadow-lg" style={{backgroundColor: '#38761d'}} onClick={() => openModalDetails(1)}>
                                    <span className="text-xs font-semibold bg-yellow-300 text-gray-900 px-2 py-0.5 rounded-full mb-2 inline-block">NEW</span>
                                    <h3 className="text-3xl font-bold mb-1">몽상의 숲</h3>
                                    <p className="text-sm opacity-80 mb-4">자연과 AI의 조화</p>
                                </div>
                                <div className="p-6 rounded-xl cursor-pointer hover:ring-2 hover:ring-white transition shadow-lg" style={{backgroundColor: '#674ea7'}} onClick={() => openModalDetails(2)}>
                                    <h3 className="text-3xl font-bold mb-1">도시적 디자이너</h3>
                                    <p className="text-sm opacity-80 mb-4">모던 UI/UX</p>
                                </div>
                                <div className="p-6 rounded-xl cursor-pointer hover:ring-2 hover:ring-white transition shadow-lg" style={{backgroundColor: '#1c4587'}} onClick={() => openModalDetails(3)}>
                                    <h3 className="text-3xl font-bold mb-1">미래 건축</h3>
                                    <p className="text-sm opacity-80 mb-4">3D 렌더링</p>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </main>

            <footer className="bg-gray-900/90 border-t border-gray-800 mt-12 py-8 text-center text-sm text-gray-500">
                &copy; 2025 creAI-tive Art Marketplace. All rights reserved.
            </footer>

            {toastMessage && (
                <div id="toastMessage" className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-[2000] border border-gray-600" style={{opacity: 1, transform: 'translate(-50%, 0)'}}>
                    <div className="bg-green-500 rounded-full p-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span id="toastText" className="font-medium text-sm">{toastMessage}</span>
                </div>
            )}
        </div>
    );
};

export default Explore;