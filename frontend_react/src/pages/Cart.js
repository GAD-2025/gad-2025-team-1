import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext'; // [1] 저장소 불러오기

const Cart = () => {
    const { cartItems, removeFromCart } = useCart(); // [2] 데이터와 삭제함수 사용

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans relative pb-20">
            <div className="fixed inset-0 z-0 opacity-80 bg-cover bg-center pointer-events-none" style={{backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop')"}}></div>
            <Header />

            <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-white mb-8 border-b border-gray-800 pb-4">
                    장바구니 <span className="text-orange-600 text-lg ml-2">{cartItems.length}</span>
                </h1>

                {cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex gap-4 items-center">
                                    <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-white font-bold">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.author}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-orange-500 font-bold mb-1">{item.price.toLocaleString()} C</p>
                                        <button onClick={() => removeFromCart(item.id)} className="text-xs text-gray-500 hover:text-white underline">삭제</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-full lg:w-80 h-fit bg-white rounded-2xl p-6 shadow-xl text-gray-900">
                            <h3 className="font-bold text-lg mb-4">결제 예상 금액</h3>
                            <div className="flex justify-between mb-2 text-sm"><span className="text-gray-600">총 상품금액</span><span>{totalPrice.toLocaleString()} C</span></div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6"><span className="font-bold">총 결제금액</span><span className="text-2xl font-extrabold text-orange-600">{totalPrice.toLocaleString()} C</span></div>
                            <button className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition" onClick={() => alert("구매 기능은 추후 구현됩니다!")}>구매하기</button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-dashed border-gray-800">
                        <p className="text-gray-500 mb-4">장바구니가 비어있습니다.</p>
                        <Link to="/marketplace" className="px-6 py-2 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition">작품 구경하러 가기</Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;