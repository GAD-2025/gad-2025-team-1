import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './MySpaceFolder.css';

const MySpaceFolder = () => {
    const [modalImage, setModalImage] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    
    // MySpace에서 넘겨준 폴더 데이터 받기
    const folderData = location.state?.folderData;
    const [works, setWorks] = useState([]);

    useEffect(() => {
        if (folderData && folderData.works) {
            setWorks(folderData.works);
        } else {
            // 데이터가 없으면 로컬스토리지에서 다시 찾기 (새로고침 대응)
            const savedData = localStorage.getItem('myspaceData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                // URL 끝자리 id로 폴더 찾기
                const folderId = parseInt(window.location.pathname.split('/').pop());
                const foundFolder = parsed.folders.find(f => f.id === folderId);
                if (foundFolder) {
                    setWorks(foundFolder.works);
                    return;
                }
            }
        }
    }, [folderData]);

    const openModal = (image) => setModalImage(image);
    const closeModal = () => setModalImage(null);

    if (!folderData && works.length === 0) {
        return <div style={{color:'white', padding:'50px'}}>폴더 정보를 불러오는 중...</div>;
    }

    // 폴더 이름 (데이터 없으면 기본값)
    const folderName = folderData ? folderData.name : "폴더";

    return (
        <div className="myspace-folder-page">
            <Header />
            <main className="archive-container">
                <div className="path-display">
                    <Link to="/myspace" className="path-before">My Space</Link>
                    <span className="path-separator">&gt;</span>
                    <span className="path-item active-folder">{folderName}</span>
                </div>

                <section className="artwork-grid">
                    {works.length > 0 ? (
                        works.map((imgSrc, index) => (
                            <div key={index} className="grid-item" onClick={() => openModal(imgSrc)}>
                                <img src={`${process.env.PUBLIC_URL}${imgSrc}`} alt={`작품 ${index + 1}`} />
                            </div>
                        ))
                    ) : (
                        <div style={{color: '#aaa', padding: '20px'}}>이 폴더는 비어있습니다.</div>
                    )}
                </section>
            </main>

            {modalImage && (
                <div id="imageModal" className="modal" style={{ display: 'flex' }} onClick={closeModal}>
                    <div className="modal-content">
                        <img id="modalImage" src={`${process.env.PUBLIC_URL}${modalImage}`} alt="확대된 작품" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MySpaceFolder;