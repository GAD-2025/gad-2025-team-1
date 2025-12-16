import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// dnd-kit 라이브러리 임포트 (드래그 앤 드롭 기능 필수)
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- [하위 컴포넌트들] ---

// 1. 드래그 가능한 아이템 (인벤토리 및 궤도 내 작품)
const DraggableItem = ({ id, image, type, isOverlay }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { type, image } // 드래그 시 전달할 데이터
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 999 : 'auto',
        opacity: isDragging && !isOverlay ? 0.3 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none'
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="relative group">
            <div className={`rounded-full overflow-hidden border-2 ${type === 'purchased' ? 'border-orange-500' : 'border-pink-500'} shadow-lg hover:scale-110 transition-transform`}>
                <img src={image} alt="artwork" className="w-16 h-16 object-cover" 
                     onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=No+Image' }} />
            </div>
        </div>
    );
};

// 2. 드롭 가능한 영역 (궤도)
const DroppableOrbit = ({ id, children, isActive }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    const borderColor = isOver ? 'border-orange-400' : isActive ? 'border-orange-600' : 'border-gray-700';
    const borderSize = isActive ? 'border-2' : 'border';

    return (
        <div ref={setNodeRef} className={`absolute rounded-full border-dashed ${borderSize} ${borderColor} flex items-center justify-center transition-colors`}
             style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
             {/* 실제 아이템이 놓일 컨테이너 (포인터 이벤트 활성화) */}
            <div className="relative w-full h-full" style={{ pointerEvents: 'auto' }}>
                {children}
            </div>
        </div>
    );
};

// 3. 폴더 컴포넌트 (여기도 드롭 가능)
const Folder = ({ folder, onClick }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `folder-${folder.id}`,
        data: { type: 'folder', folderId: folder.id }
    });

    // 폴더 커버 이미지 결정 (폴더 내 첫 번째 작품 or 기본 이미지)
    const coverImage = folder.works && folder.works.length > 0 ? folder.works[0] : folder.thumb;

    return (
        <div ref={setNodeRef} onClick={onClick} className={`relative bg-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/20 transition group border-2 ${isOver ? 'border-orange-500' : 'border-transparent'}`}>
            {/* 폴더 내 작품 미리보기 (최대 4개) */}
            <div className="grid grid-cols-2 gap-2 mb-3 pointer-events-none">
                {folder.works && folder.works.slice(0, 4).map((workImg, idx) => (
                    <img key={idx} src={workImg} alt="work" className="w-full h-full object-cover rounded-lg aspect-square" />
                ))}
                {(!folder.works || folder.works.length === 0) && (
                     <img src={coverImage} alt="cover" className="col-span-2 w-full h-full object-cover rounded-lg aspect-square opacity-50" />
                )}
            </div>
            <h3 className="text-center font-bold truncate text-white group-hover:text-orange-400">{folder.name}</h3>
            <span className="absolute top-2 right-2 bg-black/50 text-xs px-2 py-1 rounded-full">{folder.works ? folder.works.length : 0}</span>
        </div>
    );
};


