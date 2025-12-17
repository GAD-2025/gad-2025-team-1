import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext'; 
import { useUser } from '../context/UserContext'; 

const MarketplaceDetail = ({ user: propUser, refreshInventory }) => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { addToCart, isInCart, removeFromCart } = useCart();
    
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [localUser, setLocalUser] = useState(null);
    const currentUser = propUser || localUser;
    const { user, deductCoins } = useUser();

    useEffect(() => {
        if (!propUser) {
            try {
                const s = sessionStorage.getItem('currentUser');
                if (s) setLocalUser(JSON.parse(s));
            } catch (err) {
                console.error('Failed to parse currentUser', err);
            }
        }
    }, [propUser]);

    // ★ [Helper] 이미지 경로 처리 함수 (상세페이지용)
    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/300?text=No+Image';
        if (url.startsWith('/uploads/')) {
            return `${process.env.REACT_APP_API_BASE_URL}${url}`;
        }
        return url;
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchDetail = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/artworks');
                
                if (!response.ok) {
                    throw new Error('서버 연결 실패');
                }

                const dbData = await response.json();
                const targetId = parseInt(id);
                const foundItem = dbData.find(item => item.id === targetId);

                if (foundItem) {
                    setArtwork({
                        id: foundItem.id,
                        title: foundItem.title,
                        author: foundItem.artist_name,
                        price: foundItem.price, 
                        priceDisplay: `${foundItem.price.toLocaleString()} C`,
                        category: foundItem.category,
                        // ★ 이미지 URL 변환 적용
                        img: getImageUrl(foundItem.image_url),
                        description: foundItem.description || "이 작품은 AI 알고리즘과 작가의 리터칭이 결합된 고퀄리티 아트워크입니다.",
                        tags: foundItem.tags ? foundItem.tags.split(',') : ["#AI", "#Digital"],
                        creationRate: 60 + (foundItem.id % 40),
                        buyersCount: 10 + (foundItem.id * 5),
                    });
                } else {
                    alert("해당 작품을 찾을 수 없습니다.");
                    navigate('/marketplace');
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
                alert("서버 연결에 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id, navigate]);

    const handlePurchase = async () => {
        if (!currentUser) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }

        if (!artwork) {
            alert("작품 정보를 불러오는 중입니다.");
            return;
        }

        const safePrice = artwork.price ? artwork.price : 0;

        const isConfirmed = window.confirm(
            `'${artwork.title}' 작품을 구매하시겠습니까?\n가격: ${safePrice.toLocaleString()} Point`
        );

        if (!isConfirmed) return;

        const priceNumber = parseInt(String(safePrice).replace(/,/g, ''), 10) || 0;
        const buyer = user || currentUser;

        if (!buyer) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }

        if (deductCoins) {
            const ok = deductCoins(priceNumber);
            if (!ok) return;
        }

        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: buyer.username, 
                    artworkId: artwork.id, 
                    price: priceNumber
                }),
            });

            const result = await response.json();

            if (result.success) {
                if (window.confirm("구매가 완료되었습니다!\n[작품 보관함]으로 이동해서 확인하시겠습니까?")) {
                    if (refreshInventory) await refreshInventory();
                    navigate('/archive'); 
                } else {
                    if (refreshInventory) await refreshInventory();
                }
            } else {
                alert(result.message); 
            }
        } catch (error) {
            console.error("구매 요청 실패:", error);
            alert("서버 연결에 실패했습니다.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <p className="text-xl font-bold">데이터를 불러오는 중입니다...</p>
            </div>
        );
    }

    if (!artwork) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <p className="text-xl font-bold text-red-500 mb-4">작품 정보를 찾을 수 없습니다.</p>
                <button 
                    onClick={() => navigate('/marketplace')}
                    className="px-6 py-2 bg-orange-600 rounded-full font-bold hover:bg-orange-700"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans relative pb-20">
            <div className="fixed inset-0 z-0 opacity-80 bg-cover bg-center pointer-events-none" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop')"}}>
            </div>

            <Header />

            <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* [LEFT] 이미지 및 상세 정보 */}
                    <div className="space-y-6">
                        <div className="bg-white p-3 rounded-3xl shadow-2xl">
                            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center relative">
                                {/* 이미지 경로 함수 적용 */}
                                <img src={artwork.img} alt={artwork.title} className="w-full h-full object-cover" 
                                     onError={(e)=>{e.target.src='https://via.placeholder.com/600?text=No+Image'}} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-[#FFDCC2] rounded-2xl p-4 text-center flex flex-col justify-center items-center text-gray-900 h-24">
                                <span className="text-xs font-bold mb-1 opacity-70">카테고리</span>
                                <span className="font-extrabold text-base break-keep">{artwork.category}</span>
                            </div>
                            
                            <div className="bg-[#FFDCC2] rounded-2xl p-4 flex flex-col justify-center text-gray-900 h-24 relative overflow-hidden">
                                <div className="flex justify-between items-end mb-2 z-10 relative">
                                    <span className="text-xs font-bold opacity-70">자체제작률</span>
                                    <span className="font-extrabold text-xl">{artwork.creationRate}%</span>
                                </div>
                                <div className="w-full h-2 bg-white rounded-full overflow-hidden z-10 relative">
                                    <div className="h-full bg-orange-500" style={{width: `${artwork.creationRate}%`}}></div>
                                </div>
                                <div className="flex justify-between text-[9px] mt-1 opacity-60 z-10 relative font-bold">
                                    <span>자체제작</span>
                                    <span>AI</span>
                                </div>
                            </div>

                            <div className="bg-[#FFDCC2] rounded-2xl p-4 flex flex-col justify-center items-center text-gray-900 h-24">
                                <span className="text-xs font-bold mb-2 opacity-70">사용 AI툴</span>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-xs font-bold">Mj</div>
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-xs font-bold">SD</div>
                                </div>
                            </div>
                        </div>

                        {/* 구매하기 버튼 */}
                        <div 
                            onClick={handlePurchase} 
                            className="bg-orange-500 rounded-2xl p-1 flex items-center justify-between shadow-lg hover:bg-orange-600 transition cursor-pointer group"
                        >
                            <div className="px-8 py-4 text-white font-extrabold text-xl">구매하기</div>
                            <div className="flex-grow text-right px-8 py-4 bg-black/10 rounded-r-xl group-hover:bg-black/20 transition">
                                <span className="text-white font-bold text-2xl">{artwork.priceDisplay}</span>
                            </div>
                        </div>
                    </div>

                    {/* [RIGHT] 프롬프트 및 부가 정보 */}
                    <div className="space-y-6">
                        <div className="bg-[#FFF5E6] rounded-3xl p-8 text-gray-800 shadow-xl relative overflow-hidden h-[300px] flex flex-col">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="text-orange-500">✨</span> 프롬프트
                            </h3>
                            
                            <div className="relative flex-grow">
                                <p className="filter blur-[6px] select-none opacity-50 leading-relaxed text-sm h-full overflow-hidden">
                                    Create a high-quality, photorealistic image of {artwork.title}. 
                                    Cinematic lighting, 8k resolution, detailed texture, trending on ArtStation.
                                    Use vivid colors and dynamic composition. (Hidden Prompt Content...)
                                </p>
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                    <span className="bg-black/60 text-white px-4 py-2 rounded-full text-xs backdrop-blur-md mb-4 font-bold shadow-lg">
                                        🔒 구매 후 공개됩니다
                                    </span>
                                </div>
                            </div>

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
                                        {tag.startsWith('#') ? tag : `#${tag}`}
                                    </span>
                                ))}
                            </div>
                        </div>

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