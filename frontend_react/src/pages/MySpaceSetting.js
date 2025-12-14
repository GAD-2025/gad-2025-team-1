import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import './MySpaceSetting.css';

const MySpaceSetting = () => {
    const navigate = useNavigate();

    // 초기값 (로딩 전 보여질 껍데기)
    const [myData, setMyData] = useState({
        id: '',
        name: "",
        bio: "",
        img: "/images/White Cats.jpg",
        folders: [],
        orbit: []
    });

    const [inventory, setInventory] = useState([]); // 구매한 작품 목록 (DB에서 art_1~7 로드)
    const [imagePickerModal, setImagePickerModal] = useState(false);
    const [folderEditModal, setFolderEditModal] = useState(false);
    const [pickerMode, setPickerMode] = useState(''); 
    const [currentEditingFolderId, setCurrentEditingFolderId] = useState(null);

    // ★ 1. 데이터 로드 (DB에서 가져오기)
    useEffect(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        if (!storedUser) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }
        
        const user = JSON.parse(storedUser);

        // API 호출: 내 마이스페이스 데이터 + 인벤토리
        fetch(`http://localhost:5000/api/myspace/${user.username}`)
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    setMyData({
                        id: user.username,
                        name: user.nickname,
                        bio: user.bio || '',
                        img: user.profile_image || '/images/White Cats.jpg',
                        folders: data.folders || [], // DB에서 온 폴더 구조
                        orbit: data.orbit || []      // DB에서 온 궤도 목록
                    });
                    setInventory(data.inventory || []); // DB에서 온 보유 작품
                }
            })
            .catch(err => console.error(err));
    }, [navigate]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === 'inputName') setMyData(prev => ({...prev, name: value}));
        else if (id === 'inputBio') setMyData(prev => ({...prev, bio: value}));
    };

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => setMyData(prev => ({...prev, img: event.target.result}));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // ★ 폴더 생성 (추가 버튼 클릭 시)
    const createNewFolder = () => {
        const newFolderId = Date.now(); // 임시 ID 생성
        const newFolder = {
            id: newFolderId,
            name: "새 폴더",
            thumb: "/images/art_1.jpg", // 기본 썸네일 (보유작품 중 하나로 설정)
            works: []
        };
        
        // 폴더 목록에 추가하고 바로 편집 모달 열기
        setMyData(prev => ({ ...prev, folders: [...prev.folders, newFolder] }));
        openFolderEdit(newFolderId);
    };

    // ★ 폴더 이름 변경
    const handleFolderNameChange = (e) => {
        const newName = e.target.value;
        const newFolders = myData.folders.map(folder => 
            folder.id === currentEditingFolderId ? { ...folder, name: newName } : folder
        );
        setMyData(prev => ({ ...prev, folders: newFolders }));
    };

    // ★ 폴더 커버 변경 (파일 업로드)
    const handleFolderCoverUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newThumb = event.target.result;
                const newFolders = myData.folders.map(folder => 
                    folder.id === currentEditingFolderId ? { ...folder, thumb: newThumb } : folder
                );
                setMyData(prev => ({ ...prev, folders: newFolders }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const deleteOrbitWork = (index) => {
        const newOrbit = [...myData.orbit];
        newOrbit.splice(index, 1);
        setMyData(prev => ({ ...prev, orbit: newOrbit }));
    };

    const openFolderEdit = (folderId) => {
        setCurrentEditingFolderId(folderId);
        setFolderEditModal(true);
    };

    const deleteFolderWork = (workIndex) => {
        const newFolders = myData.folders.map(folder => {
            if (folder.id === currentEditingFolderId) {
                const newWorks = [...folder.works];
                newWorks.splice(workIndex, 1);
                return {...folder, works: newWorks};
            }
            return folder;
        });
        setMyData(prev => ({ ...prev, folders: newFolders }));
    };

    const openPicker = (mode) => {
        setPickerMode(mode);
        // 폴더 모드일 때는 폴더 편집 모달을 잠시 숨김 (피커 뒤에 깔리지 않게 하거나, z-index 처리)
        // 여기서는 UX상 폴더 모달을 닫지 않고 피커를 위에 띄우는 것이 좋으나, 
        // 간단한 구현을 위해 모달 상태 관리
        if (mode === 'folder') {
             // 폴더 편집 모달 위에 피커가 뜨도록 z-index를 CSS로 조정하거나,
             // 현재 구조상 그냥 띄워도 됨 (피커가 더 뒤에 렌더링되므로)
        }
        setImagePickerModal(true);
    };

    // ★ 작품 선택 (DB 인벤토리에서 선택)
    const pickImage = (artworkUrl) => {
        if (pickerMode === 'orbit') {
            setMyData(prev => ({ ...prev, orbit: [...prev.orbit, artworkUrl] }));
            setImagePickerModal(false);
        } else if (pickerMode === 'folder') {
            const newFolders = myData.folders.map(folder => {
                if (folder.id === currentEditingFolderId) {
                    return { ...folder, works: [...folder.works, artworkUrl] };
                }
                return folder;
            });
            setMyData(prev => ({ ...prev, folders: newFolders }));
            setImagePickerModal(false);
            // 폴더 편집 모달은 계속 열려있어야 함
            setFolderEditModal(true);
        }
    };

    // ★ 저장 로직
    const saveAllData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/myspace/save', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(myData)
            });

            const result = await response.json();
            if (result.success) {
                sessionStorage.setItem('currentUser', JSON.stringify(result.user));
                alert('저장되었습니다!');
                navigate('/myspace');
            } else {
                alert('저장 실패: ' + result.message);
            }
        } catch (error) {
            console.error(error);
            alert('오류 발생');
        }
    };

    // 현재 편집 중인 폴더 찾기
    const currentFolder = myData.folders.find(f => f.id === currentEditingFolderId);

    return (
        <div className="myspace-setting-page">
            <Header />
            <main className="myspace-container">
                <div className="manage-container">
                    <h2 className="manage-title">프로필 및 스페이스 관리</h2>
                    
                    {/* 기본 정보 */}
                    <section className="manage-card">
                        <div className="section-title">기본 정보</div>
                        <div className="basic-info-grid">
                            <div className="profile-img-edit">
                                <img src={myData.img} className="profile-img-preview" alt="profile"/>
                                <label htmlFor="fileInput" className="btn-img-upload"><i className="fas fa-camera"></i></label>
                                <input type="file" id="fileInput" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                            </div>
                            <div className="input-group">
                                <div><label>이름</label><input type="text" className="form-input" id="inputName" value={myData.name} onChange={handleInputChange} /></div>
                                <div><label>한줄 소개</label><textarea className="form-textarea" id="inputBio" value={myData.bio} onChange={handleInputChange}></textarea></div>
                            </div>
                        </div>
                    </section>

                    {/* 폴더 관리 */}
                    <section className="manage-card">
                        <div className="section-title">아카이빙 폴더 관리</div>
                        <div className="folder-list">
                            {myData.folders.map(folder => (
                                <div key={folder.id} className="folder-item-edit" onClick={() => openFolderEdit(folder.id)}>
                                    <div className="item-info">
                                        <img src={folder.thumb.startsWith('/') ? folder.thumb : `${process.env.PUBLIC_URL}${folder.thumb}`} className="item-thumb" alt={folder.name} />
                                        <span style={{fontWeight:'bold'}}>{folder.name}</span>
                                        <span style={{fontSize:'12px', color:'#666', marginLeft:'10px'}}>({folder.works ? folder.works.length : 0}개)</span>
                                    </div>
                                    <i className="fas fa-chevron-right"></i>
                                </div>
                            ))}
                            
                            {/* ★ 폴더 추가 버튼 (새로 생성) */}
                            <div className="folder-add-btn" onClick={createNewFolder} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                border: '2px dashed #ccc', borderRadius: '10px', 
                                padding: '15px', cursor: 'pointer', color: '#888'
                            }}>
                                <i className="fas fa-plus" style={{marginRight:'8px'}}></i> 새 폴더 만들기
                            </div>
                        </div>
                    </section>

                    {/* 궤도 관리 */}
                    <section className="manage-card">
                        <div className="section-title">궤도 작품 관리</div>
                        <div className="orbit-grid">
                            {myData.orbit.map((imgUrl, index) => (
                                <div key={index} className="orbit-item">
                                    <img src={imgUrl.startsWith('/') ? imgUrl : `${process.env.PUBLIC_URL}${imgUrl}`} alt="orbit" />
                                    <button className="btn-delete-orbit" onClick={() => deleteOrbitWork(index)}><i className="fas fa-minus"></i></button>
                                </div>
                            ))}
                            {/* 궤도 작품 추가 버튼 */}
                            <div className="orbit-add-btn" onClick={() => openPicker('orbit')}><i className="fas fa-plus"></i></div>
                        </div>
                    </section>

                    <div className="action-buttons">
                        <button className="btn-action btn-cancel" onClick={() => navigate(-1)}>취소</button>
                        <button className="btn-action btn-save" onClick={saveAllData}>저장하기</button>
                    </div>
                </div>
            </main>

            {/* 이미지 피커 모달 (보유 작품 art_1 ~ art_7 선택) */}
            {imagePickerModal && (
                <div className="modal-overlay active" style={{zIndex: 2000}}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-title">보유한 작품 선택 (Inventory)</span>
                            <button className="modal-close" onClick={() => setImagePickerModal(false)}>&times;</button>
                        </div>
                        <div className="image-picker-grid">
                            {inventory.length > 0 ? (
                                inventory.map((item) => (
                                    <div key={item.id} className="pick-item" onClick={() => pickImage(item.image_url)}>
                                        <img src={item.image_url.startsWith('/') ? item.image_url : `${process.env.PUBLIC_URL}${item.image_url}`} className="pick-img" alt={item.title} />
                                        <span className="pick-label">{item.title}</span>
                                    </div>
                                ))
                            ) : (
                                <p style={{padding:'20px'}}>보유한 작품이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 폴더 편집 모달 */}
            {folderEditModal && currentFolder && (
                 <div className="modal-overlay active" style={{zIndex: 1000}}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-title">폴더 설정</span>
                            <button className="modal-close" onClick={() => setFolderEditModal(false)}>&times;</button>
                        </div>
                        
                        <div className="folder-edit-header" style={{display:'flex', gap:'20px', marginBottom:'20px', paddingBottom:'20px', borderBottom:'1px solid #eee'}}>
                            <div style={{textAlign:'center'}}>
                                <label style={{fontSize:'12px'}}>커버 이미지</label>
                                <div style={{width:'80px', height:'80px', borderRadius:'10px', overflow:'hidden', margin:'0 auto', border:'1px solid #ddd', position:'relative'}}>
                                    <img src={currentFolder.thumb.startsWith('/') ? currentFolder.thumb : `${process.env.PUBLIC_URL}${currentFolder.thumb}`} alt="cover" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                    <label htmlFor={`cover-${currentFolder.id}`} style={{position:'absolute', bottom:0, width:'100%', background:'rgba(0,0,0,0.5)', color:'white', fontSize:'10px', cursor:'pointer', textAlign:'center', display:'block'}}>변경</label>
                                    <input type="file" id={`cover-${currentFolder.id}`} style={{display:'none'}} accept="image/*" onChange={handleFolderCoverUpload} />
                                </div>
                            </div>
                            <div style={{flex:1}}>
                                <label style={{fontSize:'12px'}}>폴더 이름</label>
                                <input type="text" className="form-input" value={currentFolder.name} onChange={handleFolderNameChange} style={{width:'100%', padding:'8px'}} placeholder="폴더 이름을 입력하세요"/>
                            </div>
                        </div>

                        <p style={{fontWeight:'bold'}}>폴더 내 작품 관리</p>
                        <div className="orbit-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', maxHeight:'250px', overflowY:'auto'}}>
                             {currentFolder.works && currentFolder.works.map((work, idx) => (
                                <div key={idx} className="orbit-item">
                                    <img src={work.startsWith('/') ? work : `${process.env.PUBLIC_URL}${work}`} alt="work" />
                                    <button className="btn-delete-orbit" onClick={() => deleteFolderWork(idx)}><i className="fas fa-minus"></i></button>
                                </div>
                            ))}
                            {/* 폴더 내 작품 추가 버튼 */}
                            <div className="orbit-add-btn" onClick={() => openPicker('folder')}><i className="fas fa-plus"></i></div>
                        </div>
                        
                        <div style={{marginTop: '20px', textAlign: 'right'}}>
                            <button className="btn-action btn-save" onClick={() => setFolderEditModal(false)} style={{padding: '8px 20px', fontSize: '14px'}}>완료</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MySpaceSetting;