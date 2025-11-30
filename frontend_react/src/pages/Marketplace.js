import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import './Marketplace.css';

const Marketplace = () => {
    const [artworks, setArtworks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('recent');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // This is a mock function. In a real application, you would fetch this data from an API.
    const fetchArtworks = () => {
        const allArtworks = [
            // This data should be moved to a separate file or fetched from an API
            { id: 1, title: "카멜롯의 일러스트", author: "김민지", price: 1500, img: "https://placehold.co/600x600/E56A54/FFFFFF?text=Art1", date: "2025-11-28" },
            { id: 2, title: "우주 고양이", author: "이서아", price: 2500, img: "https://placehold.co/600x600/4A4A4A/FFFFFF?text=Art2", date: "2025-11-27" },
            { id: 3, title: "밤의 산책", author: "박준형", price: 1800, img: "https://placehold.co/600x600/7C73C0/FFFFFF?text=Art3", date: "2025-11-26" },
            { id: 4, title: "도시의 불빛", author: "최유리", price: 3200, img: "https://placehold.co/600x600/3AB4F2/FFFFFF?text=Art4", date: "2025-11-25" },
        ];
        
        // Filtering
        let filtered = allArtworks.filter(art => 
            art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            art.author.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sorting
        filtered.sort((a, b) => {
            switch (sortCriteria) {
                case 'popular': return b.price - a.price; // Assuming popularity is related to price for now
                case 'price_asc': return a.price - b.price;
                case 'price_desc': return b.price - a.price;
                case 'recent':
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });

        // Pagination (implement if needed, for now showing all results)
        setArtworks(filtered);
        setTotalPages(1); // Simplified for now
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchArtworks();
    }, [searchTerm, sortCriteria]);

    return (
        <div className="marketplace-page antialiased">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <section className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">작품 거래소</h1>
                    <div className="flex max-w-xl mx-auto p-1 bg-gray-800 rounded-full shadow-lg">
                        <input 
                            type="text" 
                            placeholder="작품명, 작가, 태그 검색..." 
                            className="flex-grow bg-transparent p-2 text-white text-sm focus:outline-none rounded-l-full"
                            onKeyDown={(e) => e.key === 'Enter' && setSearchTerm(e.target.value)}
                        />
                        <button 
                            className="bg-orange-600 text-white px-6 py-2 text-sm font-semibold rounded-full hover:bg-orange-700 transition"
                            onClick={() => setSearchTerm(document.querySelector('input').value)}
                        >
                            검색
                        </button>
                    </div>
                    {searchTerm && <p className="text-gray-400 mt-4 text-sm h-5">'{searchTerm}'에 대한 검색 결과</p>}
                </section>

                <section className="mb-6 flex justify-between items-center flex-wrap gap-4">
                    <div className="flex space-x-3 items-center">
                        <span className="text-sm text-gray-400">정렬:</span>
                        <select 
                            className="bg-gray-700 text-white text-sm p-2 rounded-lg border border-gray-600"
                            value={sortCriteria}
                            onChange={(e) => setSortCriteria(e.target.value)}
                        >
                            <option value="recent">최신순</option>
                            <option value="popular">인기순</option>
                            <option value="price_asc">낮은 가격순</option>
                            <option value="price_desc">높은 가격순</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>{currentPage} / {totalPages} 페이지</span>
                        <button className="bg-gray-700 w-8 h-8 rounded-full hover:bg-gray-600 disabled:opacity-50" disabled>&lt;</button>
                        <button className="bg-gray-700 w-8 h-8 rounded-full hover:bg-gray-600 disabled:opacity-50">&gt;</button>
                    </div>
                </section>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {artworks.map(art => (
                        <Link to={`/marketplace/detail/${art.id}`} key={art.id} className="artwork-card group">
                            <div className="relative aspect-square">
                                <img src={art.img} alt={art.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-bold">자세히 보기</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-white font-semibold text-base truncate">{art.title}</h3>
                                <p className="text-gray-400 text-sm">by {art.author}</p>
                                <p className="text-orange-500 font-bold mt-2 text-lg">{art.price} 코인</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <footer className="main-footer">
                <div className="text-center text-sm text-gray-500">
                    &copy; 2025 creAI-tive Art Marketplace Prototype. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Marketplace;
