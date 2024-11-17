import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SharedStyles.css';

function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateImage = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/generate_image', { prompt });
            setImageUrl(response.data.image_url);
        } catch (error) {
            setError('Error generating image. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">AI Travel Image Generator</h1>
            
            <div className="form-container">
                <form onSubmit={handleGenerateImage}>
                    <div className="form-group">
                        <label className="form-label">Describe the travel scene you want to generate</label>
                        <textarea
                            className="form-textarea"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="E.g., A scenic sunset view of the Santorini coastline with white buildings and blue domes"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={`btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Generating...' : 'Generate Image'}
                    </button>
                </form>
            </div>

            {error && <div className="message error">{error}</div>}

            {imageUrl && (
                <div className="card image-result">
                    <h2 className="section-title">Generated Image</h2>
                    <div className="image-container">
                        <img 
                            src={imageUrl} 
                            alt="AI Generated travel scene" 
                            className="generated-image"
                        />
                    </div>
                    <div className="image-prompt">
                        <h3>Prompt Used:</h3>
                        <p>{prompt}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImageGenerator;
