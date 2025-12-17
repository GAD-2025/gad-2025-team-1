import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { Link, useLocation } from 'react-router-dom';
import './MySpaceNode.css';

const MySpaceNode = () => {
    const location = useLocation();
    const { nodeData } = location.state || {}; 
    
    // DB 데이터 상태
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);

    // UI 상태
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedId, setSelectedId] = useState(null); // ★ 현재 선택된 노드 ID

    // 드래그 상태
    const [draggingId, setDraggingId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    // 1. 초기 데이터 로드
    useEffect(() => {
        const artworkId = nodeData?.id ? nodeData.id : 1; 

        setIsLoading(true);
        setError(null);

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/nodes/${artworkId}`)
            .then(res => {
                if (!res.ok) throw new Error("서버 응답 실패");
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    const mappedNodes = data.nodes.map(n => ({
                        ...n,
                        top: n.position_y,
                        left: n.position_x,
                        img: n.type === 'original' ? (nodeData?.img || '/images/art_1.jpg') : null 
                    }));
                    setNodes(mappedNodes);
                    setConnections(data.connections);
                } else {
                    throw new Error(data.message || "데이터 불러오기 실패");
                }
            })
            .catch(err => {
                console.error("데이터 로드 에러:", err);
                setError("데이터를 불러오지 못했습니다. (DB 연결 및 포트 5000번 확인)");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [nodeData]);

    // 2. 연결선 그리기
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg || nodes.length === 0) return;

        svg.innerHTML = ''; 

        requestAnimationFrame(() => {
            connections.forEach(conn => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);

                const fromEl = document.getElementById(`node-${conn.from}`);
                const toEl = document.getElementById(`node-${conn.to}`);

                if (fromEl && toEl) {
                    const x1 = fromEl.offsetLeft + fromEl.offsetWidth / 2;
                    const y1 = fromEl.offsetTop + fromEl.offsetHeight / 2;
                    const x2 = toEl.offsetLeft + toEl.offsetWidth / 2;
                    const y2 = toEl.offsetTop + toEl.offsetHeight / 2;

                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', x1);
                    line.setAttribute('y1', y1);
                    line.setAttribute('x2', x2);
                    line.setAttribute('y2', y2);
                    line.setAttribute('stroke', '#FF5900');
                    line.setAttribute('stroke-width', '2');
                    svg.appendChild(line);
                }
            });
        });
    }, [nodes, connections]);

    // ★ Delete 키 이벤트 리스너 추가
    useEffect(() => {
        const handleKeyDown = async (e) => {
            if (e.key === 'Delete' && selectedId !== null) {
                // 삭제 확인
                if (window.confirm("선택한 노드를 삭제하시겠습니까?")) {
                    try {
                        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/nodes/${selectedId}`, {
                            method: 'DELETE'
                        });
                        const data = await res.json();
                        
                        if (data.success) {
                            // 프론트엔드 상태 업데이트 (노드 제거)
                            setNodes(prev => prev.filter(n => n.id !== selectedId));
                            // 연결선도 제거 (해당 노드와 연결된 선)
                            setConnections(prev => prev.filter(c => c.from !== selectedId && c.to !== selectedId));
                            setSelectedId(null);
                        } else {
                            alert("삭제 실패: " + data.message);
                        }
                    } catch (err) {
                        console.error(err);
                        alert("서버 통신 오류로 삭제 실패");
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId]);

    // --- 드래그 핸들러 ---
    const handleMouseDown = (e, id) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        
        const node = nodes.find(n => n.id === id);
        if (!node) return;

        setSelectedId(id); // ★ 클릭 시 노드 선택
        setDraggingId(id);
        setDragOffset({
            x: e.clientX - node.left,
            y: e.clientY - node.top
        });
    };

    const handleMouseMove = (e) => {
        if (draggingId === null) return;
        e.preventDefault();

        const newLeft = e.clientX - dragOffset.x;
        const newTop = e.clientY - dragOffset.y;

        setNodes(prevNodes => prevNodes.map(node => 
            node.id === draggingId 
                ? { ...node, left: newLeft, top: newTop } 
                : node
        ));
    };

    const handleMouseUp = () => {
        setDraggingId(null);
    };
    
    // 배경 클릭 시 선택 해제
    const handleBackgroundClick = (e) => {
        if (e.target === containerRef.current || e.target === svgRef.current) {
            setSelectedId(null);
        }
    };

    // --- 메모 추가 핸들러 ---
    const handleDoubleClick = async (e) => {
        if (draggingId !== null || e.target.closest('.node')) return;

        const text = window.prompt("새로운 메모를 입력하세요:");
        if (!text) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;

        const newMemoData = {
            postId: nodeData?.id || 1, 
            type: 'memo',
            title: 'Memo',
            content: text,
            x: Math.round(x),
            y: Math.round(y)
        };

        try {
            const res = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/nodes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMemoData)
            });
            const data = await res.json();
            
            if (data.success) {
                const newNode = {
                    ...data.newNode,
                    top: data.newNode.position_y,
                    left: data.newNode.position_x
                };
                setNodes(prev => [...prev, newNode]);
                setSelectedId(data.newNode.id); // 생성 후 자동 선택
            }
        } catch (err) {
            console.error(err);
            alert("메모 저장 실패");
        }
    };

    const renderNode = (node) => {
        const isSelected = selectedId === node.id;
        const commonStyle = { 
            top: node.top, 
            left: node.left,
            position: 'absolute', 
            cursor: 'grab', 
            userSelect: 'none', 
            zIndex: draggingId === node.id ? 100 : (isSelected ? 10 : 1), // ★ 선택/드래그 시 위로 올라오도록
            border: isSelected ? '2px solid #FF5900' : 'none', // ★ 선택 시 테두리 표시
            boxShadow: isSelected ? '0 0 10px rgba(255, 89, 0, 0.5)' : 'none'
        };

        const onMouseDown = (e) => handleMouseDown(e, node.id);

        switch (node.type) {
            case 'original':
                return (
                    <div 
                        id={`node-${node.id}`} 
                        className="node original-node" 
                        style={commonStyle}
                        onMouseDown={onMouseDown}
                    >
                        <div className="node-image-wrapper">
                            <img src={`${process.env.PUBLIC_URL}${node.img}`} alt="원본" draggable="false" />
                        </div>
                        <div className="node-prompt-area">
                            <h3 className="node-title">{node.title}</h3>
                            <p className="prompt-text">{node.content}</p>
                        </div>
                        <button className="detail-button">자세히 보기</button>
                    </div>
                );
            case 'modified':
                return (
                    <div 
                        id={`node-${node.id}`} 
                        className="node modified-node" 
                        style={commonStyle}
                        onMouseDown={onMouseDown}
                    >
                        <h3 className="node-title">{node.title}</h3>
                        <p className="prompt-text">{node.content}</p>
                    </div>
                );
            case 'memo':
                 return (
                    <div 
                        id={`node-${node.id}`} 
                        className="node modified-node mini-memo-box" 
                        style={commonStyle}
                        onMouseDown={onMouseDown}
                    >
                        {node.content}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="myspace-node-page">
            <Header />

            <main className="node-page-container">
                <div className="path-display">
                    <Link to="/myspace" className="path-before">My Space</Link>
                    <span className="path-separator">&gt;</span>
                    <span className="path-item active-folder">Project Flow</span>
                </div>

                <div 
                    id="nodeMap" 
                    className="node-map-area" 
                    ref={containerRef}
                    onDoubleClick={handleDoubleClick}
                    onMouseMove={handleMouseMove} 
                    onMouseUp={handleMouseUp}     
                    onMouseDown={handleBackgroundClick} // 배경 클릭 시 선택 해제
                    onMouseLeave={handleMouseUp}  
                >
                    {/* ★ SVG의 z-index를 0으로 설정하여 노드보다 뒤로 보냄 */}
                    <svg ref={svgRef} className="connectors-svg" style={{ zIndex: 0 }}></svg>
                    
                    {isLoading ? (
                        <div className="status-message">로딩 중...</div>
                    ) : error ? (
                        <div className="status-message error">{error}</div>
                    ) : nodes.length === 0 ? (
                        <div className="status-message">
                            데이터가 없습니다.<br/>
                            <small>(MySQL에서 SQL 스크립트를 실행했는지 확인해주세요)</small>
                        </div>
                    ) : (
                        nodes.map(node => <React.Fragment key={node.id}>{renderNode(node)}</React.Fragment>)
                    )}
                </div>
            </main>
        </div>
    );
};

export default MySpaceNode;