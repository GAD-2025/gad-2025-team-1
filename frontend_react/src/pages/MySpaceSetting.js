import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import './MySpaceSetting.css';

const MySpaceSetting = () => {
    const navigate = useNavigate();

    // 초기 데이터
    const defaultData = {
        id: '', 
        name: "",
        bio: "",
        img: "/images/White Cats.jpg",
        folders: [
            { id: 1, name: "WISH", thumb: "/images/folder_1.jpg", works: [] },
            { id: 2, name: "My Work", thumb: "/images/folder_2.jpg", works: [] },
            { id: 3, name: "ART", thumb: "/images/folder_3.jpg", works: [] }
        ],
        orbit: [] 
    };

    const [myData, setMyData] = useState(defaultData);
    const [inventory, setInventory] = useState([]);
    const [imagePickerModal, setImagePickerModal] = useState(false);
    const [folderEditModal, setFolderEditModal] = useState(false);
    const [pickerMode, setPickerMode] = useState(''); 
    const [currentEditingFolderId, setCurrentEditingFolderId] = useState(null);

    // 1. 페이지 로드 시 데이터 불러오기
    useEffect(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            
            setMyData(prev => ({
                ...prev,
                id: user.username,
                name: user.nickname,
                bio: user.bio || '',
                img: user.profile_image || '/images/White Cats.jpg'
            }));

            const savedLayout = localStorage.getItem('myspaceData');
            if(savedLayout) {
                const parsedLayout = JSON.parse(savedLayout);
                setMyData(prev => ({
                    ...prev,
                    folders: parsedLayout.folders || prev.folders,
                    orbit: parsedLayout.orbit || prev.orbit
                }));
            }

            // 서버에서 인벤토리 가져오기
            fetch(`http://localhost:5000/api/inventory/${user.username}`)
                .then(res => res.json())
                .then(data => {
                    if(data.success) {
                        setInventory(data.inventory);
                    }
                })
                .catch(err => console.error("인벤토리 로드 실패", err));

        } else {
            alert("로그인이 필요합니다.");
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === 'inputName') setMyData(prev => ({...prev, name: value}));
        else if (id === 'inputBio') setMyData(prev => ({...prev, bio: value}));
    };

    // 프로필 이미지 업로드
    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setMyData(prev => ({...prev, img: event.target.result}));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // ★ [NEW] 폴더 이름 변경 핸들러
    const handleFolderNameChange = (e) => {
        const newName = e.target.value;
        const newFolders = myData.folders.map(folder => {
            if (folder.id === currentEditingFolderId) {
                return { ...folder, name: newName };
            }
            return folder;
        });
        setMyData(prev => ({ ...prev, folders: newFolders }));
    };

    // ★ [NEW] 폴더 커버 이미지 변경 핸들러
    const handleFolderCoverUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newThumb = event.target.result;
                const newFolders = myData.folders.map(folder => {
                    if (folder.id === currentEditingFolderId) {
                        return { ...folder, thumb: newThumb };
                    }
                    return folder;
                });
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
        if (mode === 'folder') setFolderEditModal(false);
        setImagePickerModal(true);
    };
    
    const pickImage = (artwork) => {
        if (pickerMode === 'orbit') {
            setMyData(prev => ({ ...prev, orbit: [...prev.orbit, artwork.image_url] }));
            setImagePickerModal(false);
        } else if (pickerMode === 'folder') {
            const newFolders = myData.folders.map(folder => {
                if (folder.id === currentEditingFolderId) {
                    return { ...folder, works: [...folder.works, artwork.image_url] };
                }
                return folder;
            });
            setMyData(prev => ({ ...prev, folders: newFolders }));
            setImagePickerModal(false);
            setFolderEditModal(true);
        }
    };

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
                localStorage.setItem('myspaceData', JSON.stringify(myData)); 
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

    const currentFolder = myData.folders.find(f => f.id === currentEditingFolderId);

    // 필터링
    const filteredInventory = pickerMode === 'orbit' 
        ? inventory.filter(item => item.type === 'purchased') 
        : inventory;

    return (
        <div className="myspace-setting-page">
            <Header />
            <main className="myspace-container">
                <div className="manage-container">
                    <h2 className="manage-title">프로필 및 스페이스 관리</h2>
                    
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

                    <section className="manage-card">
                        <div className="section-title">아카이빙 폴더 (구매 + 찜 작품)</div>
                        <div className="folder-list">
                            {myData.folders.map(folder => (
                                <div key={folder.id} className="folder-item-edit" onClick={() => openFolderEdit(folder.id)}>
                                    <div className="item-info">
                                        <img src={`${process.env.PUBLIC_URL}${folder.thumb}`} className="item-thumb" alt={folder.name} />
                                        <span style={{fontWeight:'bold'}}>{folder.name}</span>
                                        <span style={{fontSize:'12px', color:'#666', marginLeft:'10px'}}>({folder.works.length}개)</span>
                                    </div>
                                    <i className="fas fa-chevron-right"></i>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="manage-card">
                        <div className="section-title">궤도 작품 (구매한 작품만 가능)</div>
                        <div className="orbit-grid">
                            {myData.orbit.map((imgUrl, index) => (
                                <div key={index} className="orbit-item">
                                    <img src={`${process.env.PUBLIC_URL}${imgUrl}`} alt="orbit" />
                                    <button className="btn-delete-orbit" onClick={() => deleteOrbitWork(index)}><i className="fas fa-minus"></i></button>
                                </div>
                            ))}
                            <div className="orbit-add-btn" onClick={() => openPicker('orbit')}><i className="fas fa-plus"></i></div>
                        </div>
                    </section>

                    <div className="action-buttons">
                        <button className="btn-action btn-cancel" onClick={() => navigate(-1)}>취소</button>
                        <button className="btn-action btn-save" onClick={saveAllData}>저장하기</button>
                    </div>
                </div>
            </main>

            {imagePickerModal && (
                <div className="modal-overlay active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-title">
                                {pickerMode === 'orbit' ? '구매한 작품 선택' : '작품 선택 (구매+찜)'}
                            </span>
                            <button className="modal-close" onClick={() => setImagePickerModal(false)}>&times;</button>
                        </div>
                        <div className="image-picker-grid">
                            {filteredInventory.length > 0 ? (
                                filteredInventory.map((item) => (
                                    <div key={item.id} className="pick-item" onClick={() => pickImage(item)}>
                                        <img src={`${process.env.PUBLIC_URL}${item.image_url}`} className="pick-img" alt={item.title} />
                                        <span className="pick-label">{item.title}</span>
                                    </div>
                                ))
                            ) : (
                                <p style={{padding:'20px'}}>선택할 수 있는 작품이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ★ [수정됨] 폴더 편집 모달: 이름 변경 및 커버 사진 변경 UI 추가 */}
            {folderEditModal && currentFolder && (
                 <div className="modal-overlay active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-title">폴더 설정</span>
                            <button className="modal-close" onClick={() => setFolderEditModal(false)}>&times;</button>
                        </div>
                        
                        {/* 폴더 기본 정보 수정 영역 */}
                        <div className="folder-edit-header" style={{display:'flex', gap:'20px', marginBottom:'20px', paddingBottom:'20px', borderBottom:'1px solid #eee'}}>
                            <div style={{textAlign:'center'}}>
                                <label style={{display:'block', fontSize:'12px', marginBottom:'5px'}}>커버 이미지</label>
                                <div style={{width:'80px', height:'80px', borderRadius:'50%', overflow:'hidden', margin:'0 auto', border:'1px solid #ddd', position:'relative'}}>
                                    <img src={`${process.env.PUBLIC_URL}${currentFolder.thumb}`} alt="cover" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                    {/* 커버 이미지 변경 버튼 (투명한 파일 입력) */}
                                    <label htmlFor={`folderCoverInput-${currentFolder.id}`} style={{
                                        position:'absolute', bottom:0, left:0, width:'100%', background:'rgba(0,0,0,0.5)', 
                                        color:'white', fontSize:'10px', cursor:'pointer', textAlign:'center', padding:'3px 0'
                                    }}>
                                        변경
                                    </label>
                                    <input 
                                        type="file" 
                                        id={`folderCoverInput-${currentFolder.id}`} 
                                        style={{display:'none'}} 
                                        accept="image/*" 
                                        onChange={handleFolderCoverUpload} 
                                    />
                                </div>
                            </div>
                            <div style={{flex:1}}>
                                <label style={{display:'block', fontSize:'12px', marginBottom:'5px'}}>폴더 이름</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={currentFolder.name} 
                                    onChange={handleFolderNameChange}
                                    style={{width:'100%', padding:'8px'}}
                                />
                                <p style={{fontSize:'12px', color:'#999', marginTop:'5px'}}>
                                    현재 담긴 작품: {currentFolder.works.length}개
                                </p>
                            </div>
                        </div>

                        {/* 작품 목록 관리 영역 */}
                        <p style={{marginBottom:'10px', fontWeight:'bold', fontSize:'14px'}}>폴더 내 작품 관리</p>
                        <div className="orbit-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', maxHeight:'250px', overflowY:'auto'}}>
                             {currentFolder.works.map((work, idx) => (
                                <div key={idx} className="orbit-item">
                                    <img src={`${process.env.PUBLIC_URL}${work}`} alt="work" />
                                    <button className="btn-delete-orbit" onClick={() => deleteFolderWork(idx)}>
                                        <i className="fas fa-minus"></i>
                                    </button>
                                </div>
                            ))}
                            <div className="orbit-add-btn" onClick={() => openPicker('folder')}><i className="fas fa-plus"></i></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MySpaceSetting;