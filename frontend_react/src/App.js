import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// 1. 페이지 컴포넌트 불러오기
import Explore from './pages/Explore';
import MySpace from './pages/MySpace';
import Archive from './pages/Archive';
import ArchiveDetail from './pages/ArchiveDetail';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';
import MarketplaceDetail from './pages/MarketplaceDetail';
import MySpaceFolder from './pages/MySpaceFolder';
import MySpaceNode from './pages/MySpaceNode';
import MySpaceSetting from './pages/MySpaceSetting';
import Setting from './pages/Setting';
import SignUp from './pages/SignUp';
import Upload from './pages/Upload'; // [추가] 업로드 페이지 import

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 2. 주소(path)와 파일(element) 연결 */}
          
          {/* 메인 화면 */}
          <Route path="/" element={<Explore />} />
          <Route path="/explore" element={<Explore />} />
          
          {/* 마이스페이스 관련 */}
          <Route path="/myspace" element={<MySpace />} />
          <Route path="/myspace/setting" element={<MySpaceSetting />} />
          <Route path="/myspace/folder/:id" element={<MySpaceFolder />} />
          <Route path="/myspace/node" element={<MySpaceNode />} />

          {/* 마켓플레이스 관련 */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/detail" element={<MarketplaceDetail />} />

          {/* 아카이브 관련 */}
          <Route path="/archive" element={<Archive />} />
          <Route path="/archive/detail" element={<ArchiveDetail />} />

          {/* [추가] 업로드 페이지 */}
          <Route path="/upload" element={<Upload />} />

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