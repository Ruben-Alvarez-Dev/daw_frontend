import React, { useState, useEffect } from 'react';
import './Home.css';
import Carousel from './Carousel/Carousel';

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
                    modernos e innovadores, creando platos que deleitarán todos tus sentidos.
                </p>
            </div>

            <Carousel 
                images={images}
                currentSlide={currentSlide}
                onNext={nextSlide}
                onPrev={prevSlide}
                onSelect={goToSlide}
            />
        </div>
    );
};

export default Home;
