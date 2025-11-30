import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Header from '../components/Header';
import './MySpace.css';

const MySpace = () => {
    const [userData, setUserData] = useState({
        name: 'Guest',
        bio: '로그인이 필요합니다.',
        img: '/images/White Cats.jpg'
    });

    // 기본 폴더 (데이터 없을 시)
    const [folders, setFolders] = useState([
        { id: 1, name: 'WISH', img: '/images/folder_1.jpg', link: '/myspace/folder/1' },
        { id: 2, name: 'My Work', img: '/images/folder_2.jpg', link: '/myspace/folder/2' },
        { id: 3, name: 'ART', img: '/images/folder_3.jpg', link: '/myspace/folder/3' }
    ]);

    const [orbitArtworks, setOrbitArtworks] = useState([]);

    // 이웃 및 소셜 링크 (고정 데이터)
    const neighbors = [
        { id: 1, img: '/images/friend_1.jpg' }, { id: 2, img: '/images/friend_2.jpg' },
        { id: 3, img: '/images/friend_3.jpg' }, { id: 4, img: '/images/friend_4.jpg' }
    ];
    const socialLinks = [
        { id: 'insta', href: '#', icon: 'fab fa-instagram' },
        { id: 'email', href: '#', icon: 'fas fa-envelope' }
    ];

    useEffect(() => {
        // 1. 유저 정보 로드
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserData({
                name: parsedUser.nickname,
                bio: parsedUser.bio || '',
                img: parsedUser.profile_image || '/images/White Cats.jpg'
            });
        }

        // 2. 설정 데이터(폴더/궤도) 로드
        const savedData = localStorage.getItem('myspaceData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // 폴더 정보 업데이트
            if (data.folders) {
                setFolders(data.folders.map(f => ({
                    ...f,
                    link: `/myspace/folder/${f.id}` // ★ 클릭 시 해당 폴더로 이동하게 링크 수정
                })));
            }

            // 궤도 정보 업데이트
            if (data.orbit) {
                // 저장된 이미지 URL 배열을 궤도 객체 배열로 변환
                const newOrbit = data.orbit.map((imgUrl, index) => ({
                    id: index,
                    img: imgUrl,
                    link: '#', // 클릭 시 상세페이지 (추후 구현)
                    orbit: index % 2 === 0 ? 'outer' : 'inner',
                    orientation: 'vertical'
                }));
                setOrbitArtworks(newOrbit);
            }
        }
    }, []);

    const outerOrbitArtworks = orbitArtworks.filter(art => art.orbit === 'outer');
    const innerOrbitArtworks = orbitArtworks.filter(art => art.orbit === 'inner');

    return (
        <div className="myspace-page">
            <div className="myspace-page-background" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/space_background.jpg)` }} />
            <Header />

            <main className="myspace-container">
                <section className="section-profile">
                    <div className="profile-visual-area">
                        {neighbors.map((n, i) => (
                            <div key={n.id} className={`neighbor-profile neighbor-${i + 1}`}><img src={n.img} alt="neighbor"/></div>
                        ))}
                        <div className="profile-image-wrapper">
                            <img src={userData.img} alt="profile" className="profile-main-image" />
                            <div className="social-orbit-container">
                                {socialLinks.map(s => <a key={s.id} href={s.href} className={`social-icon social-${s.id}`}><i className={s.icon}></i></a>)}
                            </div>
                        </div>
                    </div>

                    <div className="profile-info">
                        <h1 className="user-name">{userData.name}<span className="badge-me">me</span></h1>
                        <p className="user-bio">{userData.bio}</p>
                        <Link to="/myspace/setting"><button className="btn-profile-manage">프로필 관리</button></Link>
                    </div>
                </section>

                <section className="section-works">
                    <p className="section-welcome-message">Welcome to my space</p>
                    <div className="folder-icons-container">
                        {/* 폴더 클릭 시 데이터를 state로 넘겨줌 */}
                        {folders.map(folder => (
                            <Link key={folder.id} to={folder.link} state={{ folderData: folder }} className="folder-item">
                                <div className="folder-icon-circle"><img src={folder.img} alt={folder.name} /></div>
                                <span className="folder-name">{folder.name}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="artwork-orbit-area">
                        <div className="orbit orbit-outer">
                            {outerOrbitArtworks.map((art, i) => (
                                <Link key={i} to={art.link} className={`artwork-item item-${i+1} ${art.orientation}`}>
                                    <img src={art.img} alt="art" />
                                </Link>
                            ))}
                        </div>
                        <div className="orbit orbit-inner">
                            {innerOrbitArtworks.map((art, i) => (
                                <Link key={i} to={art.link} className={`artwork-item item-${i+5} ${art.orientation}`}>
                                    <img src={art.img} alt="art" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MySpace;