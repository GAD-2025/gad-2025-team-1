import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './MySpace.css';

const MySpace = () => {
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

    // ★ [핵심 수정] 이미지 경로 보정 함수 강화
    // 정적 이미지(/images/)와 업로드 이미지(백엔드)를 구분합니다.
    const getFullImageUrl = (path) => {
        if (!path) return `${process.env.PUBLIC_URL}/images/no_image.jpg`; // 기본 이미지
        
        // 1. 이미 완전한 URL이거나 데이터 URI(미리보기)인 경우 -> 그대로 반환
        if (path.startsWith('http') || path.startsWith('data:')) return path;

        // 2. [기존 이미지 살리기] 경로가 '/images/'로 시작하면 프론트엔드 public 폴더의 파일임
        // -> 서버 주소(localhost:5000)를 붙이면 안 됨!
        if (path.startsWith('/images/') || path.startsWith('images/')) {
            return path.startsWith('/') ? path : `/${path}`;
        }

        // 3. [업로드 이미지 살리기] 그 외(백엔드 uploads 등)는 서버 주소 붙이기
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `http://localhost:5000${cleanPath}`;
    };

    useEffect(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            fetch(`http://localhost:5000/api/myspace/${user.username}`)
                .then(res => res.json())
                .then(data => {
                    if(data.success) {
                        // 1. 프로필 이미지 처리
                        const finalProfileImage = getFullImageUrl(user.profile_image);
                        
                        setUserData({ 
                            name: user.nickname, 
                            bio: user.bio || '', 
                            img: finalProfileImage 
                        });

                        // 2. 폴더 썸네일 처리
                        setFolders(data.folders.map(f => ({ 
                            ...f, 
                            img: getFullImageUrl(f.thumb), // 여기서 경로 변환
                            link: `/myspace/folder/${f.id}` 
                        })));

                        // 3. 궤도(Orbit) 작품 이미지 처리
                        setOrbitArtworks(data.orbit.map((imgUrl, i) => ({
                            id: i, 
                            img: getFullImageUrl(imgUrl), // 여기서 경로 변환
                            link: '/myspace/node', 
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

    const outerRotation = rotation * 0.6;
    const innerRotation = rotation * -0.8;

    return (
        <div className="myspace-page">
            <div className="myspace-page-background" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/space_background.jpg)` }} />
            <Header />

            <main className="myspace-container">
                <section className="section-profile">
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
                                <div className="folder-icon-circle"><img src={folder.img} alt={folder.name} onError={(e)=>{e.target.src='/images/folder_basic.jpg'}} /></div>
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
                        <div className="orbit orbit-outer" style={{ transform: `rotate(${outerRotation}deg)` }}>
                            {outerOrbitArtworks.map((art, i) => (
                                <Link key={i} to={art.link} state={{ nodeData: art }} className={`artwork-item item-${i+1} ${art.orientation}`} onClick={handleLinkClick} draggable="false" style={{ transform: `rotate(${-outerRotation}deg)` }}>
                                    <img src={art.img} alt="art" draggable="false" onError={(e)=>{e.target.style.display='none'}} />
                                </Link>
                            ))}
                        </div>

                        <div className="orbit orbit-inner" style={{ transform: `rotate(${innerRotation}deg)` }}>
                            {innerOrbitArtworks.map((art, i) => (
                                <Link key={i} to={art.link} state={{ nodeData: art }} className={`artwork-item item-${i+5} ${art.orientation}`} onClick={handleLinkClick} draggable="false" style={{ transform: `rotate(${-innerRotation}deg)` }}>
                                    <img src={art.img} alt="art" draggable="false" onError={(e)=>{e.target.style.display='none'}} />
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