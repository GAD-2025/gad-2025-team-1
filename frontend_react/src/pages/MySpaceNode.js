import React, { useEffect, useRef } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import './MySpaceNode.css';

const MySpaceNode = () => {
    const nodes = [
        { id: "art1", top: 100, left: 50, type: 'original', title: "ART 1", prompt: "A mystical close-up scene of a pair of elegant hands placed gently over a glowing purple crystal ball. The hands are adorned with chunky gold rings and painted nails in a deep plum tone.", img: "/images/art_6.jpg" },
        { id: "p1", top: 100, left: 450, type: 'modified', title: "Project 1", prompt: "A mystical close-up scene of a pair of elegant hands placed gently over a glowing purple crystal ball. The hands are adorned with chunky gold rings and painted nails in a deep plum tone." },
        { id: "p1-1", top: 50, left: 780, type: 'memo', text: "색상 수정" },
        { id: "p1-1-proj", top: 150, left: 780, type: 'modified', title: "Project 1-1", prompt: "A mystical close-up scene of a pair of elegant hands placed gently over a glowing purple crystal ball. The hands are adorned with chunky gold rings and painted nails in a deep plum tone." },
        { id: "p2", top: 350, left: 450, type: 'modified', title: "Project 2", prompt: "A mystical close-up scene of a pair of elegant hands placed gently over a glowing purple crystal ball. The hands are adorned with chunky gold rings and painted nails in a deep plum tone." },
        { id: "p2-1-memo", top: 300, left: 780, type: 'memo', text: "배경 수정" },
        { id: "p2-1-proj", top: 400, left: 780, type: 'modified', title: "Project 2-1", prompt: "A mystical close-up scene of a pair of elegant hands placed gently over a glowing purple crystal ball. The hands are adorned with chunky gold rings and painted nails in a deep plum tone." },
        { id: "p2-2-memo", top: 550, left: 630, type: 'memo', text: "사람 손 추가" },
        { id: "p2-2-proj", top: 600, left: 780, type: 'modified', title: "Project 2-2", prompt: "A mystical close-up scene of a pair of elegant hands placed gently over a glowing purple crystal ball. The hands are adorned with chunky gold rings and painted nails in a deep plum tone." }
    ];

    const connections = [
        { from: 'art1', to: 'p1' },
        { from: 'art1', to: 'p2' },
        { from: 'p1', to: 'p1-1' },
        { from: 'p1-1', to: 'p1-1-proj' },
        { from: 'p2', to: 'p2-1-memo' },
        { from: 'p2-1-memo', to: 'p2-1-proj' },
        { from: 'p2', to: 'p2-2-memo' },
        { from: 'p2-2-memo', to: 'p2-2-proj' }
    ];

    const svgRef = useRef(null);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        svg.innerHTML = ''; // Clear previous lines

        connections.forEach(conn => {
            const fromNode = document.getElementById(`node-${conn.from}`);
            const toNode = document.getElementById(`node-${conn.to}`);

            if (fromNode && toNode) {
                const x1 = fromNode.offsetLeft + fromNode.offsetWidth / 2;
                const y1 = fromNode.offsetTop + fromNode.offsetHeight / 2;
                const x2 = toNode.offsetLeft + toNode.offsetWidth / 2;
                const y2 = toNode.offsetTop + toNode.offsetHeight / 2;

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
    }, [nodes, connections]);

    const renderNode = (node) => {
        switch (node.type) {
            case 'original':
                return (
                    <div id={`node-${node.id}`} className="node original-node" style={{ top: node.top, left: node.left }}>
                        <div className="node-image-wrapper">
                            <img src={`${process.env.PUBLIC_URL}${node.img}`} alt="원본 작품 이미지" />
                        </div>
                        <div className="node-prompt-area">
                            <h3 className="node-title">{node.title}</h3>
                            <p className="prompt-text">{node.prompt}</p>
                        </div>
                        <br />
                        <button className="detail-button">자세히 보기</button>
                    </div>
                );
            case 'modified':
                return (
                    <div id={`node-${node.id}`} className="node modified-node" style={{ top: node.top, left: node.left }}>
                        <h3 className="node-title">{node.title}</h3>
                        <p className="prompt-text">{node.prompt}</p>
                    </div>
                );
            case 'memo':
                 return (
                    <div id={`node-${node.id}`} className="node modified-node mini-memo-box" style={{ top: node.top, left: node.left }}>
                        {node.text}
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
                    <Link to="/myspace" className="path-before">김민지's space</Link>
                    <span className="path-separator">&gt;</span>
                    <a href="#" className="path-item active-folder">ART 1</a>
                </div>

                <div id="nodeMap" className="node-map-area">
                    <svg ref={svgRef} className="connectors-svg"></svg>
                    {nodes.map(node => <React.Fragment key={node.id}>{renderNode(node)}</React.Fragment>)}
                </div>
            </main>
        </div>
    );
};

export default MySpaceNode;
