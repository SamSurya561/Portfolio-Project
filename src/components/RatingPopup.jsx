import React, { useState } from 'react';
import './RatingPopup.css';
import RatingModal from './RatingModal';

const RatingPopup = ({ showInFooter = false }) => {
    const [selectedRating, setSelectedRating] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    const handleRatingClick = (rating) => {
        setSelectedRating(rating);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRating(0);
    };

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const handleClose = () => {
        setIsClosed(true);
    };

    const renderStars = () => (
        <>
            <input
                value="1"
                name={showInFooter ? "footer-rating" : "rating"}
                type="radio"
                id={showInFooter ? "footer-rating-1" : "rating-1"}
                onChange={() => handleRatingClick(1)}
            />
            <label title="1 stars" htmlFor={showInFooter ? "footer-rating-1" : "rating-1"}>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                </svg>
            </label>

            <input
                value="2"
                name={showInFooter ? "footer-rating" : "rating"}
                type="radio"
                id={showInFooter ? "footer-rating-2" : "rating-2"}
                onChange={() => handleRatingClick(2)}
            />
            <label title="2 stars" htmlFor={showInFooter ? "footer-rating-2" : "rating-2"}>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                </svg>
            </label>

            <input
                value="3"
                name={showInFooter ? "footer-rating" : "rating"}
                type="radio"
                id={showInFooter ? "footer-rating-3" : "rating-3"}
                onChange={() => handleRatingClick(3)}
            />
            <label title="3 stars" htmlFor={showInFooter ? "footer-rating-3" : "rating-3"}>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                </svg>
            </label>

            <input
                value="4"
                name={showInFooter ? "footer-rating" : "rating"}
                type="radio"
                id={showInFooter ? "footer-rating-4" : "rating-4"}
                onChange={() => handleRatingClick(4)}
            />
            <label title="4 stars" htmlFor={showInFooter ? "footer-rating-4" : "rating-4"}>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                </svg>
            </label>

            <input
                value="5"
                name={showInFooter ? "footer-rating" : "rating"}
                type="radio"
                id={showInFooter ? "footer-rating-5" : "rating-5"}
                onChange={() => handleRatingClick(5)}
            />
            <label title="5 stars" htmlFor={showInFooter ? "footer-rating-5" : "rating-5"}>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                </svg>
            </label>
        </>
    );

    // Footer version
    if (showInFooter) {
        return (
            <>
                <div className="footer-rating">
                    <h3>Rate My Website</h3>
                    <div className="radio">
                        {renderStars()}
                    </div>
                </div>

                {showModal && (
                    <RatingModal
                        rating={selectedRating}
                        onClose={handleCloseModal}
                    />
                )}
            </>
        );
    }

    // Floating popup version
    if (isClosed) {
        return null;
    }

    return (
        <>
            <div className={`rating-popup ${isMinimized ? 'minimized' : ''}`}>
                <div className="rating-popup-header">
                    <h3>Rate My Website</h3>
                    <button onClick={handleMinimize} className="minimize-btn">
                        {isMinimized ? '▲' : '▼'}
                    </button>
                    <button onClick={handleClose} className="close-btn">
                        ✕
                    </button>
                </div>

                {!isMinimized && (
                    <div className="rating-popup-content">
                        <div className="radio">
                            {renderStars()}
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <RatingModal
                    rating={selectedRating}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default RatingPopup;
