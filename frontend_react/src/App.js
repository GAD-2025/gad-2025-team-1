import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; 
import { UserProvider } from './context/UserContext'; 
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
  // [추가] 유저 상태 및 인벤토리 갱신용 상태 관리
  const [user, setUser] = useState(null);
  
  // 앱 실행 시 세션스토리지에서 로그인 정보 가져오기
  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // [핵심] 인벤토리(보관함) 새로고침 함수
  // 이 함수가 실행되면 서버에서 최신 데이터를 가져옵니다.
  const fetchInventory = async () => {
    if (!user) return;
    try {
      console.log(`🔄 App.js: ${user.username}님의 보관함 갱신 요청...`);
      // 실제 데이터는 MySpace 등에서 로드하겠지만, 
      // 이 함수를 호출함으로써 관련 상태를 업데이트하거나 로그를 남길 수 있습니다.
      // 만약 App.js에서 전역으로 인벤토리를 관리한다면 여기서 setState를 합니다.
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/inventory/${user.username}`);
      const data = await response.json();
      if (data.success) {
        console.log("✅ 보관함 갱신 완료");
      }
    } catch (error) {
      console.error("❌ 보관함 갱신 실패", error);
    }
  };

  return (
    <UserProvider>
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
            
            {/* [중요 수정] MarketplaceDetail에 user와 refreshInventory 전달 */}
            <Route 
              path="/marketplace/:id" 
              element={
                <MarketplaceDetail 
                  user={user} 
                  refreshInventory={fetchInventory} 
                />
              } 
            />
            
            <Route path="/cart" element={<Cart />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/archive/detail/:id" element={<ArchiveDetail />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;