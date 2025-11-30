import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// 1. 만들어둔 페이지들을 전부 불러옵니다 (Import)
// (주의: 파일들이 pages 폴더 안에 있다고 가정했습니다. 만약 같은 폴더에 있다면 ./pages/를 지우고 ./만 남기세요)
import Explore from './pages/Explore';
import MySpace from './pages/MySpace';
import Archive from './pages/Archive';
import ArchiveDetail from './pages/ArchiveDetail';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';
import MarketplaceDetail from './pages/MarketplaceDetail';
import MySpaceFolder from './pages/MySpaceFolder'; // 필요하다면 추가
import MySpaceNode from './pages/MySpaceNode';     // 필요하다면 추가
import MySpaceSetting from './pages/MySpaceSetting';
import Setting from './pages/Setting';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 2. 주소(path)와 파일(element)을 연결해줍니다 (Route) */}
          
          {/* 메인 화면 */}
          <Route path="/" element={<Explore />} />
          <Route path="/explore" element={<Explore />} />
          
          {/* 마이스페이스 관련 */}
          <Route path="/myspace" element={<MySpace />} />
          <Route path="/myspace/setting" element={<MySpaceSetting />} />
          
          {/* 마켓플레이스 관련 */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/detail" element={<MarketplaceDetail />} />

          {/* 아카이브 관련 */}
          <Route path="/archive" element={<Archive />} />
          <Route path="/archive/detail" element={<ArchiveDetail />} />

          {/* 설정 및 로그인 */}
          <Route path="/setting" element={<Setting />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;