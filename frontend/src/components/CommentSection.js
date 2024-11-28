import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/CommentSection.css';

const API_BASE_URL = 'http://127.0.0.1:5000';

function CommentSection({ planId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [author, setAuthor] = useState('');
    const [error, setError] = useState(null);

    const fetchComments = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/plans/${planId}/comments`);
            setComments(response.data);
        } catch (err) {
            setError('Failed to load comments');
            console.error(err);
        }
    }, [planId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !author.trim()) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/api/plans/${planId}/comments`, {
                content: newComment,
                author: author
            });
            setNewComment('');
            fetchComments(); // Refresh comments after posting
            setError(null);
        } catch (err) {
            setError('Failed to add comment');
            console.error(err);
        }
    };

    return (
        <div className="comments-section">
            <h2 className="section-title">Comments</h2>
            
            <form onSubmit={handleSubmit} className="comment-form">
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Your name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="form-textarea"
                        required
                    />
                </div>
                <button type="submit" className="btn">Add Comment</button>
            </form>

            {error && <div className="error-message">{error}</div>}

            <div className="comments-list">
                {comments.map((comment) => (
                    <div key={comment.id} className="comment-card">
                        <div className="comment-header">
                            <strong>{comment.author}</strong>
                            <span className="comment-date">
                                {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="comment-content">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommentSection; 