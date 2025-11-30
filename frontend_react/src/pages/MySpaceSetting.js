import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import './MySpaceSetting.css';

const MySpaceSetting = () => {
    const navigate = useNavigate();

    const defaultData = {
        name: "김민지",
        bio: "창작을 좋아하는 열정가득 대학생입니다",
        img: "/images/White Cats.jpg",
        folders: [
            { id: 1, name: "WISH", thumb: "/images/folder_1.jpg", works: [] },
            { id: 2, name: "My Work", thumb: "/images/folder_2.jpg", works: [] },
            { id: 3, name: "ART", thumb: "/images/folder_3.jpg", works: [] }
        ],
        orbit: [
            "/images/art_5.jpg",
            "/images/art_6.jpg",
            "/images/art_7.jpg",
            "/images/art_1.jpg",
            "/images/art_2.jpg"
        ]
    };
    
    const availableImages = [
        "/images/art_1.jpg", "/images/art_2.jpg",
        "/images/art_3.jpg", "/images/art_4.jpg",
        "/images/art_5.jpg", "/images/art_6.jpg",
        "/images/art_7.jpg", "/images/White Cats.jpg"
    ];

    const [myData, setMyData] = useState(defaultData);
    const [imagePickerModal, setImagePickerModal] = useState(false);
    const [folderEditModal, setFolderEditModal] = useState(false);
    const [pickerMode, setPickerMode] = useState(''); // 'orbit' or 'folder'
    const [currentEditingFolderId, setCurrentEditingFolderId] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('myspaceData');
        if (savedData) {
            setMyData(JSON.parse(savedData));
        }
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === 'inputName') {
            setMyData(prev => ({...prev, name: value}));
        } else if (id === 'inputBio') {
            setMyData(prev => ({...prev, bio: value}));
        }
    };
    
    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setMyData(prev => ({...prev, img: event.target.result}));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const deleteOrbitWork = (index) => {
        if (window.confirm('이 작품을 궤도에서 내리시겠습니까?')) {
            const newOrbit = [...myData.orbit];
            newOrbit.splice(index, 1);
            setMyData(prev => ({ ...prev, orbit: newOrbit }));
        }
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
        if (mode === 'folder') {
            setFolderEditModal(false);
        }
        setImagePickerModal(true);
    };
    
    const pickImage = (src) => {
        if (pickerMode === 'orbit') {
            setMyData(prev => ({ ...prev, orbit: [...prev.orbit, src] }));
            setImagePickerModal(false);
        } else if (pickerMode === 'folder') {
            const newFolders = myData.folders.map(folder => {
                if (folder.id === currentEditingFolderId) {
                    return { ...folder, works: [...folder.works, src] };
                }
                return folder;
            });
            setMyData(prev => ({ ...prev, folders: newFolders }));
            setImagePickerModal(false);
            setFolderEditModal(true);
        }
    };

    const saveAllData = () => {
        localStorage.setItem('myspaceData', JSON.stringify(myData));
        alert('저장되었습니다! 마이 스페이스로 이동합니다.');
        navigate('/myspace');
    };

    const currentFolder = myData.folders.find(f => f.id === currentEditingFolderId);

    return (
        <div className="myspace-setting-page">
             <Header />

            <main className="myspace-container">
                <div className="manage-container">
                    <h2 className="manage-title">프로필 관리</h2>

                    <section className="manage-card">
                        <div className="section-title">기본 정보</div>
                        <div className="basic-info-grid">
                            <div className="profile-img-edit">
                                <img src={myData.img} alt="프로필" className="profile-img-preview user-img-target" id="previewImg" />
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
                        <div className="section-title">아카이빙 폴더 관리 <small>(클릭하여 내용 편집)</small></div>
                        <div className="folder-list">
                            {myData.folders.map(folder => (
                                <div key={folder.id} className="folder-item-edit" onClick={() => openFolderEdit(folder.id)}>
                                    <div className="item-info">
                                        <img src={`${process.env.PUBLIC_URL}${folder.thumb}`} className="item-thumb" alt={folder.name} />
                                        <span style={{fontWeight:'bold'}}>{folder.name}</span>
                                    </div>
                                    <i className="fas fa-chevron-right" style={{color:'#ccc'}}></i>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="manage-card">
                        <div className="section-title">대표 작품 관리 (Orbit) <small>(마우스를 올려 삭제)</small></div>
                        <div className="orbit-grid">
                            {myData.orbit.map((imgUrl, index) => (
                                <div key={index} className="orbit-item">
                                    <img src={`${process.env.PUBLIC_URL}${imgUrl}`} alt={`orbit-${index}`} />
                                    <button className="btn-delete-orbit" onClick={() => deleteOrbitWork(index)}>
                                        <i className="fas fa-minus"></i>
                                    </button>
                                </div>
                            ))}
                            <div className="orbit-add-btn" onClick={() => openPicker('orbit')}><i className="fas fa-plus"></i></div>
                        </div>
                    </section>

                    <div className="action-buttons">
                        <button className="btn-action btn-cancel" onClick={() => navigate(-1)}>취소</button>
                        <button className="btn-action btn-save" onClick={saveAllData}>저장하고 적용하기</button>
                    </div>
                </div>
            </main>

            {imagePickerModal && (
                <div className="modal-overlay active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-title">작품 선택</span>
                            <button className="modal-close" onClick={() => setImagePickerModal(false)}>&times;</button>
                        </div>
                        <div className="image-picker-grid">
                            {availableImages.map((src, index) => (
                                <img key={index} src={`${process.env.PUBLIC_URL}${src}`} className="pick-img" alt={`pick-${index}`} onClick={() => pickImage(src)} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {folderEditModal && currentFolder && (
                 <div className="modal-overlay active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-title">{`'${currentFolder.name}' 폴더 관리`}</span>
                            <button className="modal-close" onClick={() => setFolderEditModal(false)}>&times;</button>
                        </div>
                        <p style={{marginBottom:'10px'}}>폴더 내 작품:</p>
                        <div className="orbit-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
                             {currentFolder.works.map((work, idx) => (
                                <div key={idx} className="orbit-item">
                                    <img src={`${process.env.PUBLIC_URL}${work}`} alt={`folder-work-${idx}`} />
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
