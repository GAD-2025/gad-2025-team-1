import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { useUser } from '../context/UserContext'; 
import Header from '../components/Header'; 

const Explore = ({ refreshInventory }) => { // App.js에서 refreshInventory를 넘겨준다면 받음 (없어도 작동함)
    const { addToCart, removeFromCart, isInCart, cartItems } = useCart();
    const navigate = useNavigate();

    // ----------------------------------------------------------------------
    // 상태 관리
    // ----------------------------------------------------------------------
    const [currentUser, setCurrentUser] = useState(null); // ★ [추가] 로그인 유저 상태

    const [artworks, setArtworks] = useState([]); // 전체 데이터 (서버 원본)
    const [filteredData, setFilteredData] = useState([]); // 화면에 보여줄 데이터
    const [weeklyBest, setWeeklyBest] = useState([]); // 금주의 추천
    
    // UI 및 검색 상태
    const [keyword, setKeyword] = useState(""); 
    const [searchQuery, setSearchQuery] = useState(""); 
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [isSearching, setIsSearching] = useState(false); 
    
    const [recentSearches, setRecentSearches] = useState([]);
    const [showRecentDropdown, setShowRecentDropdown] = useState(false);

    // ----------------------------------------------------------------------
    // 0. 로그인 정보: UserContext 사용 (세션스토리지 대신 Context로 통합)
    // ----------------------------------------------------------------------
    const { user, deductCoins } = useUser();

    // ----------------------------------------------------------------------
    // 1. 서버 데이터 가져오기
    // ----------------------------------------------------------------------
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/artworks');
                if (!response.ok) throw new Error('서버 연결 실패');
                const dbData = await response.json();

                const formattedData = dbData.map(item => ({
                    ...item,
                    img: item.image_url,       
                    author: item.artist_name,  
                    priceValue: item.price,    
                    price: `${item.price.toLocaleString()}C`,   
                    tags: item.tags ? item.tags.split(',') : [], 
                    isWeekly: item.is_weekly_best === 1
                }));

                setArtworks(formattedData);
                setFilteredData(formattedData); 
                setWeeklyBest(formattedData.filter(item => item.isWeekly));

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
    // 2. 검색 로직
    // ----------------------------------------------------------------------
    const executeSearch = (query) => {
        if (!query.trim()) {
            setFilteredData(artworks); 
            setSearchQuery("");
            return;
        }

        setIsSearching(true); 
        setSearchQuery(query);

        setTimeout(() => {
            const result = artworks.filter(item => 
                item.title.toLowerCase().includes(query.toLowerCase()) || 
                item.author.toLowerCase().includes(query.toLowerCase()) ||
                (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
            );
            setFilteredData(result);
            setIsSearching(false); 
        }, 500);

        const newSearches = [query, ...recentSearches.filter(k => k !== query)].slice(0, 5);
        setRecentSearches(newSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
        setShowRecentDropdown(false);
    };

    // ----------------------------------------------------------------------
    // 3. 핸들러 함수들
    // ----------------------------------------------------------------------
    const handleSearchClick = () => executeSearch(keyword);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') executeSearch(keyword);
    };

    const handleRecentClick = (tag) => {
        setKeyword(tag);
        executeSearch(tag);
    };

    const handleTagClick = (tag) => {
        const cleanTag = tag.replace('#', '');
        setKeyword(cleanTag);
        executeSearch(cleanTag);
    };

    const handleCardClick = (item) => setSelectedArtwork(item);
    const handleCloseModal = () => setSelectedArtwork(null);
    
    const handleModalAddToCart = () => {
        if (!selectedArtwork) return;
        if (isInCart(selectedArtwork.id)) {
            if (window.confirm("이미 장바구니에 있는 작품입니다.\n장바구니에서 확인하시겠습니까?")) navigate('/cart');
        } else {
            addToCart(selectedArtwork);
            if (window.confirm("장바구니에 담겼습니다!\n장바구니로 이동하시겠습니까?")) navigate('/cart');
        }
    };

    // ★★★ [수정됨] 구매하기 핸들러 (UserContext 이용, 프론트에서 선 차감) ★★★
    const handleModalBuy = async () => {
        if (!selectedArtwork) return;

        // 1. 로그인 체크
        if (!user) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }

        // 2. 구매 확인 (현재 잔액 표시)
        if (!window.confirm(
            `'${selectedArtwork.title}' 작품을 구매하시겠습니까?\n` +
            `가격: ${selectedArtwork.price} 차감\n` +
            `현재 잔액: ${user.coins.toLocaleString()}C`
        )) return;

        // 3. 코인 차감 시도 (프론트엔드 선 차감)
        const priceNumber = parseInt(String(selectedArtwork.priceValue).replace(/,/g, ''), 10); // 숫자 변환
        const isSuccess = deductCoins(priceNumber); // ★ 코인 차감 실행!

        if (!isSuccess) return; // 잔액 부족 시 중단

        try {
            // 4. 서버 요청 (기존 코드 유지)
            const response = await fetch('http://localhost:5000/api/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId: user.username, 
                    artworkId: selectedArtwork.id, 
                    price: priceNumber
                })
            });
            const data = await response.json();

            if (data.success) {
                // 장바구니에 있다면 제거
                if (isInCart(selectedArtwork.id)) removeFromCart(selectedArtwork.id);
                
                // 만약 App.js에서 갱신 함수를 받았다면 실행
                if (refreshInventory) await refreshInventory();

                // 여기서 navigate('/archive') 등 수행
                if (window.confirm(`구매가 완료되었습니다! 🎉\n\n[확인] -> 작품 보관함으로 이동\n[취소] -> 계속 둘러보기`)) {
                    navigate('/archive');
                } else {
                    setSelectedArtwork(null);
                }
            } else {
                alert(`구매 실패: ${data.message}`);
                // 실패 시 코인 롤백 로직이 필요할 수 있으나, 일단 간단히 처리
            }
        } catch (error) {
            console.error("구매 오류:", error);
        }
    };

    // 카테고리 섹션 렌더링
    const renderCategorySection = (title, categoryName, colorClass) => {
        const categoryItems = artworks.filter(item => item.category === categoryName).slice(0, 4);
        return (
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                    <div className={`w-2 h-8 ${colorClass}`}></div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categoryItems.map(item => (
                        <div key={item.id} className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500 transition-all cursor-pointer"
                             onClick={() => handleCardClick(item)}>
                            <div className="aspect-[3/4] w-full relative overflow-hidden">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition"></div>
                                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded text-white ${colorClass.replace('w-2 h-8', '')}`}>
                                    {item.category}
                                </span>
                            </div>
                            <div className="p-3">
                                <h4 className="text-white font-bold text-lg truncate">{item.title}</h4>
                                <p className="text-xs text-gray-400">{item.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans relative">
            <div className="fixed inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013')] bg-cover opacity-20 pointer-events-none"></div>

            <Header />

            <main className="relative z-10 max-w-7xl mx-auto px-4 py-10">
                {/* 1. 메인 배너 & 검색창 */}
                <section className="text-center py-16 mb-12">
                    <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                        당신의 영감을 찾아보세요
                    </h1>
                    <p className="text-gray-400 mb-8">최신 트렌드의 작품부터 숨겨진 보석같은 작품까지, 지금 바로 탐색을 시작하세요!</p>
                    
                    <div className="max-w-2xl mx-auto relative">
                        <input 
                            type="text" 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onFocus={() => setShowRecentDropdown(true)}
                            onBlur={() => setTimeout(() => setShowRecentDropdown(false), 200)}
                            onKeyPress={handleKeyPress} 
                            placeholder="작품명, 작가, 태그 검색..." 
                            className="w-full bg-white text-black py-4 px-6 rounded-full text-lg focus:outline-none shadow-[0_0_20px_rgba(255,100,0,0.3)]"
                        />
                        <button onClick={handleSearchClick} className="absolute right-2 top-2 bg-orange-600 text-white px-8 py-2.5 rounded-full font-bold hover:bg-orange-700 transition">
                            검색
                        </button>

                        {/* 최근 검색어 드롭다운 */}
                        {showRecentDropdown && recentSearches.length > 0 && (
                            <div className="absolute top-full left-6 right-6 mt-2 bg-white rounded-xl shadow-xl overflow-hidden text-left z-50 text-black">
                                <div className="px-4 py-2 text-xs text-gray-500 border-b">최근 검색어</div>
                                <ul>
                                    {recentSearches.map((k, i) => (
                                        <li key={i} onClick={() => handleRecentClick(k)} className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                                            {k}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-center gap-3 mt-6">
                        {['#3D', '#사이버펑크', '#모던UI', '#일러스트'].map(tag => (
                            <button key={tag} onClick={() => handleTagClick(tag)} className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300 border border-gray-700 cursor-pointer hover:border-orange-500">
                                {tag}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. 컨텐츠 영역 (로딩 or 검색결과 or 추천화면) */}
                {isSearching ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 text-lg">'{keyword}' 검색 중...</p>
                    </div>
                ) : searchQuery ? (
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">🔍 '{searchQuery}' 검색 결과</h2>
                            <button onClick={() => {setSearchQuery(""); setKeyword(""); setFilteredData(artworks);}} className="text-sm text-gray-500 underline">전체 보기</button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {filteredData.length > 0 ? filteredData.map(item => (
                                <div key={item.id} className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500 transition-all cursor-pointer"
                                     onClick={() => handleCardClick(item)}>
                                    <div className="aspect-[3/4] relative">
                                        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-3">
                                        <h4 className="text-white font-bold truncate">{item.title}</h4>
                                        <p className="text-xs text-gray-400">{item.author}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-4 text-center py-20 text-gray-500">
                                    <p className="text-xl mb-2">검색 결과가 없습니다.</p>
                                    <p className="text-sm">철자를 확인하거나 다른 키워드로 검색해보세요.</p>
                                </div>
                            )}
                        </div>
                    </section>
                ) : (
                    <>
                        <section className="mb-16">
                            <div className="flex items-end gap-3 mb-6">
                                <h2 className="text-3xl font-bold">🏆 금주의 추천 작품</h2>
                                <span className="text-gray-500 text-sm mb-1">AI 아트 큐레이터가 엄선한 작품들입니다.</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {weeklyBest.map((item) => (
                                    <div key={item.id} className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-2xl"
                                         onClick={() => handleCardClick(item)}>
                                        <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                            <span className="bg-orange-600 w-fit text-white text-[10px] font-bold px-2 py-1 rounded mb-2">Editor's Pick</span>
                                            <h3 className="text-2xl font-bold">{item.title}</h3>
                                            <p className="text-gray-300 text-sm">{item.author}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="border-t border-gray-800 pt-12">
                            <h2 className="text-center text-2xl font-bold mb-2">테마별 컬렉션</h2>
                            <p className="text-center text-gray-500 text-sm mb-12">AI 아트 큐레이터가 필요한 상황에 맞춰 작품을 엄선했어요. </p>

                            {renderCategorySection("🎨 이미지 생성", "이미지 생성", "bg-green-600")}
                            {renderCategorySection("📱 어플 디자인", "어플 디자인", "bg-yellow-600")}
                            {renderCategorySection("📢 마케팅 배너", "마케팅 배너", "bg-pink-600")}
                            {renderCategorySection("🖌️ 일러스트", "일러스트", "bg-purple-600")}
                        </div>
                    </>
                )}
            </main>
            
            {selectedArtwork && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={handleCloseModal}>
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-4xl w-full relative flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
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

            <footer className="py-10 border-t border-gray-800 bg-black text-center text-gray-600 text-xs">
                &copy; 2025 creAItive. All rights reserved.
            </footer>
        </div>
    );
};

export default Explore;