import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext'; 

// 임시 아바타 (디자인 유지용)
const AVATARS = [
    "https://i.pravatar.cc/150?img=1", "https://i.pravatar.cc/150?img=2", 
    "https://i.pravatar.cc/150?img=3", "https://i.pravatar.cc/150?img=4"
];

const Marketplace = () => {
    const { addToCart, removeFromCart, isInCart } = useCart();
    const navigate = useNavigate();

    // 초기 상태를 빈 배열로 설정 (하얀 화면 방지)
    const [artworks, setArtworks] = useState([]);
    const [filteredArtworks, setFilteredArtworks] = useState([]);
    
    // 필터 상태 (기존 코드 유지)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortCriteria, setSortCriteria] = useState('recent');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);

    const itemsPerPage = 20; 
    const [currentPage, setCurrentPage] = useState(1);

    const categories = ['All', '이미지 생성', '어플 디자인', '마케팅 배너', '일러스트'];

    // 1. 서버 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/artworks');
                const dbData = await response.json();

                // DB 데이터를 화면에 맞게 변환
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
                    img: item.image_url,
                    aiModel: "AI Generated",
                    badge: index < 5 ? "NEW" : null
                }));

                setArtworks(formattedData);
                setFilteredArtworks(formattedData);
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
        };
        fetchData();
    }, []);

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

    // 상세 페이지 이동 핸들러 (하얀 화면 원인 해결)
    const goToDetail = (id) => {
        // App.js 라우터가 /marketplace/:id 로 설정되어 있어야 함
        navigate(`/marketplace/${id}`);
    };

    // 필터링 로직 (기존 유지)
    useEffect(() => {
        if(artworks.length === 0) return;
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
        if (currentPage > Math.ceil(result.length / itemsPerPage)) setCurrentPage(1);
    }, [searchTerm, selectedCategory, sortCriteria, minPrice, maxPrice, artworks, currentPage]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredArtworks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage) || 1;

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans relative pb-20">
            <div className="fixed inset-0 z-0 opacity-80 bg-cover bg-center pointer-events-none" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop')"}}>
            </div>
            <Header />
            
            <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* 상단 검색 (기존 유지) */}
                <section className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">작품 거래소</h1>
                    <p className="text-gray-400 text-sm mb-8">전 세계 크리에이터들의 AI 아트를 탐색하고 거래하세요.</p>
                    <div className="flex max-w-xl mx-auto bg-gray-900 rounded-full shadow-lg border border-gray-700 p-1 mb-6">
                        <input type="text" placeholder="작품명, 작가 검색..." className="flex-grow bg-transparent p-3 pl-6 text-white text-sm focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm">검색</button>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((cat) => (
                            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold border ${selectedCategory === cat ? 'bg-orange-600 border-orange-600 text-white' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>{cat}</button>
                        ))}
                    </div>
                </section>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* 사이드바 필터 (기존 유지) */}
                    <aside className="w-full lg:w-64 bg-black/60 p-6 rounded-xl border border-gray-800 backdrop-blur-sm sticky top-24">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-white font-bold">필터</h3><button onClick={() => {setMinPrice(0); setMaxPrice(10000);}} className="text-xs text-orange-500">초기화</button></div>
                        <div className="mb-6"><label className="text-xs text-gray-400 font-bold mb-2 block">가격 범위</label><input type="range" min="0" max="10000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"/><div className="text-right text-xs text-gray-500 mt-1">0C ~ {maxPrice}C</div></div>
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {currentItems.length > 0 ? (
                                currentItems.map(art => {
                                    const isAdded = isInCart(art.id);
                                    return (
                                        <div 
                                            key={art.id} 
                                            onClick={() => goToDetail(art.id)} // 클릭 시 상세페이지 이동
                                            className="group block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative cursor-pointer"
                                        >
                                            <div className="aspect-square w-full relative overflow-hidden bg-gray-800">
                                                <img src={art.img} alt={art.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <button onClick={(e) => handleHeartClick(e, art)} className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20 transition border border-white/10">
                                                    <span className={`text-lg ${isAdded ? "text-red-500" : "text-white"}`}>{isAdded ? "♥" : "♡"}</span>
                                                </button>
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
                    </div>
                </div>
            </main>
            <Link to="/upload" className="fixed bottom-8 right-8 z-50 group"><div className="bg-orange-600 text-white p-4 rounded-full shadow-2xl hover:bg-orange-500 transition-all hover:scale-110"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></div></Link>
            <footer className="py-8 border-t border-gray-800 mt-12 bg-black text-center text-sm text-gray-600">&copy; 2025 creAI-tive Art Marketplace. All rights reserved.</footer>
        </div>
    );
};

export default Marketplace;