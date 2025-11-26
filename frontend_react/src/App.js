import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// 페이지 불러오기
import Explore from './pages/Explore';
import Marketplace from './pages/Marketplace';
import MarketplaceDetail from './pages/MarketplaceDetail';

// 아직 안 만든 페이지들은 주석 처리하거나, 파일이 있다면 import 유지하세요
// import MySpace from './pages/MySpace';
// import Archive from './pages/Archive';
// import Setting from './pages/Setting';
// import Login from './pages/Login';
// import Upload from './pages/Upload'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 1. 탐색 페이지 (메인) */}
          <Route path="/" element={<Explore />} />
          <Route path="/explore" element={<Explore />} />
          
          {/* 2. 거래하기 페이지 */}
          <Route path="/marketplace" element={<Marketplace />} />
          
          {/* [중요] 상세 페이지: 뒤에 /:id 를 꼭 붙여야 합니다! */}
          <Route path="/marketplace/detail/:id" element={<MarketplaceDetail />} />

          {/* 나머지 페이지 경로 (파일 생성 전까지 주석 처리 추천) */}
          {/* <Route path="/myspace" element={<MySpace />} /> */}
          {/* <Route path="/archive" element={<Archive />} /> */}
          {/* <Route path="/setting" element={<Setting />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/upload" element={<Upload />} /> */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;