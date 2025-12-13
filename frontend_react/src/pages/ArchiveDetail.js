import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ArchiveDetail = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchDetail = async () => {
            try {
                // 전체 목록에서 해당 ID 작품 찾기 (서버 연동)
                const response = await fetch('http://localhost:5000/api/artworks');
                const dbData = await response.json();
                const targetId = parseInt(id);
                const foundItem = dbData.find(item => item.id === targetId);

                if (foundItem) {
                    setArtwork({
                        ...foundItem,
                        img: foundItem.image_url,
                        priceDisplay: `${foundItem.price.toLocaleString()} C`,
                        tags: foundItem.tags ? foundItem.tags.split(',') : ["AI", "Art"]
                    });
                } else {
                    alert("작품을 찾을 수 없습니다.");
                    navigate('/archive');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, navigate]);

    if (loading) return <div className="min-h-screen bg-black text-white p-20 text-center">로딩 중...</div>;
    if (!artwork) return null;

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans relative pb-20">
            <div className="fixed inset-0 z-0 opacity-80 bg-cover bg-center pointer-events-none" style={{backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013')"}}></div>
            <Header />

            <main className="relative z-10 max-w-6xl mx-auto px-4 py-12">
                <button onClick={() => navigate(-1)} className="text-white mb-4 hover:underline">← 뒤로가기</button>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* 이미지 */}
                    <div className="bg-white p-3 rounded-3xl shadow-2xl">
                        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center">
                            <img src={artwork.img} alt={artwork.title} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* 정보 */}
                    <div className="space-y-6 text-white">
                        <div>
                            <span className="text-orange-500 font-bold">{artwork.category}</span>
                            <h1 className="text-4xl font-bold mt-2">{artwork.title}</h1>
                            <p className="text-gray-400 mt-2">By {artwork.artist_name}</p>
                        </div>

                        <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-700">
                            <h3 className="text-lg font-bold mb-4">📜 작품 정보</h3>
                            <p className="text-gray-300 leading-relaxed">
                                {artwork.description || "상세 설명이 없습니다."}
                            </p>
                            <div className="mt-4 flex gap-2">
                                {artwork.tags.map((tag, i) => (
                                    <span key={i} className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-400">#{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* 구매 버튼 대신 관리 버튼 표시 (보관함이니까) */}
                        <div className="flex gap-4">
                            <button className="flex-1 py-4 bg-orange-600 rounded-xl font-bold text-white hover:bg-orange-700 transition shadow-lg">
                                이미지 다운로드
                            </button>
                            <button className="flex-1 py-4 bg-gray-800 rounded-xl font-bold text-white hover:bg-gray-700 transition border border-gray-600">
                                라이선스 확인
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ArchiveDetail;