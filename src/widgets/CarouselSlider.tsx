import React, { useState, useEffect } from 'react';
import { CarouselBanner } from '../types';

interface CarouselSliderProps {
  banners: CarouselBanner[];
}

export const CarouselSlider: React.FC<CarouselSliderProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center my-2" id="carousel-section">
      <div className="w-full relative overflow-hidden rounded-xl shadow-xs aspect-[39/12] sm:aspect-[39/10] bg-slate-200">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={banner.id} className="min-w-full h-full flex-shrink-0">
              <img
                src={banner.imageSrc}
                alt={banner.alt}
                className="w-full h-full object-cover object-center cursor-pointer select-none"
                onClick={() => setCurrentIndex((index + 1) % banners.length)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center gap-1.5 mt-2" id="carousel-dots-indicator">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={banner.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-6 bg-[#8cc73f]'
                  : 'w-2.5 bg-white border border-[#8cc73f]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
