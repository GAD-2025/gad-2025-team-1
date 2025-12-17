import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext'; 

const Cart = () => {
    const { cartItems, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 총 결제 금액 계산
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.priceValue || 0), 0);

    // ★ [핵심] 일괄 구매 핸들러
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("장바구니가 비어있습니다.");
            return;
        }

        const userId = localStorage.getItem('userId') || 'admin';

        // 1. 구매 의사 확인
        if (!window.confirm(`총 ${cartItems.length}개의 작품을 구매하시겠습니까?\n(총 결제액: ${totalPrice.toLocaleString()}C)`)) {
            return;
        }

        setLoading(true);
        let successCount = 0;
        let failCount = 0;

        // 2. 장바구니에 있는 모든 아이템을 하나씩 구매 요청
        // (서버가 다중 구매를 지원하지 않으므로 반복문 사용)
        for (const item of [...cartItems]) { // 배열 복사해서 순회
            try {
                const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/purchase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userId,
                        artworkId: item.id,
                        price: item.priceValue
                    })
                });

                const data = await response.json();

                if (data.success) {
                    successCount++;
                    removeFromCart(item.id); // 성공한 아이템은 장바구니에서 즉시 제거
                } else {
                    failCount++;
                    console.error(`구매 실패 (${item.title}): ${data.message}`);
                }
            } catch (error) {
                failCount++;
                console.error(`통신 오류 (${item.title})`);
            }
        }

        setLoading(false);

        // 3. 결과 처리
        if (successCount > 0) {
            let msg = `총 ${successCount}개의 작품 구매가 완료되었습니다! 🎉`;
            if (failCount > 0) msg += `\n(${failCount}개는 실패하여 장바구니에 남았습니다)`;
            
            if (window.confirm(`${msg}\n\n[확인] -> 작품 보관함으로 이동`)) {
                navigate('/archive');
            }
        } else {
            alert("구매에 실패했습니다. 코인이 부족하거나 이미 소유한 작품일 수 있습니다.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans relative pb-20">
            {/* 배경 효과 */}
            <div className="fixed inset-0 z-0 opacity-80 bg-cover bg-center pointer-events-none" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop')"}}>
            </div>

            <Header />

            <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    🛒 장바구니 <span className="text-orange-500 text-xl">({cartItems.length})</span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* [LEFT] 장바구니 리스트 */}
                    <div className="flex-grow">
                        {cartItems.length > 0 ? (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-center gap-6 hover:border-gray-600 transition group">
                                        {/* 이미지 */}
                                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800 cursor-pointer" onClick={() => navigate(`/marketplace/${item.id}`)}>
                                            <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>

                                        {/* 정보 */}
                                        <div className="flex-grow">
                                            <span className="text-xs font-bold text-orange-500 mb-1 block">{item.category}</span>
                                            <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-400">{item.author}</p>
                                        </div>

                                        {/* 가격 및 삭제 */}
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-white mb-2">
                                                {item.priceValue.toLocaleString()} C
                                            </div>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-xs text-gray-500 hover:text-red-500 underline transition"
                                            >
                                                삭제하기
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-gray-900/50 rounded-2xl border border-dashed border-gray-800">
                                <p className="text-xl text-gray-400 mb-4">장바구니가 비어있습니다.</p>
                                <Link to="/explore" className="px-6 py-3 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition">
                                    작품 구경하러 가기
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* [RIGHT] 결제 요약창 (Sticky) */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white text-gray-900 p-8 rounded-3xl shadow-2xl sticky top-24">
                            <h2 className="text-2xl font-extrabold mb-6">결제 금액</h2>
                            
                            <div className="space-y-3 mb-8 border-b border-gray-200 pb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>총 상품 금액</span>
                                    <span>{totalPrice.toLocaleString()} C</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>할인 금액</span>
                                    <span>0 C</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-lg font-bold">최종 결제 금액</span>
                                <span className="text-3xl font-extrabold text-orange-600">{totalPrice.toLocaleString()} C</span>
                            </div>

                            <button 
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0 || loading}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition ${
                                    cartItems.length === 0 || loading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-orange-600 hover:shadow-orange-500/30'
                                }`}
                            >
                                {loading ? '처리 중...' : '구매하기'}
                            </button>

                            <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
                                구매 즉시 소유권이 이전되며,<br/>작품 보관함에서 원본을 다운로드할 수 있습니다.
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Cart;