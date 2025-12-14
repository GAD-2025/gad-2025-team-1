import React, { useState, useEffect } from 'react';
// ★ 1. Link와 useNavigate를 불러옵니다.
import { Link, useNavigate } from 'react-router-dom'; 
import Header from '../components/Header';
import './MySpace.css';

const MySpace = () => {
    const navigate = useNavigate(); // ★ 페이지 이동을 위한 훅

    const [userData, setUserData] = useState({
        name: 'Guest', // 기본값
        bio: '로그인이 필요합니다.',
        img: '/images/White Cats.jpg'
    });

    const [folders, setFolders] = useState([
        { id: 1, name: 'WISH', img: '/images/folder_1.jpg', link: '/myspace/folder' },
        { id: 2, name: 'My Work', img: '/images/folder_2.jpg', link: '/my-work' },
        { id: 3, name: 'ART', img: '/images/folder_3.jpg', link: '/art-folder' }
    ]);

    // ★ 궤도 아이템 데이터 (나중에 DB에서 가져온 데이터로 대체될 수 있습니다)
    const [orbitArtworks, setOrbitArtworks] = useState([
        { id: 1, img: '/images/art_5.jpg', title: 'Work 1', orbit: 'outer', orientation: 'horizontal' },
        { id: 2, img: '/images/art_6.jpg', title: 'Work 2', orbit: 'outer', orientation: 'horizontal' },
        { id: 3, img: '/images/art_7.jpg', title: 'Work 3', orbit: 'outer', orientation: 'horizontal' },
        { id: 4, img: '/images/art_1.jpg', title: 'Work 4', orbit: 'outer', orientation: 'vertical' },
        { id: 5, img: '/images/art_2.jpg', title: 'Work 5', orbit: 'inner', orientation: 'vertical' },
        { id: 6, img: '/images/art_3.jpg', title: 'Work 6', orbit: 'inner', orientation: 'vertical' },
        { id: 7, img: '/images/art_4.jpg', title: 'Work 7', orbit: 'inner', orientation: 'vertical' }
    ]);

    const neighbors = [
        { id: 1, img: '/images/friend_1.jpg', alt: '이웃 프로필 1' },
        { id: 2, img: '/images/friend_2.jpg', alt: '이웃 프로필 2' },
        { id: 3, img: '/images/friend_3.jpg', alt: '이웃 프로필 3' },
        { id: 4, img: '/images/friend_4.jpg', alt: '이웃 프로필 4' }
    ];

    const socialLinks = [
        { id: 'insta', href: 'https://instagram.com', icon: 'fab fa-instagram', title: 'Instagram' },
        { id: 'facebook', href: 'https://facebook.com', icon: 'fab fa-facebook-f', title: 'Facebook' },
        { id: 'youtube', href: 'https://youtube.com', icon: 'fab fa-youtube', title: 'YouTube' },
        { id: 'email', href: 'mailto:user@email.com', icon: 'fas fa-envelope', title: 'Email' }
    ];

    useEffect(() => {
        // ★ 2. 로그인 정보 가져오기 (Login.js에서 저장한 currentUser)
        const storedUser = sessionStorage.getItem('currentUser');
        
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // 로그인한 정보로 상태 업데이트
            setUserData(prev => ({
                ...prev,
                name: parsedUser.nickname, // 로그인한 유저의 닉네임
                bio: parsedUser.bio || '창작을 좋아하는 열정가득 대학생입니다', // 없으면 기본값
                img: parsedUser.profile_image || '/images/White Cats.jpg'
            }));
        } else {
            // (선택사항) 기존 localStorage 로직 유지
            const savedData = localStorage.getItem('myspaceData');
            if (savedData) {
                const data = JSON.parse(savedData);
                if (data.name) setUserData(prev => ({ ...prev, name: data.name }));
                // ... 기타 데이터 로드
            }
        }
    }, []);

    // ★ 궤도 아이템 클릭 핸들러 (새로 추가됨)
    const handleOrbitClick = (artwork) => {
        // /myspacenode 페이지로 이동하면서 데이터를 state에 담아 보냅니다.
        navigate('/myspacenode', {
            state: {
                nodeData: {
                    id: artwork.id,      // 작품 ID (DB 연동용)
                    title: artwork.title || `Artwork ${artwork.id}`,
                    img: artwork.img     // 원본 이미지 경로
                }
            }
        });
    };

    const outerOrbitArtworks = orbitArtworks.filter(art => art.orbit === 'outer');
    const innerOrbitArtworks = orbitArtworks.filter(art => art.orbit === 'inner');

    return (
        <div className="myspace-page">
            <div
                className="myspace-page-background"
                style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/space_background.jpg)` }}
            />

            {/* Header 컴포넌트 */}
            <Header />

            <main className="myspace-container">
                <section className="section-profile">
                    <div className="profile-visual-area">
                        {neighbors.map((neighbor, index) => (
                            <div key={neighbor.id} className={`neighbor-profile neighbor-${index + 1}`}>
                                <img src={neighbor.img} alt={neighbor.alt} />
                            </div>
                        ))}

                        <div className="profile-image-wrapper">
                            <img
                                src={userData.img}
                                alt="프로필 사진"
                                className="profile-main-image"
                            />
                            <div className="social-orbit-container">
                                {socialLinks.map(social => (
                                    <a
                                        key={social.id}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`social-icon social-${social.id}`}
                                        title={social.title}
                                    >
                                        <i className={social.icon}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="profile-info">
                        {/* ★ 로그인한 사용자의 이름이 여기에 표시됩니다 */}
                        <h1 className="user-name">
                            {userData.name}
                            <span className="badge-me">me</span>
                        </h1>
                        <p className="user-bio">{userData.bio}</p>
                        <Link to="/myspace/setting">
                            <button className="btn-profile-manage">프로필 관리</button>
                        </Link>
                    </div>
                </section>

                <section className="section-works">
                    <p className="section-welcome-message">Welcome to my space</p>

                    <div className="folder-icons-container">
                        {folders.map(folder => (
                            <Link key={folder.id} to={folder.link} className="folder-item">
                                <div className="folder-icon-circle">
                                    <img src={folder.img} alt={`${folder.name} 폴더`} />
                                </div>
                                <span className="folder-name">{folder.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* ★ 궤도 영역 (수정됨: Link -> div + onClick) */}
                    <div className="artwork-orbit-area">
                        <div className="orbit orbit-outer">
                            {outerOrbitArtworks.map((artwork, index) => (
                                <div
                                    key={artwork.id}
                                    className={`artwork-item item-${index + 1} ${artwork.orientation}`}
                                    title={`작품 ${artwork.id}`}
                                    onClick={() => handleOrbitClick(artwork)} // 클릭 시 핸들러 실행
                                    style={{ cursor: 'pointer' }} // 마우스 포인터 모양 변경
                                >
                                    <img src={artwork.img} alt={`작품 ${artwork.id}`} />
                                </div>
                            ))}
                        </div>
                        <div className="orbit orbit-inner">
                            {innerOrbitArtworks.map((artwork, index) => (
                                <div
                                    key={artwork.id}
                                    className={`artwork-item item-${index + 5} ${artwork.orientation}`}
                                    title={`작품 ${artwork.id}`}
                                    onClick={() => handleOrbitClick(artwork)} // 클릭 시 핸들러 실행
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={artwork.img} alt={`작품 ${artwork.id}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <br />
                        <p className="section-welcome-message">
                            궤도를 회전하여 {userData.name}님의 스페이스를 탐험해보세요.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MySpace;