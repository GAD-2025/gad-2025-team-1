import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

const Explore = () => {
    // [1] 장바구니 Context 및 네비게이션 훅 사용
    const { addToCart, removeFromCart, isInCart, cartItems } = useCart();
    const navigate = useNavigate();

    // ----------------------------------------------------------------------
    // 상태 관리
    // ----------------------------------------------------------------------
    const [artworks, setArtworks] = useState([]); 
    const [filteredData, setFilteredData] = useState([]); 
    
    // 필터 상태
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("all");
    const [priceLevel, setPriceLevel] = useState("all");
    const [sortOrder, setSortOrder] = useState("relevance");
    const [showLikedOnly, setShowLikedOnly] = useState(false);
    
    // UI 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showRecentDropdown, setShowRecentDropdown] = useState(false);

    // ----------------------------------------------------------------------
    // 1. 서버에서 데이터 가져오기
    // ----------------------------------------------------------------------
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 백엔드 API 호출 (Port 5000)
                const response = await fetch('http://localhost:5000/api/artworks');
                
                if (!response.ok) {
                    throw new Error('서버 연결 실패');
                }

                const dbData = await response.json();

                const formattedData = dbData.map(item => ({
                    ...item,
                    img: item.image_url,       
                    author: item.artist_name,  
                    priceValue: item.price,    
                    price: `${item.price}C`,   
                    tags: item.tags ? item.tags.split(',') : [], 
                    color: "#1a1a1a"
                }));

                setArtworks(formattedData);
                setFilteredData(formattedData); 
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        setRecentSearches(savedSearches);
    }, []);

    // ----------------------------------------------------------------------
    // 2. 필터링 로직
    // ----------------------------------------------------------------------
    useEffect(() => {
        if(artworks.length === 0) return;

        setLoading(true);
        setTimeout(() => {
            let result = artworks.filter(item => {
                const matchQuery = item.title.toLowerCase().includes(keyword.toLowerCase()) || 
                                   item.author.toLowerCase().includes(keyword.toLowerCase()) ||
                                   (item.tags && item.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase())));
                
                const matchCategory = category === 'all' || item.category === category;
                
                let matchPrice = true;
                if (priceLevel === 'free') matchPrice = item.priceValue === 0;
                else if (priceLevel === 'low') matchPrice = item.priceValue > 0 && item.priceValue <= 100;
                else if (priceLevel === 'mid') matchPrice = item.priceValue > 100 && item.priceValue <= 300;
                else if (priceLevel === 'high') matchPrice = item.priceValue > 300;
                
                const matchLiked = showLikedOnly ? isInCart(item.id) : true;

                return matchQuery && matchCategory && matchPrice && matchLiked;
            });

            if (sortOrder === 'latest') {
                result.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));
            } else if (sortOrder === 'popular') {
                result.sort((a, b) => (b.views || 0) - (a.views || 0));
            } else if (sortOrder === 'price_asc') {
                result.sort((a, b) => a.priceValue - b.priceValue);
            }

            setFilteredData(result);
            setCurrentPage(1);
            setLoading(false);
        }, 300);
    }, [artworks, category, priceLevel, sortOrder, showLikedOnly, cartItems, keyword]);

    // ----------------------------------------------------------------------
    // 3. 핸들러 함수들 (줄바꿈 정리)
    // ----------------------------------------------------------------------
    
    // 검색 핸들러
    const handleSearch = () => {
        if (!keyword.trim()) {
            alert("검색어를 입력해주세요.");
            return;
        }
        const newSearches = [keyword, ...recentSearches.filter(k => k !== keyword)].slice(0, 3);
        setRecentSearches(newSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
        setShowRecentDropdown(false);
    };

    // 태그 클릭 핸들러
    const handleTagClick = (tag) => {
        setKeyword(tag.replace('#', ''));
    };

    // 찜하기(하트) 핸들러
    const handleHeartClick = (e, item) => {
        e.stopPropagation();
        if (isInCart(item.id)) {
            removeFromCart(item.id);
        } else {
            addToCart(item);
            if (window.confirm("장바구니에 담겼습니다!\n장바구니로 이동하시겠습니까?")) {
                navigate('/cart');
            }
        }
    };

    // 모달 내 '장바구니 담기' 핸들러
    const handleModalAddToCart = () => {
        if (!selectedArtwork) return;
        
        if (isInCart(selectedArtwork.id)) {
            if (window.confirm("이미 장바구니에 있는 작품입니다.\n장바구니에서 확인하시겠습니까?")) {
                navigate('/cart');
            }
        } else {
            addToCart(selectedArtwork);
            if (window.confirm("장바구니에 담겼습니다!\n장바구니로 이동하시겠습니까?")) {
                navigate('/cart');
            }
        }
    };

    // ★ [수정됨] 구매하기 버튼 핸들러 (2단계 흐름 적용)
    const handleModalBuy = async () => {
        if (!selectedArtwork) return;

        const userId = localStorage.getItem('userId') || 'admin';

        // 1. 구매 의사 확인
        const confirmMsg = `'${selectedArtwork.title}' 작품을 구매하시겠습니까?\n(보유 코인이 차감됩니다)`;
        if (!window.confirm(confirmMsg)) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    artworkId: selectedArtwork.id,
                    price: selectedArtwork.priceValue
                })
            });

            const data = await response.json();

            if (data.success) {
                // 2. 구매 성공 알림
                const moveMsg = `구매가 완료되었습니다! 🎉\n(남은 코인: ${data.leftCoins}C)\n\n[확인] -> 작품 보관함으로 이동\n[취소] -> 계속 둘러보기`;
                
                // 장바구니/찜 목록 정리
                if (isInCart(selectedArtwork.id)) {
                    removeFromCart(selectedArtwork.id);
                }

                // 3. 이동 여부 질문
                if (window.confirm(moveMsg)) {
                    navigate('/archive'); // 이동
                } else {
                    setSelectedArtwork(null); // 모달 닫고 계속 쇼핑
                }

            } else {
                alert(`구매 실패: ${data.message}`);
            }
        } catch (error) {
            console.error("구매 에러:", error);
            alert("서버와 연결할 수 없습니다. 백엔드가 켜져 있는지 확인해주세요.");
        }
    };

    const isNew = (dateString) => {
        if (!dateString) return false;
        // 날짜 계산 로직 (필요 시 복구)
        return true; 
    };

    const displayedItems = filteredData.slice(0, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans relative">
            <div className="fixed inset-0 z-0 opacity-80 bg-cover bg-center pointer-events-none" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop')"}}></div>

            {/* 헤더 */}
            <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-extrabold text-orange-600 cursor-pointer hover:opacity-80 transition">
                        creAItive
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/marketplace" className="text-gray-400 hover:text-white transition font-medium">거래하기</Link>
                        <Link to="/archive" className="text-gray-400 hover:text-white transition font-medium">작품 보관함</Link>
                        <Link to="/myspace" className="text-gray-400 hover:text-white transition font-medium">마이스페이스</Link>
                        <Link to="/setting" className="text-gray-400 hover:text-white transition font-medium">설정</Link>
                    </nav>

                    <div className="flex items-center space-x-6">
                        <div className="relative cursor-pointer group" onClick={() => navigate('/cart')} title="장바구니">
                            <span className="text-2xl text-gray-400 group-hover:text-white transition">🛒</span>
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {cartItems.length}
                                </span>
                            )}
                        </div>
                        <button className="bg-orange-600 text-white px-5 py-2 font-bold rounded-lg text-sm hover:bg-orange-700 transition">로그인</button>
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

                {/* 작품 목록 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-xl bg-gray-900 border border-gray-800 h-80 animate-pulse"></div>
                        ))
                    ) : (
                        displayedItems.length > 0 ? (
                            displayedItems.map(item => {
                                const isAdded = isInCart(item.id);

                                return (
                                    <div key={item.id} className="group relative rounded-xl overflow-hidden cursor-pointer bg-gray-900 border border-gray-800 hover:shadow-2xl hover:scale-[1.02] hover:border-gray-600 transition duration-300">
                                        <div className="h-48 relative overflow-hidden" onClick={() => setSelectedArtwork(item)}>
                                            <img 
                                                src={item.img} 
                                                alt={item.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute top-0 left-0 w-full flex justify-between items-start p-3 z-10">
                                                <span className="text-[10px] bg-black/60 text-white px-2 py-1 rounded backdrop-blur-md border border-white/20">{item.category}</span>
                                                {isNew(item.created_at) && <span className="text-[10px] font-bold bg-orange-600 text-white px-2 py-0.5 rounded shadow">NEW</span>}
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="bg-white/90 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition">상세보기</span>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={(e) => handleHeartClick(e, item)} 
                                            className="absolute top-40 right-3 z-20 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20 transition border border-white/10"
                                        >
                                            <span className={`text-xl transition-colors duration-300 ${isAdded ? "text-red-500" : "text-white"}`}>
                                                {isAdded ? "♥" : "♡"}
                                            </span>
                                        </button>

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
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                <p>조건에 맞는 작품이 없습니다.</p>
                                {artworks.length === 0 && <p className="text-sm mt-2 text-red-400">※ 서버가 켜져 있는지 확인해주세요!</p>}
                            </div>
                        )
                    )}
                </div>

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
                                    {selectedArtwork.description || "이 작품은 AI 알고리즘을 통해 생성된 독창적인 디지털 아트워크입니다."}
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-400">판매 가격</span>
                                    <span className="text-3xl font-bold text-orange-500">{selectedArtwork.price}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleModalAddToCart} 
                                        className={`flex-1 py-3.5 border rounded-xl font-bold transition ${isInCart(selectedArtwork.id) ? 'border-red-500 text-red-500 hover:bg-red-500/10' : 'border-gray-600 hover:bg-gray-800 text-white'}`}
                                    >
                                        {isInCart(selectedArtwork.id) ? '장바구니 확인' : '장바구니 담기'}
                                    </button>
                                    <button 
                                        onClick={handleModalBuy} 
                                        className="flex-[1.5] py-3.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-900/20 transition"
                                    >
                                        구매하기
                                    </button>
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