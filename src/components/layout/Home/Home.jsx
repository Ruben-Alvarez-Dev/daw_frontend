import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const images = [
        {
            url: '/images/restaurant/restaurant-1.jpg',
            alt: 'Elegant restaurant interior with modern lighting'
        },
        {
            url: '/images/restaurant/restaurant-2.jpg',
            alt: 'Gourmet dishes presentation'
        },
        {
            url: '/images/restaurant/restaurant-3.jpg',
            alt: 'Cozy dining area with ambient lighting'
        },
        {
            url: '/images/restaurant/restaurant-4.jpg',
            alt: 'Restaurant bar and lounge area'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [images.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="home-container">
            <div className="home-welcome">
                <h2>Bienvenido a RestaurantApp</h2>
                <p>
                    Descubre una experiencia culinaria única en el corazón de la ciudad. 
                </p>
                <p>
                    Nuestro restaurante combina la tradición de la cocina local con toques 
                    modernos e innovadores, creando platos que deleitarán todos tus sentidos.                </p>
            </div>

            <div className="carousel">
                <div 
                    className="carousel-inner" 
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {images.map((image, index) => (
                        <div key={index} className="carousel-item">
                            <img src={image.url} alt={image.alt} />
                        </div>
                    ))}
                </div>

                <button 
                    className="carousel-control prev" 
                    onClick={prevSlide}
                    aria-label="Anterior"
                >
                    &#10094;
                </button>
                <button 
                    className="carousel-control next" 
                    onClick={nextSlide}
                    aria-label="Siguiente"
                >
                    &#10095;
                </button>

                <div className="carousel-indicators">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Ir a imagen ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
