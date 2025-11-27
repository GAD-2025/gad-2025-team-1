import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MySpace.css';

const MySpace = () => {
    const [userData, setUserData] = useState({
        name: '김민지',
        bio: '창작을 좋아하는 열정가득 대학생입니다',
        img: '/images/White Cats.jpg'
    });

    const [folders, setFolders] = useState([
        { id: 1, name: 'WISH', img: '/images/folder_1.jpg', link: '/myspace/folder' },
        { id: 2, name: 'My Work', img: '/images/folder_2.jpg', link: '/my-work' },
        { id: 3, name: 'ART', img: '/images/folder_3.jpg', link: '/art-folder' }
    ]);

    const [orbitArtworks, setOrbitArtworks] = useState([
        { id: 1, img: '/images/art_5.jpg', link: '/node/1', orbit: 'outer', orientation: 'horizontal' },
        { id: 2, img: '/images/art_6.jpg', link: '/myspace/node', orbit: 'outer', orientation: 'horizontal' },
        { id: 3, img: '/images/art_7.jpg', link: '/node/3', orbit: 'outer', orientation: 'horizontal' },
        { id: 4, img: '/images/art_1.jpg', link: '/node/4', orbit: 'outer', orientation: 'vertical' },
        { id: 5, img: '/images/art_2.jpg', link: '/node/5', orbit: 'inner', orientation: 'vertical' },
        { id: 6, img: '/images/art_3.jpg', link: '/node/6', orbit: 'inner', orientation: 'vertical' },
        { id: 7, img: '/images/art_4.jpg', link: '/node/7', orbit: 'inner', orientation: 'vertical' }
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
        // Load saved data from localStorage
        const savedData = localStorage.getItem('myspaceData');
        if (savedData) {
            const data = JSON.parse(savedData);
            if (data.name) setUserData(prev => ({ ...prev, name: data.name }));
            if (data.bio) setUserData(prev => ({ ...prev, bio: data.bio }));
            if (data.img) setUserData(prev => ({ ...prev, img: data.img }));
            if (data.folders) {
                setFolders(prev => prev.map((folder, idx) => ({
                    ...folder,
                    name: data.folders[idx]?.name || folder.name
                })));
            }
            if (data.orbit && data.orbit.length > 0) {
                setOrbitArtworks(prev => data.orbit.map((imgSrc, index) => ({
                    id: index + 1,
                    img: imgSrc,
                    link: `/myspace/node?id=${index}`,
                    orbit: index % 2 === 0 ? 'outer' : 'inner',
                    orientation: index % 2 === 0 ? 'horizontal' : 'vertical'
                })));
            }
        }
    }, []);

    const outerOrbitArtworks = orbitArtworks.filter(art => art.orbit === 'outer');
    const innerOrbitArtworks = orbitArtworks.filter(art => art.orbit === 'inner');

    return (
        <div className="myspace-page">
            {/* Background */}
            <div
                className="myspace-page-background"
                style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/space_background.jpg)` }}
            />

            {/* Header */}
            <header className="main-header">
                <div className="header-section header-left">
                    <Link to="/explore" className="header-logo">
                        <span style={{ color: '#FF5900' }}>creAItive</span>
                    </Link>
                </div>

                <nav className="header-section header-center">
                    <ul className="header-menu">
                        <li><a href="/marketplace">거래하기</a></li>
                        <li><a href="/archive">작품보관함</a></li>
                        <li><Link to="/myspace" className="active">마이 스페이스</Link></li>
                        <li><a href="/setting">설정</a></li>
                    </ul>
                </nav>

                <div className="header-section header-right">
                    <a href="/login" className="login-button">로그인</a>
                </div>
            </header>

            {/* Main Content */}
            <main className="myspace-container">
                {/* Profile Section */}
                <section className="section-profile">
                    <div className="profile-visual-area">
                        {/* Neighbor Profiles */}
                        {neighbors.map((neighbor, index) => (
                            <div key={neighbor.id} className={`neighbor-profile neighbor-${index + 1}`}>
                                <img src={neighbor.img} alt={neighbor.alt} />
                            </div>
                        ))}

                        {/* Main Profile Image */}
                        <div className="profile-image-wrapper">
                            <img
                                src={userData.img}
                                alt="프로필 사진"
                                className="profile-main-image"
                            />

                            {/* Social Orbit */}
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

                    {/* Profile Info */}
                    <div className="profile-info">
                        <h1 className="user-name">
                            {userData.name}
                            <span className="badge-me">me</span>
                        </h1>
                        <p className="user-bio">{userData.bio}</p>
                        <a href="/myspace/setting">
                            <button className="btn-profile-manage">프로필 관리</button>
                        </a>
                    </div>
                </section>

                {/* Works Section */}
                <section className="section-works">
                    <p className="section-welcome-message">Welcome to my space</p>

                    {/* Folder Icons */}
                    <div className="folder-icons-container">
                        {folders.map(folder => (
                            <a key={folder.id} href={folder.link} className="folder-item">
                                <div className="folder-icon-circle">
                                    <img src={folder.img} alt={`${folder.name} 폴더`} />
                                </div>
                                <span className="folder-name">{folder.name}</span>
                            </a>
                        ))}
                    </div>

                    {/* Artwork Orbit */}
                    <div className="artwork-orbit-area">
                        <div className="orbit orbit-outer">
                            {outerOrbitArtworks.map((artwork, index) => (
                                <a
                                    key={artwork.id}
                                    href={artwork.link}
                                    className={`artwork-item item-${index + 1} ${artwork.orientation}`}
                                    title={`작품 ${artwork.id}`}
                                >
                                    <img src={artwork.img} alt={`작품 ${artwork.id}`} />
                                </a>
                            ))}
                        </div>
                        <div className="orbit orbit-inner">
                            {innerOrbitArtworks.map((artwork, index) => (
                                <a
                                    key={artwork.id}
                                    href={artwork.link}
                                    className={`artwork-item item-${index + 5} ${artwork.orientation}`}
                                    title={`작품 ${artwork.id}`}
                                >
                                    <img src={artwork.img} alt={`작품 ${artwork.id}`} />
                                </a>
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
