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

    const [folders, setFolders] = useState([]);
    const [orbitArtworks, setOrbitArtworks] = useState([]);

    const neighbors = [
        { id: 1, img: '/images/friend_1.jpg' }, { id: 2, img: '/images/friend_2.jpg' },
        { id: 3, img: '/images/friend_3.jpg' }, { id: 4, img: '/images/friend_4.jpg' }
    ];
    const socialLinks = [
        { id: 'insta', href: '#', icon: 'fab fa-instagram' },
        { id: 'email', href: '#', icon: 'fas fa-envelope' }
    ];

    useEffect(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            
            // ★ 서버에서 최신 데이터(폴더, 궤도) 가져오기
            fetch(`http://localhost:5000/api/myspace/${user.username}`)
                .then(res => res.json())
                .then(data => {
                    if(data.success) {
                        setUserData({
                            name: user.nickname,
                            bio: user.bio || '',
                            img: user.profile_image || '/images/White Cats.jpg'
                        });

                        // 폴더 데이터 세팅
                        setFolders(data.folders.map(f => ({
                            ...f,
                            img: f.thumb, // DB 필드명(thumb) -> 프론트(img) 매핑
                            link: `/myspace/folder/${f.id}`
                        })));

                        // 궤도 데이터 세팅
                        setOrbitArtworks(data.orbit.map((imgUrl, i) => ({
                            id: i,
                            img: imgUrl,
                            link: '#',
                            orbit: i % 2 === 0 ? 'outer' : 'inner', // 단순화를 위해 교차 배치
                            orientation: i % 2 === 0 ? 'horizontal' : 'vertical'
                        })));
                    }
                })
                .catch(err => console.error(err));
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