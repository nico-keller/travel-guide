import React, { useState } from 'react';
import axios from 'axios';

function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerateImage = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/generate_image', { prompt });
            setImageUrl(response.data.image_url);
            setError(null);
        } catch (error) {
            setError('Error generating image');
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Generate AI Image</h1>
            <form onSubmit={handleGenerateImage}>
                <div>
                    <label>Image Prompt:</label>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Generate Image</button>
            </form>

            {error && <p>{error}</p>}
            {imageUrl && (
                <div>
                    <h2>Generated Image</h2>
                    <img src={imageUrl} alt="Generated AI" style={{ maxWidth: '100%' }} />
                </div>
            )}
        </div>
    );
}

export default ImageGenerator;
