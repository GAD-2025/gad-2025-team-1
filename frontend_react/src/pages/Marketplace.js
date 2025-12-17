import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext'; 

const AVATARS = [
    "https://i.pravatar.cc/150?img=1", "https://i.pravatar.cc/150?img=2", 
    "https://i.pravatar.cc/150?img=3", "https://i.pravatar.cc/150?img=4"
];

const Marketplace = () => {
    const { addToCart, removeFromCart, isInCart } = useCart();
    const navigate = useNavigate();

    // 데이터 상태
    const [artworks, setArtworks] = useState([]); // 전체 데이터
    const [filteredArtworks, setFilteredArtworks] = useState([]); // 필터링 결과
    
    // 검색 상태
    const [keyword, setKeyword] = useState(""); 
    const [searchQuery, setSearchQuery] = useState(""); 
    const [isSearching, setIsSearching] = useState(false); 

    // 필터 상태
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortCriteria, setSortCriteria] = useState('recent');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000); // 가격 범위 넉넉하게 수정

    // 페이지네이션
    const itemsPerPage = 20; 
    const [currentPage, setCurrentPage] = useState(1);

    const categories = ['All', '이미지 생성', '어플 디자인', '마케팅 배너', '일러스트', '3D', '사진', '아이콘', '템플릿']; // 카테고리 추가

    // ★ [Helper 1] 이미지 경로 처리 함수
    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/300?text=No+Image';
        if (url.startsWith('/uploads/')) {
            return `http://localhost:5000${url}`;
        }
        return url;
    };

    // ★ [Helper 2] NEW 배지 판별 함수 (3일 이내)
    const isNewItem = (dateString) => {
        if (!dateString) return false;
        const createdDate = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays <= 3; 
    };

    // 1. 서버 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 백엔드는 이미 최신순(ORDER BY id DESC)으로 줍니다.
                const response = await fetch('http://localhost:5000/api/artworks');
                const dbData = await response.json();

                const formattedData = dbData.map((item, index) => ({
                    id: item.id,
                    title: item.title,
                    author: item.artist_name,
                    authorImg: AVATARS[index % 4], 
                    price: item.price,
                    priceDisplay: `${item.price.toLocaleString()} C`,
                    category: item.category,
                    views: item.views || 0,
                    likes: 0,
                    date: item.created_at,
                    // ★ 이미지 URL 변환 적용
                    img: getImageUrl(item.image_url),
                    aiModel: item.ai_tool || "AI Generated",
                    // ★ 날짜 기반 NEW 배지 적용
                    badge: isNewItem(item.created_at) ? "NEW" : null
                }));

                setArtworks(formattedData);
                setFilteredArtworks(formattedData);
            } catch (error) {
                console.error("데이터 로딩 에러:", error);
            }
        };
        fetchData();
    }, []);

    // 2. 검색 실행 함수
    const executeSearch = () => {
        setIsSearching(true);
        if (!keyword.trim()) {
            setSearchQuery("");
            setIsSearching(false);
            return;
        }
        setSearchQuery(keyword);
        setTimeout(() => setIsSearching(false), 500); 
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') executeSearch();
    };

    // 3. 통합 필터링 로직
    useEffect(() => {
        if(artworks.length === 0) return;

        let result = [...artworks];

        // 검색어 필터
        if (searchQuery) {
            result = result.filter(art => 
                art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                art.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 카테고리 필터
        if (selectedCategory !== 'All') {
            result = result.filter(art => art.category === selectedCategory);
        }

        // 가격 필터
        result = result.filter(art => art.price >= minPrice && art.price <= maxPrice);

        // 정렬
        switch (sortCriteria) {
            case 'price_asc': result.sort((a, b) => a.price - b.price); break;
            case 'price_desc': result.sort((a, b) => b.price - a.price); break;
            case 'popular': result.sort((a, b) => b.views - a.views); break;
            case 'recent': 
            default: result.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
        }

        setFilteredArtworks(result);
        setCurrentPage(1); 
    }, [searchQuery, selectedCategory, sortCriteria, minPrice, maxPrice, artworks]);

    // 4. 페이지네이션 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredArtworks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage) || 1;

    // 찜하기 핸들러
    const handleHeartClick = (e, art) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInCart(art.id)) {
            removeFromCart(art.id);
        } else {
            addToCart(art);
            if (window.confirm("장바구니에 담겼습니다!\n장바구니로 이동하시겠습니까?")) {
                navigate('/cart');
            }
        }
    };

    const goToDetail = (id) => {
        navigate(`/marketplace/${id}`);
    };

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans relative pb-20">
            <div className="fixed inset-0 z-0 opacity-80 bg-cover bg-center pointer-events-none" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop')"}}>
            </div>
            <Header />
            
            <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <section className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">작품 거래소</h1>
                    <p className="text-gray-400 text-sm mb-8">전 세계 크리에이터들의 AI 아트를 탐색하고 거래하세요.</p>
                    
                    {/* 검색창 */}
                    <div className="flex max-w-xl mx-auto bg-gray-900 rounded-full shadow-lg border border-gray-700 p-1 mb-6">
                        <input 
                            type="text" 
                            placeholder="작품명, 작가 검색..." 
                            className="flex-grow bg-transparent p-3 pl-6 text-white text-sm focus:outline-none placeholder-gray-500"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button 
                            onClick={executeSearch}
                            className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-700 transition"
                        >
                            검색
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((cat) => (
                            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold border ${selectedCategory === cat ? 'bg-orange-600 border-orange-600 text-white' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>{cat}</button>
                        ))}
                    </div>
                </section>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* 사이드바 필터 */}
                    <aside className="w-full lg:w-64 bg-black/60 p-6 rounded-xl border border-gray-800 backdrop-blur-sm sticky top-24">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-white font-bold">필터</h3><button onClick={() => {setMinPrice(0); setMaxPrice(100000);}} className="text-xs text-orange-500">초기화</button></div>
                        <div className="mb-6"><label className="text-xs text-gray-400 font-bold mb-2 block">가격 범위</label><input type="range" min="0" max="100000" step="1000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"/><div className="text-right text-xs text-gray-500 mt-1">0C ~ {maxPrice.toLocaleString()}C</div></div>
                    </aside>

                    {/* 그리드 영역 */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm text-gray-400">검색 결과 <span className="text-white font-bold">{filteredArtworks.length}</span>건</span>
                            <select className="bg-transparent text-white text-sm border-none cursor-pointer text-right" value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
                                <option value="recent" className="bg-gray-900">✨ 최신순</option>
                                <option value="popular" className="bg-gray-900">🔥 인기순</option>
                                <option value="price_asc" className="bg-gray-900">💰 낮은 가격순</option>
                            </select>
                        </div>

                        {/* 로딩 표시 */}
                        {isSearching ? (
                            <div className="text-center py-20">
                                <div className="inline-block w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-400">검색 중...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {currentItems.length > 0 ? (
                                    currentItems.map(art => {
                                        const isAdded = isInCart(art.id);
                                        return (
                                            <div 
                                                key={art.id} 
                                                onClick={() => goToDetail(art.id)}
                                                className="group block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative cursor-pointer"
                                            >
                                                <div className="aspect-square w-full relative overflow-hidden bg-gray-800">
                                                    {/* 이미지 소스 처리 */}
                                                    <img src={art.img} alt={art.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" 
                                                         onError={(e)=>{e.target.src='https://via.placeholder.com/300?text=No+Image'}} />
                                                    
                                                    <button onClick={(e) => handleHeartClick(e, art)} className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20 transition border border-white/10">
                                                        <span className={`text-lg ${isAdded ? "text-red-500" : "text-white"}`}>{isAdded ? "♥" : "♡"}</span>
                                                    </button>
                                                    {/* NEW 배지 */}
                                                    {art.badge && <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">{art.badge}</span>}
                                                </div>
                                                <div className="p-3">
                                                    <h3 className="text-white font-bold text-sm truncate mb-1">{art.title}</h3>
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                        <img src={art.authorImg} alt="" className="w-4 h-4 rounded-full border border-gray-600" />
                                                        <span className="text-gray-400 text-xs truncate">{art.author}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center border-t border-gray-700 pt-2 mt-2">
                                                        <span className="text-orange-500 font-bold text-sm">{art.priceDisplay}</span>
                                                        <div className="flex items-center text-[10px] text-gray-500 gap-1"><span>♥ {art.likes + (isAdded ? 1 : 0)}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full py-20 text-center bg-gray-900/50 rounded-xl border border-dashed border-gray-800 text-gray-400">조건에 맞는 작품이 없습니다.</div>
                                )}
                            </div>
                        )}

                        {/* 페이지네이션 */}
                        {!isSearching && filteredArtworks.length > itemsPerPage && (
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
            <Link to="/upload" className="fixed bottom-8 right-8 z-50 group"><div className="bg-orange-600 text-white p-4 rounded-full shadow-2xl hover:bg-orange-500 transition-all hover:scale-110"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></div></Link>
            <footer className="py-8 border-t border-gray-800 mt-12 bg-black text-center text-sm text-gray-600">&copy; 2025 creAItive Art Marketplace. All rights reserved.</footer>
        </div>
    );
};

export default Marketplace;