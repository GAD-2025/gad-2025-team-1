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

    // 드래그 기능을 위한 상태
    const [draggingId, setDraggingId] = useState(null); // 현재 드래그 중인 노드 ID
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // 마우스와 노드 왼쪽 상단 사이의 거리
    
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    // 1. 초기 데이터 로드
    useEffect(() => {
        // nodeData.id(artwork_id)가 있으면 사용, 없으면 1번(테스트용)
        const artworkId = nodeData?.id ? nodeData.id : 1; 

        if (artworkId) {
            fetch(`http://localhost:5000/api/nodes/${artworkId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const mappedNodes = data.nodes.map(n => ({
                            ...n,
                            top: n.position_y,
                            left: n.position_x,
                            // 원본인 경우 이미지 표시 (없으면 기본 이미지)
                            img: n.type === 'original' ? (nodeData?.img || '/images/art_1.jpg') : null 
                        }));
                        setNodes(mappedNodes);
                        setConnections(data.connections);
                    }
                })
                .catch(err => console.error("데이터 로드 실패:", err));
        }
    }, [nodeData]);

    // 2. 연결선 그리기 (노드 위치가 바뀔 때마다 다시 그리기)
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg || nodes.length === 0) return;

        svg.innerHTML = ''; 

        // 노드 렌더링이 완료된 후 좌표를 계산하기 위해 requestAnimationFrame 사용
        requestAnimationFrame(() => {
            connections.forEach(conn => {
                // DB의 id와 DOM의 id 매칭
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);

                // DOM 요소를 직접 찾지 않고 상태값 기반으로 계산 (더 부드러운 움직임)
                // 만약 DOM 크기가 동적이라면 getElementById를 써야하지만, 여기선 상태값+고정크기 가정 or DOM fallback
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

    // --- 드래그 핸들러 ---
    const handleMouseDown = (e, id) => {
        e.stopPropagation(); // 배경 더블클릭 방지 및 상위 이벤트 차단
        
        const node = nodes.find(n => n.id === id);
        if (!node) return;

        setDraggingId(id);
        setDragOffset({
            x: e.clientX - node.left,
            y: e.clientY - node.top
        });
    };

    const handleMouseMove = (e) => {
        if (draggingId === null) return;

        const newLeft = e.clientX - dragOffset.x;
        const newTop = e.clientY - dragOffset.y;

        setNodes(prevNodes => prevNodes.map(node => 
            node.id === draggingId 
                ? { ...node, left: newLeft, top: newTop } 
                : node
        ));
    };

    const handleMouseUp = () => {
        if (draggingId !== null) {
            // TODO: 여기서 변경된 위치(left, top)를 DB에 저장하는 API 호출을 추가할 수 있습니다.
            // updateNodePosition(draggingId, newX, newY);
            setDraggingId(null);
        }
    };

    // --- 메모 추가 핸들러 (더블 클릭) ---
    const handleDoubleClick = async (e) => {
        // 드래그 중이거나 노드 위에서 더블클릭한 경우 무시
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
            const res = await fetch('http://localhost:5000/api/nodes', {
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
            }
        } catch (err) {
            console.error(err);
            alert("메모 저장 실패");
        }
    };

    const renderNode = (node) => {
        const commonStyle = { 
            top: node.top, 
            left: node.left,
            position: 'absolute', // CSS 클래스에 있어도 명시
            cursor: 'grab' // 드래그 가능 커서
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
                    onMouseMove={handleMouseMove} // 컨테이너에서 마우스 움직임 감지
                    onMouseUp={handleMouseUp}     // 컨테이너에서 마우스 뗌 감지
                    onMouseLeave={handleMouseUp}  // 영역 밖으로 나가면 드래그 종료
                >
                    <svg ref={svgRef} className="connectors-svg"></svg>
                    {nodes.map(node => <React.Fragment key={node.id}>{renderNode(node)}</React.Fragment>)}
                    
                    {nodes.length === 0 && (
                        <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', color:'#999'}}>
                            로딩 중이거나 데이터가 없습니다...
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MySpaceNode;