// ==================================================================================
// [메인 컴포넌트] MySpace
// ==================================================================================
const MySpace = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // --- State ---
    const [orbitItems, setOrbitItems] = useState([]); // 궤도에 배치된 아이템
    const [folders, setFolders] = useState([]);       // 폴더 목록
    const [inventory, setInventory] = useState([]);   // 하단 인벤토리 아이템
    const [activeId, setActiveId] = useState(null);   // 현재 드래그 중인 아이템 ID

    // 드래그 센서 설정 (부드러운 동작을 위해 PointerSensor 사용)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 } // 8px 이상 움직여야 드래그 시작
        })
    );

    // --- [데이터 가져오기] ---
    const fetchMySpaceData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/myspace/${user.username}`);
            if (response.data.success) {
                setFolders(response.data.folders);
                
                // DB 데이터를 프론트엔드용 State로 변환
                const mappedOrbit = response.data.orbit.map((imgUrl, index) => ({
                    id: `orbit-item-${index}-${Date.now()}`,
                    image: imgUrl,
                    type: 'purchased' // 일단 구매품으로 가정
                }));
                setOrbitItems(mappedOrbit);

                const mappedInventory = response.data.inventory.map(item => ({
                    id: `inv-item-${item.id}`,
                    dbId: item.id, // 실제 DB ID
                    image: item.image_url,
                    title: item.title,
                    type: 'purchased'
                }));
                setInventory(mappedInventory);
            }
        } catch (error) {
            console.error("마이스페이스 데이터 로딩 실패:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchMySpaceData();
        }
    }, [user, fetchMySpaceData]);

    // --- [저장하기 핸들러] ---
    const handleSave = async () => {
        if (!user) return;
        try {
            // 현재 State를 DB에 저장할 형태로 변환
            const payload = {
                id: user.username, // 유저 ID
                name: user.nickname, bio: user.bio, img: user.profile_image, // 기본 정보
                folders: folders.map(f => ({
                    name: f.name,
                    thumb: f.thumb,
                    works: f.works || [] // 폴더 안의 이미지 URL 배열
                })),
                orbit: orbitItems.map(item => item.image) // 궤도 아이템의 이미지 URL 배열
            };

            const response = await axios.put('http://localhost:5000/api/myspace/save', payload);
            if (response.data.success) {
                alert("마이스페이스가 저장되었습니다! 💾");
            } else {
                alert("저장에 실패했습니다.");
            }
        } catch (error) {
            console.error("저장 오류:", error);
            alert("서버 오류로 저장하지 못했습니다.");
        }
    };


    // --- [DND 핸들러] ---
    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return; // 드롭 대상이 없으면 취소

        // 1. 드래그된 아이템 찾기 (인벤토리 or 궤도)
        let draggedItem = inventory.find(item => item.id === active.id) || 
                          orbitItems.find(item => item.id === active.id);

        if (!draggedItem && active.data.current) {
             // active.data.current에서 정보 복원 (안전장치)
             draggedItem = {
                id: active.id,
                image: active.data.current.image,
                type: active.data.current.type
             };
        }
        if (!draggedItem) return;

        // 2. 드롭 대상 확인 및 처리

        // case A: 폴더에 드롭
        if (over.id.startsWith('folder-')) {
            const folderId = over.data.current.folderId;
            setFolders(prevFolders => prevFolders.map(folder => {
                if (folder.id === folderId) {
                    // 이미 있는 작품인지 확인
                    if (folder.works && folder.works.includes(draggedItem.image)) {
                        return folder; // 중복 방지
                    }
                    return {
                        ...folder,
                        works: [...(folder.works || []), draggedItem.image]
                    };
                }
                return folder;
            }));
            // (선택사항) 폴더로 들어가면 인벤토리/궤도에서 제거하고 싶으면 여기서 처리
        } 
        // case B: 궤도 영역에 드롭
        else if (over.id === 'orbit-zone') {
            // 이미 궤도에 있는 아이템이 아니라면 추가
            if (!orbitItems.find(item => item.id === draggedItem.id)) {
                 // 새 ID 부여하여 궤도에 추가 (인벤토리에서 온 경우)
                 const newItem = { ...draggedItem, id: `orbit-${Date.now()}` };
                 setOrbitItems(prev => [...prev, newItem]);
                 // (선택사항) 인벤토리에서 제거하고 싶으면:
                 // setInventory(prev => prev.filter(item => item.id !== draggedItem.id));
            }
        }
        // case C: 인벤토리 영역(쓰레기통 역할)에 드롭 -> 궤도에서 제거
        else if (over.id === 'inventory-zone') {
            if (orbitItems.find(item => item.id === draggedItem.id)) {
                 setOrbitItems(prev => prev.filter(item => item.id !== draggedItem.id));
                 // (선택사항) 다시 인벤토리로 복구하고 싶으면 여기서 추가 로직 필요
            }
        }
    };

    // 폴더 추가 더미 함수
    const addFolder = () => {
        const newId = folders.length > 0 ? Math.max(...folders.map(f => f.id)) + 1 : 1;
        setFolders([...folders, { id: newId, name: `Folder ${newId}`, thumb: '/images/default.jpg', works: [] }]);
    };


    if (isLoading && !user) return <div className="text-white text-center py-20">로딩 중...</div>;
    if (!user) return <div className="text-white text-center py-20">로그인이 필요합니다.</div>;


    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {/* ★ 배경 이미지 변경 및 기존 레이아웃 유지 */}
            <div className="myspace-page min-h-screen text-white relative overflow-hidden select-none">
                {/* 배경: 요청하신 배경2.png 적용 */}
                <div 
                    className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none"
                    style={{ 
                        backgroundImage: `url('/images/배경2.png')`, 
                        opacity: 0.8 // 배경 밝기 조절 (필요시 수정)
                    }}
                ></div>
                 {/* 어두운 오버레이 (컨텐츠 가독성용) */}
                <div className="fixed inset-0 z-0 bg-black/50 pointer-events-none"></div>

                <Header />

                <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 flex gap-8 h-[calc(100vh-64px)]">
                    
                    {/* --- [좌측] 궤도 시스템 (Droppable Zone) --- */}
                    <section className="flex-1 relative flex items-center justify-center">
                         <DroppableOrbit id="orbit-zone" isActive={activeId !== null}>
                            {/* 중심부 (프로필) */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-500 shadow-[0_0_20px_rgba(255,165,0,0.5)] mb-2 relative z-30 bg-black">
                                    <img src={user.profile_image || "/images/default.jpg"} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <h2 className="text-xl font-bold text-white drop-shadow-md">{user.nickname}</h2>
                                <p className="text-orange-400 text-sm">{user.bio || '나만의 우주를 꾸며보세요!'}</p>
                            </div>

                            {/* 궤도 아이템들 배치 */}
                            {orbitItems.map((item, index) => {
                                const total = orbitItems.length;
                                const angle = (360 / total) * index; // 균등 배치
                                const radius = 200; // 반지름
                                const x = Math.cos((angle * Math.PI) / 180) * radius;
                                const y = Math.sin((angle * Math.PI) / 180) * radius;

                                return (
                                    <div key={item.id} className="absolute left-1/2 top-1/2 z-30"
                                         style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}>
                                        <DraggableItem id={item.id} image={item.image} type={item.type} />
                                    </div>
                                );
                            })}
                         </DroppableOrbit>
                    </section>

                    {/* --- [우측] 폴더 및 인벤토리 --- */}
                    <section className="w-96 flex flex-col gap-6 bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/10 overflow-hidden">
                        
                        {/* 1. 폴더 영역 */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    📁 My Folders
                                </h3>
                                <div className="flex gap-2">
                                    <button onClick={addFolder} className="text-sm bg-gray-800 px-3 py-1 rounded hover:bg-gray-700 transition">+ New</button>
                                    <button onClick={handleSave} className="text-sm bg-orange-600 px-3 py-1 rounded font-bold hover:bg-orange-700 transition ml-auto">Save Space</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {folders.map(folder => (
                                    <Folder key={folder.id} folder={folder} onClick={() => alert(`'${folder.name}' 열기 (구현 예정)`)} />
                                ))}
                            </div>
                        </div>
                        
                        <div className="border-t border-white/10 my-2"></div>

                        {/* 2. 인벤토리 영역 (Draggable Sources & Droppable Target for remove) */}
                        <div className="flex-1 flex flex-col min-h-0">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                📦 Inventory <span className="text-xs text-gray-400 font-normal">(Drag to Orbit/Folder)</span>
                            </h3>
                            
                            {/* 인벤토리 영역을 Droppable로 만들어서 궤도에서 드래그해오면 삭제되도록 함 */}
                            <useDroppable id="inventory-zone">
                                {(droppableProps) => (
                                    <div ref={droppableProps.setNodeRef} className={`flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-4 gap-3 content-start p-2 rounded-xl transition ${droppableProps.isOver ? 'bg-red-500/20 border-red-500' : ''}`}
                                         style={{ border: droppableProps.isOver ? '2px dashed' : 'none' }}>
                                        {inventory.map(item => (
                                            <DraggableItem key={item.id} id={item.id} image={item.image} type={item.type} />
                                        ))}
                                        {inventory.length === 0 && (
                                            <p className="col-span-4 text-center text-gray-500 py-10">보유한 작품이 없습니다.</p>
                                        )}
                                    </div>
                                )}
                            </useDroppable>
                        </div>
                    </section>
                </main>

                {/* 드래그 중일 때 따라다니는 잔상 (Overlay) */}
                <DragOverlay>
                    {activeId ? (
                        <DraggableItem 
                            id={activeId} 
                            image={(inventory.find(i => i.id === activeId) || orbitItems.find(i => i.id === activeId))?.image} 
                            type="overlay" 
                            isOverlay 
                        />
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
};

export default MySpace;