import React, { useState, useEffect } from 'react';
import './Carousel.css';

export default function Carousel({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="carousel">
            <button className="carousel-button prev" onClick={goToPrev}>&#10094;</button>
            <img 
                src={images[currentIndex].url} 
                alt={images[currentIndex].alt}
                className="carousel-image"
            />
            <button className="carousel-button next" onClick={goToNext}>&#10095;</button>
        </div>
    );
}
