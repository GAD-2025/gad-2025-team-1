import React, { useState } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import './MySpaceFolder.css';

const MySpaceFolder = () => {
    const [modalImage, setModalImage] = useState(null);

    const images = [
        "../../frontend/images/wish_1.jpg",
        "../../frontend/images/wish_2.jpg",
        "../../frontend/images/wish_3.jpg",
        "../../frontend/images/wish_4.jpg",
        "../../frontend/images/wish_5.jpg",
        "../../frontend/images/wish_6.jpg",
    ];

    const openModal = (image) => {
        setModalImage(image);
    };

    const closeModal = () => {
        setModalImage(null);
    };

    return (
        <div className="myspace-folder-page">
            <Header />

            <main className="archive-container">
                <div className="path-display">
                    <Link to="/myspace" className="path-before">김민지's space</Link>
                    <span className="path-separator">&gt;</span>
                    <Link to="#" className="path-item active-folder">WISH</Link>
                </div>

                <section className="artwork-grid">
                    {images.map((imgSrc, index) => (
                        <div key={index} className="grid-item" onClick={() => openModal(imgSrc)}>
                            <img src={`${process.env.PUBLIC_URL}${imgSrc.replace('../../frontend', '')}`} alt={`작품 ${index + 1}`} />
                        </div>
                    ))}
                </section>
            </main>

            {modalImage && (
                <div id="imageModal" className="modal" style={{ display: 'flex' }} onClick={closeModal}>
                    <div className="modal-content">
                        <img id="modalImage" src={`${process.env.PUBLIC_URL}${modalImage.replace('../../frontend', '')}`} alt="확대된 작품" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MySpaceFolder;
