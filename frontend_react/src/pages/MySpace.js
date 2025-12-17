import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './MySpace.css';

const MySpace = () => {
    // ... (상태값 및 useEffect는 기존과 동일) ...
    const [userData, setUserData] = useState({
        name: 'Guest',
        bio: '로그인이 필요합니다.',
        img: `${process.env.PUBLIC_URL}/images/profile_basic.jpg`
    });

    const [folders, setFolders] = useState([]);
    const [orbitArtworks, setOrbitArtworks] = useState([]);
    const [showFriendModal, setShowFriendModal] = useState(false);

    // 궤도 회전 State
    const [rotation, setRotation] = useState(0);       
    const [isDragging, setIsDragging] = useState(false); 
    const [startX, setStartX] = useState(0);           
    const [startRotation, setStartRotation] = useState(0); 

    const neighbors = [
        { id: 1, img: '/images/friend_1.jpg' }, { id: 2, img: '/images/friend_2.jpg' },
        { id: 3, img: '/images/friend_3.jpg' }, { id: 4, img: '/images/friend_4.jpg' }
    ];

    const socialLinks = [
        { id: 'insta', href: '#', icon: 'fab fa-instagram' },
        { id: 'facebook', href: '#', icon: 'fab fa-facebook-f' },
        { id: 'twitter', href: '#', icon: 'fab fa-twitter' },
        { id: 'messenger', href: '#', icon: 'fab fa-facebook-messenger' },
        { id: 'star', href: '#', icon: 'fas fa-star' }
    ];

    useEffect(() => {
        // ... (API 호출 부분 기존과 동일) ...
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            fetch(`${process.env.REACT_APP_API_BASE_URL}/api/myspace/${user.username}`)
                .then(res => res.json())
                .then(data => {
                    if(data.success) {
                        const dbImage = user.profile_image;
                        const defaultImg = `${process.env.PUBLIC_URL}/images/profile_basic.jpg`;
                        let finalImage = defaultImg;
                        if (dbImage && dbImage !== "") {
                             finalImage = dbImage.startsWith('http') ? dbImage : 
                                         (dbImage.startsWith('/') ? dbImage : `${process.env.PUBLIC_URL}${dbImage}`);
                        }
                        setUserData({ name: user.nickname, bio: user.bio || '', img: finalImage });
                        setFolders(data.folders.map(f => ({ ...f, img: f.thumb, link: `/myspace/folder/${f.id}` })));
                        setOrbitArtworks(data.orbit.map((imgUrl, i) => ({
                            id: i, img: imgUrl, link: '/myspace/node', 
                            orbit: i % 2 === 0 ? 'outer' : 'inner', 
                            orientation: i % 2 === 0 ? 'horizontal' : 'vertical'
                        })));
                    }
                })
                .catch(err => console.error(err));
        }
    }, []);

    const outerOrbitArtworks = orbitArtworks.filter(art => art.orbit === 'outer');
    const innerOrbitArtworks = orbitArtworks.filter(art => art.orbit === 'inner');

    const handleFriendClick = () => setShowFriendModal(true);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX);
        setStartRotation(rotation);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = (x - startX) * 0.5; 
        setRotation(startRotation + walk);
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleLinkClick = (e) => {
        if (Math.abs(rotation - startRotation) > 5) {
            e.preventDefault();
        }
    };

    // ★ [핵심 수정] 궤도별 회전 계산 (패럴랙스 효과)
    // 1. outerRotation: 마우스 방향 그대로, 속도 0.6배 (천천히 돔)
    // 2. innerRotation: 마우스 반대 방향(-), 속도 0.8배 (반대로 빠르게 돔)
    // -> 이렇게 하면 두 궤도가 서로 엇갈리며 지나가서 "개별적으로 움직이는 느낌"이 납니다.
    const outerRotation = rotation * 0.6;
    const innerRotation = rotation * -0.8;

    return (
        <div className="myspace-page">
            <div className="myspace-page-background" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/space_background.jpg)` }} />
            <Header />

            <main className="myspace-container">
                <section className="section-profile">
                    {/* ... (프로필 영역 기존과 동일) ... */}
                    <div className="profile-visual-area" style={{ position: 'relative', height: '450px', width: '100%', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '0px', height: '0px' }}>
                            <div className="profile-image-wrapper" style={{ position: 'absolute', transform: 'translate(-50%, -50%)', width: '220px', height: '220px', borderRadius: '50%', zIndex: 20 }}>
                                <img src={userData.img} alt="profile" className="profile-main-image" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.8)', boxShadow: '0 0 20px rgba(255,255,255,0.3)' }} onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/images/profile_basic.jpg`; }} />
                            </div>
                            {socialLinks.map((s, index) => {
                                const total = socialLinks.length;
                                const radius = 165;
                                const angle = (360 / total) * index; 
                                return (
                                    <a key={s.id} href={s.href} className={`social-icon social-${s.id}`} style={{ position: 'absolute', left: 0, top: 0, transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg) translate(-50%, -50%)`, width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '50%', color: '#fff', textDecoration: 'none', backdropFilter: 'blur(5px)', fontSize: '20px', zIndex: 30 }}>
                                        <i className={s.icon}></i>
                                    </a>
                                );
                            })}
                            {neighbors.map((n, i) => {
                                const total = neighbors.length;
                                const radius = 260;
                                const startAngle = 45;
                                const angle = startAngle + (360 / total) * i;
                                return (
                                    <div key={n.id} className={`neighbor-profile neighbor-${i + 1}`} onClick={handleFriendClick} style={{ position: 'absolute', left: 0, top: 0, transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg) translate(-50%, -50%)`, cursor: 'pointer', zIndex: 10, width: '70px', height: '70px' }}>
                                        <img src={n.img} alt="neighbor" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)' }} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="profile-info" style={{marginTop: '0px', textAlign: 'center', zIndex: 40, position:'relative'}}>
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

                    <div 
                        className="artwork-orbit-area"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                        {/* ★ 바깥 궤도 (Outer Orbit) 
                            - 회전: outerRotation (정방향, 느림)
                            - 자식 역회전: -outerRotation (각도 유지)
                        */}
                        <div 
                            className="orbit orbit-outer"
                            style={{ transform: `rotate(${outerRotation}deg)` }}
                        >
                            {outerOrbitArtworks.map((art, i) => (
                                <Link 
                                    key={i} 
                                    to={art.link} 
                                    state={{ nodeData: art }} 
                                    className={`artwork-item item-${i+1} ${art.orientation}`}
                                    onClick={handleLinkClick} 
                                    draggable="false"
                                    // 자식이 부모의 회전을 상쇄해야 하므로 정확히 반대값 적용
                                    style={{ transform: `rotate(${-outerRotation}deg)` }} 
                                >
                                    <img src={art.img} alt="art" draggable="false" />
                                </Link>
                            ))}
                        </div>

                        {/* ★ 안쪽 궤도 (Inner Orbit)
                            - 회전: innerRotation (역방향, 빠름) -> 엇갈리는 효과 발생
                            - 자식 역회전: -innerRotation (각도 유지)
                        */}
                        <div 
                            className="orbit orbit-inner"
                            style={{ transform: `rotate(${innerRotation}deg)` }}
                        >
                            {innerOrbitArtworks.map((art, i) => (
                                <Link 
                                    key={i} 
                                    to={art.link} 
                                    state={{ nodeData: art }} 
                                    className={`artwork-item item-${i+5} ${art.orientation}`}
                                    onClick={handleLinkClick} 
                                    draggable="false"
                                    // 마찬가지로 부모(innerRotation)의 반대값을 적용
                                    style={{ transform: `rotate(${-innerRotation}deg)` }}
                                >
                                    <img src={art.img} alt="art" draggable="false" />
                                </Link>
                            ))}
                        </div>
                    </div>
                    <br></br> <br></br>
                    <div className="orbit-guide-text" style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', marginTop: '40px', fontSize: '14px', fontWeight: '300', letterSpacing: '1px' }}>
                        궤도를 움직여서 탐색해보세요.
                    </div>
                </section>
            </main>
            
            {showFriendModal && (
                /* ... (모달 동일) ... */
                <div className="modal-overlay active" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="modal-content" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
                        <p style={{marginBottom: '20px', fontSize: '16px', lineHeight: '1.5'}}>친구의 스페이스로 이동합니다.<br/><span style={{color: '#888', fontSize: '14px'}}>(구현 예정인 기능입니다.)</span></p>
                        <button onClick={() => setShowFriendModal(false)} style={{ padding: '10px 25px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>확인</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MySpace;