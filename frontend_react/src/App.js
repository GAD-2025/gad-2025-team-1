import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; // [추가] 저장소 불러오기
import './App.css';

// 페이지들
import Explore from './pages/Explore';
import MySpace from './pages/MySpace';
import Archive from './pages/Archive';
import ArchiveDetail from './pages/ArchiveDetail';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';
import MarketplaceDetail from './pages/MarketplaceDetail';
import Cart from './pages/Cart';
import MySpaceFolder from './pages/MySpaceFolder';
import MySpaceNode from './pages/MySpaceNode';
import MySpaceSetting from './pages/MySpaceSetting';
import Setting from './pages/Setting';
import SignUp from './pages/SignUp';
import Upload from './pages/Upload'; 

function App() {
  return (
    // [중요] CartProvider로 감싸야 모든 페이지에서 장바구니를 공유합니다.
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/explore" element={<Explore />} />
            
            <Route path="/myspace" element={<MySpace />} />
            <Route path="/myspace/setting" element={<MySpaceSetting />} />
            <Route path="/myspace/folder/:id" element={<MySpaceFolder />} />
            <Route path="/myspace/node" element={<MySpaceNode />} />

            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/detail/:id" element={<MarketplaceDetail />} />
            
            <Route path="/cart" element={<Cart />} />

            <Route path="/archive" element={<Archive />} />
            <Route path="/archive/detail" element={<ArchiveDetail />} />

            <Route path="/upload" element={<Upload />} />

            <Route path="/setting" element={<Setting />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;