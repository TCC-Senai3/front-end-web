import React, { useState } from "react";
import inicial1 from "../../assets/images/Inicial1.png";
import inicial2_1 from "../../assets/images/Inicial2-1.png";
import inicial2_2 from "../../assets/images/Inicial2-2.png";
import inicial2 from "../../assets/images/Inicial2.png";
import leftArrow from "../../assets/images/Vector (2).png";
import rightArrow from "../../assets/images/Vector (1).png";
import "./style.css";

const slides = [
    { id: 1, image: inicial1, alt: "Guia de uso do Senai Skill Up" },
    { id: 2, image: inicial2, alt: "Tela inicial do Senai Skill Up 2-1" },
    { id: 3, image: inicial2_1, alt: "Tela inicial do Senai Skill Up 2-2" },
    { id: 4, image: inicial2_2, alt: "Tela inicial do Senai Skill Up 2" }
];

export default function Carousel() {
    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleDotClick = (index) => {
        setActiveIndex(index);
    };

    const currentSlide = slides[activeIndex];

    return (
        <section className="home-carousel" aria-label="Destaques do Senai Skill Up">
            <div className="home-carousel-container">
                <button
                    type="button"
                    className="home-carousel-arrow home-carousel-arrow-left"
                    onClick={handlePrev}
                    aria-label="Slide anterior"
                >
                    <img
                        src={leftArrow}
                        alt="Slide anterior"
                        className="home-carousel-arrow-icon"
                    />
                </button>

                <div className="home-carousel-card">
                    <img
                        src={currentSlide.image}
                        alt={currentSlide.alt}
                        className="home-carousel-image"
                    />
                </div>

                <button
                    type="button"
                    className="home-carousel-arrow home-carousel-arrow-right"
                    onClick={handleNext}
                    aria-label="Próximo slide"
                >
                    <img
                        src={rightArrow}
                        alt="Próximo slide"
                        className="home-carousel-arrow-icon"
                    />
                </button>
            </div>

            <div className="home-carousel-dots" aria-hidden="true">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        type="button"
                        className={
                            "home-carousel-dot" +
                            (index === activeIndex ? " home-carousel-dot--active" : "")
                        }
                        onClick={() => handleDotClick(index)}
                    />
                ))}
            </div>
        </section>
    );
}
