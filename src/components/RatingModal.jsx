import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './RatingModal.css';

const RatingModal = ({ rating, onClose }) => {
    const [name, setName] = useState('');
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !review.trim()) {
            alert('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);

        try {
            await addDoc(collection(db, 'ratings'), {
                name: name.trim(),
                rating: rating,
                review: review.trim(),
                timestamp: serverTimestamp(),
                createdAt: new Date().toISOString()
            });

            setShowSuccess(true);

            // Close modal after 2 seconds
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Error submitting rating:', error);
            console.error('Error details:', error.message);
            alert(`Failed to submit rating: ${error.message}`);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rating-modal-overlay" onClick={onClose}>
            <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
                {showSuccess ? (
                    <div className="success-message">
                        <div className="success-icon">✓</div>
                        <h2>Thank You!</h2>
                        <p>Your rating has been submitted successfully.</p>
                    </div>
                ) : (
                    <>
                        <div className="modal-header">
                            <h2>Share Your Feedback</h2>
                            <button className="close-btn" onClick={onClose}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="form-group">
                                <label>Your Rating</label>
                                <div className="rating-display">
                                    {[...Array(5)].map((_, index) => (
                                        <span key={index} className={index < rating ? 'star filled' : 'star'}>
                                            ★
                                        </span>
                                    ))}
                                    <span className="rating-text">{rating} out of 5 stars</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="review">Your Review</label>
                                <textarea
                                    id="review"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Tell us what you think about the website..."
                                    rows="5"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default RatingModal;
